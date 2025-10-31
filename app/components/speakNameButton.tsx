"use client";

import { GiSpeaker } from "react-icons/gi";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type SpeakNameButtonProps = {
  name: string;
};

export function SpeakNameButton({ name }: SpeakNameButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const hasSupport =
      typeof window !== "undefined" && "speechSynthesis" in window;
    setIsSupported(hasSupport);
    if (!hasSupport) return;

    const loadVoices = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      setVoices(loadedVoices);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const preferredVoice = useMemo(() => {
    if (!voices.length) return undefined;
    // Try to pick an English voice as a reasonable default; fall back to the first voice
    const englishVoice = voices.find((v) => v.name == "Daniel");
    return englishVoice;
  }, [voices]);

  const onSpeak = useCallback(() => {
    if (!isSupported) return;
    const utterance = new SpeechSynthesisUtterance(name);
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [isSupported, name, preferredVoice]);

  if (!isSupported) {
    return <></>;
  }

  return <GiSpeaker size={24} onClick={onSpeak} className="cursor-pointer" />;
}
