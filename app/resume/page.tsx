"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [resumeLinks, setResumeLinks] = useState<
    { viewUrl: string; pdfUrl: string } | null
  >(null);
  const hasGeneratedRef = useRef(false);

  const generateResume = useCallback(async () => {
    if (hasGeneratedRef.current) {
      return;
    }

    hasGeneratedRef.current = true;
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/resume", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate resume (status ${response.status})`
        );
      }

      const data = await response.json();
      const resumeEntry = Array.isArray(data) ? data[0] : data;

      if (!resumeEntry || typeof resumeEntry !== "object") {
        throw new Error("Resume service returned an unexpected response.");
      }

      const backendBase = "https://thebackend.rocket-champ.pw";
      const viewUrl = "viewUrl" in resumeEntry ? resumeEntry.viewUrl : null;
      const pdfUrl = "pdfUrl" in resumeEntry ? resumeEntry.pdfUrl : null;

      if (!viewUrl || !pdfUrl) {
        throw new Error("Resume service response is missing required URLs.");
      }

      setResumeLinks({
        viewUrl: new URL(viewUrl, backendBase).toString(),
        pdfUrl: new URL(pdfUrl, backendBase).toString(),
      });

      setStatus("success");
    } catch (err) {
      let errorMessage = "Unknown error";

      if (err instanceof Error) {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
          errorMessage =
            "Network error: Unable to connect to resume service. Please check your internet connection.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setStatus("error");
      hasGeneratedRef.current = false;
    }
  }, []);

  useEffect(() => {
    generateResume();
  }, [generateResume]);

  if (status === "loading") {
    return (
      <div>
        Generating resume links...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <div className="mt-4 space-x-2">
          <button
            onClick={() => {
              hasGeneratedRef.current = false;
              setError(null);
              setStatus("loading");
              generateResume();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!resumeLinks) {
    return (
      <div className="text-yellow-500">
        Resume generated but no links were provided. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-green-500">Resume is ready. Choose a format:</p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            window.open(resumeLinks.viewUrl, "_blank", "noopener,noreferrer");
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          View HTML Version
        </button>
        <button
          onClick={() => {
            window.open(resumeLinks.pdfUrl, "_blank", "noopener,noreferrer");
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download PDF Version
        </button>
      </div>
    </div>
  );
}
