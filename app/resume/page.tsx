"use client";
import { useEffect, useState, useRef } from "react";
import { RESUME_GIST_URL } from "src/features/resume/constants";

export default function Page() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple PDF generations
    if (hasGeneratedRef.current) {
      return;
    }

    const generatePDF = async () => {
      try {
        hasGeneratedRef.current = true;
        setStatus("loading");

        const resumeResponse = await fetch(RESUME_GIST_URL, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!resumeResponse.ok) {
          throw new Error(
            `Failed to fetch resume data (status ${resumeResponse.status})`
          );
        }

        const resumeJson = await resumeResponse.json();

        // Create FormData
        const formData = new FormData();

        // Convert JSON to Blob and append as file
        const jsonBlob = new Blob([JSON.stringify(resumeJson)], {
          type: "application/json",
        });

        formData.append("json-file", jsonBlob, "resume.json");

        const response = await fetch(
          "https://thebackend.rocket-champ.pw/resume",
          {
            method: "POST",
            body: formData,
            mode: "cors", // Explicitly set CORS mode
            credentials: "omit", // Don't send credentials
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Open in new tab
        window.open(url, "_blank");

        setStatus("success");

        // Clean up after delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        let errorMessage = "Unknown error";
        
        if (err instanceof Error) {
          if (err.name === "TypeError" && err.message.includes("fetch")) {
            errorMessage = "Network error: Unable to connect to PDF service. Please check your internet connection.";
          } else if (err.message.includes("CORS")) {
            errorMessage = "CORS error: The PDF service doesn't allow requests from this domain.";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        setStatus("error");
        // Reset the ref on error so user can retry
        hasGeneratedRef.current = false;
      }
    };

    generatePDF();
  }, []);

  if (status === "loading") {
    return (
      <div> 
        Generating PDF...
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
              // Trigger the effect again by updating a dependency
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry API
          </button>
          {/* <button
            onClick={() => {
              window.open("/resume.pdf", "_blank");
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download Static PDF
          </button> */}
        </div>
      </div>
    );
  }

  return <div className="text-green-500">PDF opened in new tab!</div>;
}
