"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const GoogleCalPopupBtn = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://calendar.google.com/calendar/scheduling-button-script.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add CSS to improve popup on mobile
    const style = document.createElement("style");
    style.textContent = `
      /* Google's popup overlay wrapper - use flex column */
      .hur54b {
        padding: 8px !important;
        align-items: start !important;
        flex-direction: column !important;
        justify-content: space-between !important;
      }
      /* Close button - positioned above iframe */
      .hur54b .Xfsokf {
        position: relative !important;
        order: -1 !important;
      }
      .Xfsokf {
        left: 0 !important;
        top: 0 !important;
        margin-bottom: 4px !important;
      }
      /* Google's popup iframe */
      .hur54b .mmGMM {
        max-width: 100% !important;
        width: 100% !important;
        max-height: calc(90vh - 50px) !important;
        border-radius: 16px !important;
      }
      @media (max-width: 480px) {
        .hur54b {
          padding: 4px !important;
        }
        .hur54b .mmGMM {
          max-height: calc(85vh - 50px) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (scriptLoaded && targetRef.current && containerRef.current) {
      // @ts-ignore
      window.calendar?.schedulingButton?.load({
        url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3KjpCPKOOLtxWwVyHEVvKt_OterndGFSrixoQkUdTrBsSjcOUIKlzuf_WxZ_3xIe_-V6oopYI4?gv=true",
        color: "#16a34a",
        label: "Book Me",
        target: targetRef.current,
      });

      // Style the button after it's inserted
      setTimeout(() => {
        const button = containerRef.current?.querySelector("button");
        if (button) {
          Object.assign(button.style, {
            padding: "12px 24px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#ffffff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          });

          // Add hover effects
          button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.05)";
            button.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
          });
          button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
            button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          });
        }
      }, 100);
    }
  }, [scriptLoaded]);

  return (
    <>
      <Script
        src="https://calendar.google.com/calendar/scheduling-button-script.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
        }}
      >
        <span ref={targetRef} style={{ display: "none" }} />
      </div>
    </>
  );
};

export default GoogleCalPopupBtn;
