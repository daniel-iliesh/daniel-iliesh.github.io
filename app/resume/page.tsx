"use client";
import { useCallback, useEffect, useState } from "react";

interface ResumeLinks {
  viewUrl: string;
  pdfUrl: string;
}

type GenerationStatus = "idle" | "loading" | "success" | "error";
type ThemeStatus = "loading" | "success" | "error";

export default function Page() {
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [themesStatus, setThemesStatus] = useState<ThemeStatus>("loading");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resumeLinks, setResumeLinks] = useState<ResumeLinks | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setThemesStatus("loading");
        const response = await fetch("/api/resume/themes", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load themes (status ${response.status}).`
          );
        }

        const themeList: unknown = await response.json();

        if (!Array.isArray(themeList) || themeList.some((item) => typeof item !== "string")) {
          throw new Error("Themes response format is invalid.");
        }

        setThemes(themeList);
        setSelectedTheme((current) => current || themeList[0] || "");
        setThemesStatus("success");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setThemesStatus("error");
        setError(message);
      }
    };

    fetchThemes();
  }, []);

  const generateResume = useCallback(async () => {
    if (!selectedTheme) {
      setError("Please select a theme before generating the resume.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(`/api/resume?theme=${encodeURIComponent(selectedTheme)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate resume (status ${response.status}).`
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
      const message = err instanceof Error ? err.message : "Unknown error";
      setStatus("error");
      setError(message);
    }
  }, [selectedTheme]);

  const isLoadingThemes = themesStatus === "loading";
  const isGenerating = status === "loading";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Generate Resume</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Choose a theme and generate the latest resume from the gist data.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Theme
            <select
              value={selectedTheme}
              onChange={(event) => setSelectedTheme(event.target.value)}
              disabled={isLoadingThemes || isGenerating || themesStatus === "error"}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {themesStatus === "loading" && <option>Loading themes…</option>}
              {themesStatus === "error" && <option>Unable to load themes</option>}
              {themesStatus === "success" && themes.length === 0 && (
                <option>No themes available</option>
              )}
              {themesStatus === "success" &&
                themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
            </select>
          </label>

          <button
            type="button"
            onClick={generateResume}
            disabled={
              isLoadingThemes || isGenerating || themesStatus !== "success" || !selectedTheme
            }
            className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
          >
            {isGenerating ? "Generating…" : "Generate Resume"}
          </button>
        </div>

        {themesStatus === "error" && (
          <p className="text-sm text-red-500">
            Failed to load themes. {error}
          </p>
        )}
      </div>

      {status === "error" && (
        <div className="rounded-md border border-red-500/60 bg-red-950/40 p-4 text-red-400">
          <p className="font-medium">Generation failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {status === "success" && resumeLinks && (
        <div className="space-y-3">
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
      )}
    </div>
  );
}
