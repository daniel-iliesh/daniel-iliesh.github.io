'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

interface HitboxPadding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface SantaSpriteProps {
  enabled?: boolean;
  scale?: number;
  gravity?: number;
  bounce?: number;
  friction?: number;
  /** Optional hitbox padding (source px) to compensate for transparent margins around the sprite */
  padding?: HitboxPadding;
}

export function SantaSprite({ 
  enabled = true, 
  scale = 0.15,
  gravity = 0.5,
  bounce = 0.4,
  friction = 0.98,
  padding = { bottom: 65, top: 25, left: 200, right: 350 },
}: SantaSpriteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    let app: PIXI.Application;
    let santa: PIXI.AnimatedSprite;
    let idleTextures: PIXI.Texture[] = [];
    let jumpTextures: PIXI.Texture[] = [];
    let walkTextures: PIXI.Texture[] = [];
    let runTextures: PIXI.Texture[] = [];
    let slideTextures: PIXI.Texture[] = [];
    let deadTextures: PIXI.Texture[] = [];
    let isDragging = false;
    let currentAnimation: 'idle' | 'jump' | 'walk' | 'run' | 'slide' | 'dead' = 'walk';
    let velocity = { x: 0, y: 0 };
    let isGrounded = false;
    let hasEnteredScreen = false;
    let observer: MutationObserver | null = null;
    let blockNextClick = false;
    let isPreloading = true;
    let preloadBaseX = 0;
    let preloadBaseY = 0;
    let entranceStart = 0;
    const entranceDuration = 900; // ms
    let overlayEl: HTMLDivElement | null = null;
    let isEntering = false;
    let facing: -1 | 1 = 1;
    let prevTouchAction: string | null = null;
    let aiNextActionAt = 0;
    let desiredVX = 0; // AI target horizontal velocity
    let slideTimer = 0;
    let isDead = false;
    let reviveTimeout: number | null = null;
    let deadReverseTextures: PIXI.Texture[] = [];
    let platformRects: Array<{ left: number; right: number; top: number }> = [];
    let platformDirty = true;
    let isHovering = false;
    const markPlatformsDirty = () => {
      platformDirty = true;
    };
    const refreshPlatformRects = () => {
      if (!platformDirty) return;
      platformDirty = false;
      platformRects = Array.from(document.querySelectorAll<HTMLElement>('.santa-interactive'))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width && rect.height
            ? { left: rect.left, right: rect.right, top: rect.top }
            : null;
        })
        .filter(Boolean) as typeof platformRects;
    };
    const animSpeeds = {
      idle: 0.15, // ~9 fps
      walk: 0.2, // ~12 fps
      run: 0.3, // ~18 fps
      slide: 0.3, // ~18 fps
      jump: 0.24, // ~14 fps
      dead: 0.23, // ~14 fps
      revive: 0.23, // ~14 fps
    };
    const clearReviveTimeout = () => {
      if (reviveTimeout !== null) {
        window.clearTimeout(reviveTimeout);
        reviveTimeout = null;
      }
    };
    const wakeSantaForDrag = () => {
      if (!santa) return;
      if (isDead) {
        isDead = false;
        desiredVX = 0;
        velocity = { x: 0, y: 0 };
        clearReviveTimeout();
      }
      startJumpAnimation();
    };
    const startJumpAnimation = () => {
      if (!santa) return;
      currentAnimation = 'jump';
      santa.onComplete = undefined;
      santa.textures = jumpTextures;
      santa.animationSpeed = animSpeeds.jump;
      santa.loop = false;
      // Immediately hold the mid-air frame to avoid playing the full jump loop.
      const midFrame = Math.max(0, Math.floor(jumpTextures.length / 2));
      santa.gotoAndStop(midFrame);
    };

    const init = async () => {
      // Create PixiJS app
      app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas as HTMLCanvasElement);
        const canvasEl = app.canvas as HTMLCanvasElement;
        canvasEl.style.position = 'fixed';
        canvasEl.style.top = '0';
        canvasEl.style.left = '0';
        canvasEl.style.width = '100%';
        canvasEl.style.height = '100%';
        canvasEl.style.pointerEvents = 'none';
        canvasEl.style.zIndex = '9999';
        // Fullscreen dark overlay during preload
        overlayEl = document.createElement('div');
        overlayEl.style.position = 'fixed';
        overlayEl.style.inset = '0';
        overlayEl.style.background = 'rgba(0,0,0,0.92)';
        overlayEl.style.zIndex = '9998';
        overlayEl.style.pointerEvents = 'none';
        overlayEl.style.transition = 'opacity 250ms ease';
        overlayEl.style.opacity = '1';
        containerRef.current.appendChild(overlayEl);
        overlayRef.current = overlayEl;
      }

      appRef.current = app;

      // Load sprite frames
      const idleFrameCount = 16;
      const jumpFrameCount = 16;
      const walkFrameCount = 13;
      const runFrameCount = 11;
      const slideFrameCount = 11;
      const deadFrameCount = 17;

      // Load Idle animation frames
      for (let i = 1; i <= idleFrameCount; i++) {
        const texture = await PIXI.Assets.load(`/img/SantaSprites/webp/Idle (${i}).webp`);
        idleTextures.push(texture);
      }

      // Load Jump animation frames
      for (let i = 1; i <= jumpFrameCount; i++) {
        const texture = await PIXI.Assets.load(`/img/SantaSprites/webp/Jump (${i}).webp`);
        jumpTextures.push(texture);
      }

      // Load Walk animation frames
      for (let i = 1; i <= walkFrameCount; i++) {
        const texture = await PIXI.Assets.load(`/img/SantaSprites/webp/Walk (${i}).webp`);
        walkTextures.push(texture);
      }

      for (let i = 1; i <= runFrameCount; i++) {
        const texture = await PIXI.Assets.load(`/img/SantaSprites/webp/Run (${i}).webp`);
        runTextures.push(texture);
      }

      for (let i = 1; i <= slideFrameCount; i++) {
        const texture = await PIXI.Assets.load(`/img/SantaSprites/webp/Slide (${i}).webp`);
        slideTextures.push(texture);
      }

      for (let i = 1; i <= deadFrameCount; i++) {
        const texture = await PIXI.Assets.load(`/img/SantaSprites/webp/Dead (${i}).webp`);
        deadTextures.push(texture);
      }
      deadReverseTextures = [...deadTextures].slice().reverse();

      // Create animated sprite starting with walk (for entrance)
      santa = new PIXI.AnimatedSprite(walkTextures);
      santa.anchor.set(0.5);
      const baseScale = scale;
      const applyFacing = (dir: -1 | 1) => {
        if (!santa) return;
        if (facing !== dir) {
          facing = dir;
        }
        santa.scale.set(baseScale * facing, baseScale);
      };
      applyFacing(1);
      santa.alpha = 1;
      
      // Start Santa centered while loading
      const spriteWidth = santa.width;
      const spriteHeight = santa.height;
      const halfH = spriteHeight / 2;
      const halfW = spriteWidth / 2;
      const padTopPx = (padding.top ?? 0) * scale;
      const padBottomPx = (padding.bottom ?? 0) * scale;
      const padLeftPx = (padding.left ?? 0) * scale;
      const padRightPx = (padding.right ?? 0) * scale;

      const effectiveHalfHBottom = Math.max(halfH - padBottomPx, halfH * 0.5);

      santa.x = window.innerWidth * 0.5;
      santa.y = window.innerHeight * 0.45;
      preloadBaseX = santa.x;
      preloadBaseY = santa.y;
      
      santa.animationSpeed = animSpeeds.walk;
      santa.play();

      // Make interactive
      santa.eventMode = 'static';
      santa.cursor = 'grab'; // Open hand on hover
      
      // Allow the page to stay clickable; we handle hit-testing manually
      if (app.canvas) {
        (app.canvas as HTMLCanvasElement).style.pointerEvents = 'none';
      }

      // Entrance animation target (bottom-left padding)
      // We will fall from preload position; target is just below the screen bottom padding
      const entranceTargetX = santa.x;

      // Drag and drop handlers using window events so the page remains clickable
      let dragOffset = { x: 0, y: 0 };
      let lastMousePos = { x: 0, y: 0 };
      let lastSantaPos = { x: santa.x, y: santa.y };

      const getBounds = () => {
        if (!santa) return null;
        const w = santa.width;
        const h = santa.height;
        return {
          left: santa.x - w / 2,
          right: santa.x + w / 2,
          top: santa.y - h / 2,
          bottom: santa.y + h / 2,
        };
      };

      const isPointerOnSanta = (x: number, y: number) => {
        const b = getBounds();
        if (!b) return false;
        return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
      };

      const setBodyCursor = (cursor: string) => {
        document.body.style.cursor = cursor;
      };

      const onWindowPointerMove = (event: PointerEvent) => {
        if (!santa) return;
        const x = event.clientX;
        const y = event.clientY;
        const overSanta = isPointerOnSanta(x, y);
        isHovering = overSanta;

        if (!isDragging) {
          setBodyCursor(overSanta ? 'grab' : '');
        }

        if (isDragging) {
          lastSantaPos = { x: santa.x, y: santa.y };
          santa.x = x - dragOffset.x;
          santa.y = y - dragOffset.y;

          velocity.x = (x - lastMousePos.x) * 0.5;
          velocity.y = (y - lastMousePos.y) * 0.5;
          lastMousePos = { x, y };

          if (Math.abs(velocity.x) > 0.5) {
            applyFacing(velocity.x > 0 ? 1 : -1);
          }

          event.preventDefault();
        }
      };

      const onWindowPointerDown = (event: PointerEvent) => {
        // Allow natural page scroll on touch devices; drag only with mouse/stylus
        if (event.pointerType === 'touch') return;
        const x = event.clientX;
        const y = event.clientY;
        const overSanta = isPointerOnSanta(x, y);
        if (!overSanta) return;

        isDragging = true;
        setBodyCursor('grabbing');
        // Prevent page scroll while dragging on touch
        prevTouchAction = document.documentElement.style.touchAction;
        document.documentElement.style.touchAction = 'none';
        velocity = { x: 0, y: 0 }; // Stop physics
        dragOffset = {
          x: x - santa.x,
          y: y - santa.y,
        };
        lastMousePos = { x, y };
        lastSantaPos = { x: santa.x, y: santa.y };

        // Switch to jump animation when picked up
        wakeSantaForDrag();
        blockNextClick = true;
        event.preventDefault();
      };

      const onWindowPointerUp = (event: PointerEvent) => {
        if (isDragging) {
          isDragging = false;
          const overSanta = isPointerOnSanta(event.clientX, event.clientY);
          setBodyCursor(overSanta ? 'grab' : '');
          if (prevTouchAction !== null) {
            document.documentElement.style.touchAction = prevTouchAction;
            prevTouchAction = null;
          }
          // Velocity already set from drag movement, physics will take over
          blockNextClick = true;
          event.preventDefault();
        }
      };

      const onWindowClickCapture = (event: MouseEvent) => {
        if (blockNextClick) {
          blockNextClick = false;
          event.stopPropagation();
          event.preventDefault();
        }
      };

      window.addEventListener('pointermove', onWindowPointerMove, { passive: false });
      window.addEventListener('pointerdown', onWindowPointerDown, { passive: false, capture: true });
      window.addEventListener('pointerup', onWindowPointerUp, { passive: false, capture: true });
      window.addEventListener('click', onWindowClickCapture, true);

      const endPreload = () => {
        if (!isPreloading) return;
        isPreloading = false;
        entranceStart = performance.now();
        isEntering = true;
        velocity = { x: 0, y: 0 };
        aiNextActionAt = performance.now() + 1500;
        if (overlayEl) {
          overlayEl.style.opacity = '0';
          window.setTimeout(() => {
            overlayEl?.remove();
            overlayRef.current = null;
          }, 260);
        }
      };
      window.addEventListener('load', endPreload, { once: true });
      const preloadTimeout = window.setTimeout(endPreload, 2500);

      // Mark external FAB (Cal.com) as interactive so Santa can land on it
      const markInteractiveFab = () => {
        const selectors = ['[data-cal-embed-floating-button]', '.Cal__FloatingButton', '.floating-cal-badge-button'];
        selectors.forEach((sel) => {
          document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
            el.classList.add('santa-interactive');
          });
        });
      };

      markInteractiveFab();
      observer = new MutationObserver(() => {
        markInteractiveFab();
        markPlatformsDirty();
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Physics and animation loop
      app.ticker.add(() => {
        const spriteWidth = santa.width;
        const spriteHeight = santa.height;
        const halfW = spriteWidth / 2;
        const halfH = spriteHeight / 2;
        const effectiveHalfHBottom = Math.max(halfH - padBottomPx, halfH * 0.5);
        const effectiveHalfHTop = Math.max(halfH - padTopPx, halfH * 0.5);
        const effectiveHalfWLeft = Math.max(halfW - padLeftPx, halfW * 0.5);
        const effectiveHalfWRight = Math.max(halfW - padRightPx, halfW * 0.5);
        let groundY = app.screen.height - effectiveHalfHBottom;

        // Preload: keep Santa still at center
        if (isPreloading) {
          santa.x = preloadBaseX;
          santa.y = preloadBaseY;
          velocity = { x: 0, y: 0 };
          return;
        }

        // Platform collision with .santa-interactive elements (e.g., FAB)
        // Use predicted next position and cached rects to reduce lag and layout thrash.
        refreshPlatformRects();
        const nextX = santa.x + (isDragging ? 0 : velocity.x);
        const nextY = santa.y + (isDragging ? 0 : velocity.y);
        for (const rect of platformRects) {
          const overlapX =
            nextX + effectiveHalfWRight > rect.left &&
            nextX - effectiveHalfWLeft < rect.right;
          const abovePlatform = nextY <= rect.top;
          if (overlapX && abovePlatform && velocity.y >= 0) {
            const candidateGround = rect.top - effectiveHalfHBottom;
            if (candidateGround < groundY) {
              groundY = candidateGround;
            }
          }
        }

        // Entrance animation: let gravity drop from preload position to ground
        if (isEntering && !hasEnteredScreen) {
          velocity.x = 0;
          velocity.y += gravity;
          santa.y += velocity.y;

          // Ground collision
          if (santa.y >= groundY) {
            santa.y = groundY;
            velocity.y = 0;
            hasEnteredScreen = true;
            isEntering = false;
            currentAnimation = 'idle';
            santa.onComplete = undefined;
            santa.textures = idleTextures;
            santa.animationSpeed = animSpeeds.idle;
            santa.loop = true;
            santa.play();
          } else {
            // Keep walk/air animation during fall
            if (currentAnimation !== 'jump') {
              startJumpAnimation();
            }
          }
          return;
        }

        // Only apply physics when not dragging and after entrance
        if (!isDragging && hasEnteredScreen) {
          // Simple AI: occasionally walk or jump
          const now = performance.now();
          if (!isDead && now >= aiNextActionAt) {
            const groundedEnough = isGrounded || Math.abs(velocity.y) < 0.01;
            const actionRoll = Math.random();
            if (groundedEnough) {
              if (actionRoll < 0.35) {
                // walk left (slower)
                desiredVX = rand(-2.4, -1.6);
                applyFacing(-1);
              } else if (actionRoll < 0.7) {
                // walk right (slower)
                desiredVX = rand(1.6, 2.4);
                applyFacing(1);
              } else if (actionRoll < 0.85) {
                // run burst
                desiredVX = rand(-4.5, 4.5);
                if (Math.abs(desiredVX) < 3.8) desiredVX = desiredVX < 0 ? -3.9 : 3.9;
                applyFacing(desiredVX > 0 ? 1 : -1);
              } else if (actionRoll < 0.93) {
                // fast dash to encourage a self-slide
                desiredVX = rand(-6, 6);
                if (Math.abs(desiredVX) < 5.2) desiredVX = desiredVX < 0 ? -5.2 : 5.2;
                applyFacing(desiredVX > 0 ? 1 : -1);
              } else if (actionRoll < 0.9) {
                // hop up
                velocity.y = -rand(10, 14);
                desiredVX = desiredVX * 0.6; // keep some drift
              } else {
                // stay idle
                desiredVX = 0;
              }
            }
            aiNextActionAt = now + rand(1400, 2800);
          }

          // Apply gravity
          if (!isDead) {
            velocity.y += gravity;
          }

          // Accelerate toward desired velocity for smoother starts
          if (!isDead) {
            const accel = 0.18;
            if (desiredVX > velocity.x) {
              velocity.x = Math.min(velocity.x + accel, desiredVX);
            } else if (desiredVX < velocity.x) {
              velocity.x = Math.max(velocity.x - accel, desiredVX);
            }

            // Apply friction to horizontal movement
            velocity.x *= friction;
          }

          if (Math.abs(velocity.x) > 0.5) {
            applyFacing(velocity.x > 0 ? 1 : -1);
          }

          // Update position
          santa.x += velocity.x;
          santa.y += velocity.y;

          // Floor collision
          if (santa.y >= groundY) {
            santa.y = groundY;
            const impactSpeed = Math.abs(velocity.y);
            velocity.y *= -bounce; // Bounce
            // Dead if heavy impact
            if (!isDead && impactSpeed > 15) {
              isDead = true;
              desiredVX = 0;
              velocity.x = 0;
              velocity.y = 0;
              slideTimer = 0;
              currentAnimation = 'dead';
              santa.textures = deadTextures;
              santa.animationSpeed = animSpeeds.dead;
              santa.loop = false;
              santa.play();
              santa.onComplete = () => {
                if (!isDead) return;
                // Stay down for a bit
                reviveTimeout = window.setTimeout(() => {
                  if (!isDead) return;
                  // Play reverse dead to stand up
                  santa.textures = deadReverseTextures;
                  santa.animationSpeed = animSpeeds.revive;
                  santa.loop = false;
                  santa.play();
                  santa.onComplete = () => {
                    if (!isDead) return;
                    isDead = false;
                    currentAnimation = 'idle';
                    santa.textures = idleTextures;
                    santa.loop = true;
                    santa.animationSpeed = animSpeeds.idle;
                    santa.play();
                    aiNextActionAt = performance.now() + 1800;
                  };
                }, 2000);
              };
            }

            // Stop bouncing if velocity is too small
            if (Math.abs(velocity.y) < 1) {
              velocity.y = 0;
              isGrounded = true;
            }
          } else {
            isGrounded = false;
          }

          // Wall collisions
          const leftWall = effectiveHalfWLeft;
          const rightWall = app.screen.width - effectiveHalfWRight;
          
          if (santa.x <= leftWall) {
            santa.x = leftWall;
            velocity.x *= -bounce;
          } else if (santa.x >= rightWall) {
            santa.x = rightWall;
            velocity.x *= -bounce;
          }

          // Ceiling collision
          const ceiling = effectiveHalfHTop;
          if (santa.y <= ceiling) {
            santa.y = ceiling;
            velocity.y *= -bounce;
          }

          // Switch between idle and jump animations based on grounded state (skip if dead)
          const isMoving = Math.abs(velocity.x) > 0.5 || Math.abs(velocity.y) > 0.5;
          
          if (!isDead) {
            // Trigger a brief slide when landing fast
            if (isGrounded && Math.abs(velocity.x) > 4.5 && Math.abs(velocity.y) < 0.2) {
              slideTimer = 300; // ms
            }

            // Hover stop: pause horizontal intent when the cursor is over Santa
            if (isHovering) {
              desiredVX = 0;
              velocity.x *= 0.6;
              aiNextActionAt = performance.now() + 800;
              if (isGrounded && hasEnteredScreen) {
                if (currentAnimation !== 'idle') {
                  currentAnimation = 'idle';
                  santa.onComplete = undefined;
                  santa.textures = idleTextures;
                  santa.animationSpeed = animSpeeds.idle;
                  santa.loop = true;
                  santa.play();
                }
              }
            }

            if (slideTimer > 0) {
              slideTimer -= app.ticker.deltaMS;
              if (currentAnimation !== 'slide') {
                currentAnimation = 'slide';
                santa.onComplete = undefined;
                santa.textures = slideTextures;
                santa.animationSpeed = animSpeeds.slide;
                santa.loop = true;
                santa.play();
              }
            } else if (isGrounded && Math.abs(velocity.x) > 4.2) {
              if (currentAnimation !== 'run') {
                currentAnimation = 'run';
                santa.onComplete = undefined;
                santa.textures = runTextures;
                santa.animationSpeed = animSpeeds.run;
                santa.loop = true;
                santa.play();
              }
            } else if (isGrounded && Math.abs(velocity.x) > 0.6) {
              if (currentAnimation !== 'walk') {
                currentAnimation = 'walk';
                santa.onComplete = undefined;
                santa.textures = walkTextures;
                santa.animationSpeed = animSpeeds.walk;
                santa.loop = true;
                santa.play();
              }
            } else if (isGrounded && Math.abs(velocity.x) <= 0.6) {
              if (currentAnimation !== 'idle') {
                currentAnimation = 'idle';
                santa.onComplete = undefined;
                santa.textures = idleTextures;
                santa.animationSpeed = animSpeeds.idle;
                santa.loop = true;
                santa.play();
              }
            } else if (!isGrounded && currentAnimation !== 'jump') {
              startJumpAnimation();
            }
          }
        }
      });

      app.stage.addChild(santa);
      setIsLoaded(true);

      // Handle window resize
      const handleResize = () => {
        const oldWidth = app.screen.width;
        const oldHeight = app.screen.height;
        
        app.renderer.resize(window.innerWidth, window.innerHeight);
        
        // Adjust Santa's position proportionally
        if (!isDragging) {
          const xRatio = santa.x / oldWidth;
          const yRatio = santa.y / oldHeight;
          santa.x = xRatio * window.innerWidth;
          santa.y = yRatio * window.innerHeight;
        }
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', markPlatformsDirty, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', onWindowPointerMove);
        window.removeEventListener('pointerdown', onWindowPointerDown, true as any);
        window.removeEventListener('pointerup', onWindowPointerUp, true as any);
        window.removeEventListener('click', onWindowClickCapture, true);
        window.removeEventListener('scroll', markPlatformsDirty, true as any);
        window.clearTimeout(preloadTimeout);
        setBodyCursor('');
        if (prevTouchAction !== null) {
          document.documentElement.style.touchAction = prevTouchAction;
          prevTouchAction = null;
        }
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        if (reviveTimeout !== null) {
          window.clearTimeout(reviveTimeout);
          reviveTimeout = null;
        }
      };
    };

    init();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
      window.removeEventListener('scroll', markPlatformsDirty, true as any);
    };
  }, [enabled, scale, gravity, bounce, friction]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // Let page interactions pass through; we use window-level listeners for Santa.
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
}

