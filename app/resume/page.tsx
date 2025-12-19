"use client";
import { useCallback, useEffect, useState } from "react";
import {
  RESUME_BACKEND_BASE_URL,
  RESUME_BACKEND_RESUME_URL,
  RESUME_BACKEND_THEMES_URL,
  RESUME_GIST_URL,
} from "src/features/resume/constants";
import { Resume } from "src/features/resume/types";

interface ResumeLinks {
  viewUrl: string;
  pdfUrl: string;
}

type Status = "idle" | "loading" | "success" | "error";

function resolveResumeUrl(url: string) {
  try {
    return new URL(url).toString();
  } catch {
    return new URL(url, RESUME_BACKEND_BASE_URL).toString();
  }
}

export default function Page() {
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [themesStatus, setThemesStatus] = useState<Status>("loading");
  const [generationStatus, setGenerationStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resumeLinks, setResumeLinks] = useState<ResumeLinks | null>(null);
  const [resumeJson, setResumeJson] = useState<Resume | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setThemesStatus("loading");
        const response = await fetch(RESUME_BACKEND_THEMES_URL, {
          cache: "no-store",
          mode: "cors",
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
    if (!resumeJson) {
      // Fetch resume from gist first
      try {
        setGenerationStatus("loading");
    setError(null);
    setResumeLinks(null);

      const response = await fetch(RESUME_GIST_URL, {
        cache: "no-store",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch resume data (status ${response.status}).`);
      }

      const resume = (await response.json()) as Resume;
      setResumeJson(resume);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
        setGenerationStatus("error");
      setError(message);
        return;
      }
    }

    if (!selectedTheme) {
      setError("Please select a theme before generating the resume.");
      return;
    }

    try {
      setGenerationStatus("loading");
      setResumeLinks(null);
      setError(null);

      const backendUrl = `${RESUME_BACKEND_RESUME_URL}?theme=${encodeURIComponent(
        selectedTheme
      )}`;

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeJson),
        mode: "cors",
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

      const viewUrl = "viewUrl" in resumeEntry ? resumeEntry.viewUrl : null;
      const pdfUrl = "pdfUrl" in resumeEntry ? resumeEntry.pdfUrl : null;

      if (!viewUrl || !pdfUrl) {
        throw new Error("Resume service response is missing required URLs.");
      }

      setResumeLinks({
        viewUrl: resolveResumeUrl(viewUrl),
        pdfUrl: resolveResumeUrl(pdfUrl),
      });

      setGenerationStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setGenerationStatus("error");
      setError(message);
    }
  }, [resumeJson, selectedTheme]);

  const isLoadingThemes = themesStatus === "loading";
  const isGenerating = generationStatus === "loading";

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">Résumé</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Download my résumé in your preferred format and theme.
        </p>
      </header>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Select theme and generate</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Choose a theme and generate your résumé from the latest data.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:max-w-sm">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Theme
            <select
              value={selectedTheme}
              onChange={(event) => setSelectedTheme(event.target.value)}
              disabled={isLoadingThemes || isGenerating || themesStatus === "error"}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500"
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
        </div>

        {themesStatus === "error" && (
          <p className="text-sm text-red-500">
            Failed to load themes. {error}
          </p>
        )}

        <button
          type="button"
          onClick={generateResume}
          disabled={
            !selectedTheme ||
            isLoadingThemes ||
            isGenerating ||
            themesStatus !== "success"
          }
          className="inline-flex items-center justify-center rounded-md bg-blue-600 dark:bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? "Generating…" : "Generate résumé"}
        </button>
      </section>

      {generationStatus === "error" && error && (
        <div className="rounded-md border border-red-500/60 bg-red-50 dark:bg-red-950/40 p-4 text-red-600 dark:text-red-400">
          <p className="font-medium">Generation failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {generationStatus === "success" && resumeLinks && (
        <div className="space-y-3">
          <p className="text-green-600 dark:text-green-500">
            Résumé is ready. Choose a format:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                window.open(resumeLinks.viewUrl, "_blank", "noopener,noreferrer");
              }}
              className="rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              View HTML version
            </button>
            <button
              onClick={() => {
                window.open(resumeLinks.pdfUrl, "_blank", "noopener,noreferrer");
              }}
              className="rounded-md bg-green-600 dark:bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 dark:hover:bg-green-600"
            >
              Download PDF version
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
