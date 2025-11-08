"use client";
import { useCallback, useEffect, useState } from "react";
import {
  RESUME_BACKEND_BASE_URL,
  RESUME_BACKEND_RESUME_URL,
  RESUME_BACKEND_THEMES_URL,
  RESUME_GIST_URL,
  RESUME_TAILORING_URL,
} from "src/features/resume/constants";

interface ResumeLinks {
  viewUrl: string;
  pdfUrl: string;
}

interface ResumeTailoringRequest {
  linkedin_url?: string;
  job_description?: string;
  theme: string;
  resume: unknown;
}

interface ResumeTailoringResponse {
  viewUrl: string;
  pdfUrl: string;
}

type GenerationStatus = "idle" | "loading" | "success" | "error";
type ThemeStatus = "loading" | "success" | "error";

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
  const [themesStatus, setThemesStatus] = useState<ThemeStatus>("loading");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resumeLinks, setResumeLinks] = useState<ResumeLinks | null>(null);
  const [activeOperation, setActiveOperation] = useState<"general" | "tailored" | null>(null);
  const [resultType, setResultType] = useState<"general" | "tailored" | null>(null);
  const [tailorMode, setTailorMode] = useState<"linkedin" | "description">("linkedin");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFlow, setSelectedFlow] = useState<"general" | "tailored">("general");

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

  const tailorResume = useCallback(async () => {
    if (!selectedTheme) {
      setError("Please select a theme before tailoring the resume.");
      return;
    }

    const trimmedLinkedinUrl = linkedinUrl.trim();
    const trimmedJobDescription = jobDescription.trim();

    if (tailorMode === "linkedin" && !trimmedLinkedinUrl) {
      setError("Please provide a LinkedIn job URL to tailor the resume.");
      return;
    }

    if (tailorMode === "description" && !trimmedJobDescription) {
      setError("Please provide a job description to tailor the resume.");
      return;
    }

    setActiveOperation("tailored");
    setStatus("loading");
    setError(null);
    setResumeLinks(null);
    setResultType(null);

    try {
      const resumeResponse = await fetch(RESUME_GIST_URL, {
        cache: "no-store",
        mode: "cors",
      });

      if (!resumeResponse.ok) {
        throw new Error(
          `Failed to fetch resume data (status ${resumeResponse.status}).`
        );
      }

      const resumeJson = await resumeResponse.json();

      const requestBody: ResumeTailoringRequest = {
        theme: selectedTheme,
        resume: resumeJson,
      };

      if (tailorMode === "linkedin") {
        requestBody.linkedin_url = trimmedLinkedinUrl;
      } else {
        requestBody.job_description = trimmedJobDescription;
      }

      const response = await fetch(RESUME_TAILORING_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to tailor resume (status ${response.status}).`
        );
      }

      const data: ResumeTailoringResponse = await response.json();
      const viewUrl = typeof data.viewUrl === "string" ? data.viewUrl : null;
      const pdfUrl = typeof data.pdfUrl === "string" ? data.pdfUrl : null;

      if (!viewUrl || !pdfUrl) {
        throw new Error("Tailoring service response is missing required URLs.");
      }

      setResumeLinks({
        viewUrl: resolveResumeUrl(viewUrl),
        pdfUrl: resolveResumeUrl(pdfUrl),
      });

      setStatus("success");
      setResultType("tailored");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setStatus("error");
      setError(message);
    }
  }, [jobDescription, linkedinUrl, selectedTheme, tailorMode]);

  const generateResume = useCallback(async () => {
    if (!selectedTheme) {
      setError("Please select a theme before generating the resume.");
      return;
    }

    setActiveOperation("general");
    setStatus("loading");
    setError(null);
    setResumeLinks(null);
    setResultType(null);

    try {
      const resumeResponse = await fetch(RESUME_GIST_URL, {
        cache: "no-store",
        mode: "cors",
      });

      if (!resumeResponse.ok) {
        throw new Error(
          `Failed to fetch resume data (status ${resumeResponse.status}).`
        );
      }

      const resumeJson = await resumeResponse.json();

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

      setStatus("success");
      setResultType("general");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setStatus("error");
      setError(message);
    }
  }, [selectedTheme]);

  const isLoadingThemes = themesStatus === "loading";
  const isGenerating = status === "loading";
  const isTailorInputValid =
    (tailorMode === "linkedin" && linkedinUrl.trim().length > 0) ||
    (tailorMode === "description" && jobDescription.trim().length > 0);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">Résumé studio</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Recruiters can grab my go-to résumé in a couple of clicks or tailor it to the
          role they have in mind. Everything is generated fresh from my latest data.
        </p>
        <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/50 p-4 text-sm text-neutral-300">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Two ways to review my experience
          </h2>
          <ol className="list-decimal space-y-1 pl-4 text-neutral-400">
            <li>
              <span className="font-medium text-neutral-100">General résumé</span> — fast download of
              the version I typically share.
            </li>
            <li>
              <span className="font-medium text-neutral-100">Tailored résumé</span> — adapts the story to
              match a specific job posting or description you provide.
            </li>
          </ol>
          <p className="text-xs text-neutral-500">
            Pick a theme once; it controls the layout for both options below.
          </p>
        </div>
      </header>

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">1. Choose a theme</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Themes change the visual presentation of every résumé you generate here.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:max-w-sm">
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
          <p className="text-xs text-neutral-500">
            The option you choose below will use this theme automatically.
          </p>
        </div>

        {themesStatus === "error" && (
          <p className="text-sm text-red-500">
            Failed to load themes. {error}
          </p>
        )}
        {themesStatus === "success" && themes.length > 0 && (
          <p className="text-xs text-neutral-500">
            You can switch themes at any time and regenerate to compare layouts.
          </p>
        )}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">2. Pick how you want to review it</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Choose between the ready-made résumé or a version tailored to a specific job.
          </p>
        </div>

        <div className="inline-flex rounded-md border border-neutral-800 bg-neutral-900 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setSelectedFlow("general")}
            className={`rounded-md px-4 py-2 transition ${
              selectedFlow === "general"
                ? "bg-green-500 text-white shadow"
                : "text-neutral-300 hover:text-white"
            }`}
            disabled={isGenerating && activeOperation === "tailored"}
          >
            General résumé
          </button>
          <button
            type="button"
            onClick={() => setSelectedFlow("tailored")}
            className={`rounded-md px-4 py-2 transition ${
              selectedFlow === "tailored"
                ? "bg-green-500 text-white shadow"
                : "text-neutral-300 hover:text-white"
            }`}
            disabled={isGenerating && activeOperation === "general"}
          >
            Tailored résumé
          </button>
        </div>

        {selectedFlow === "general" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Download the standard résumé I usually send to recruiters, rendered with the
                theme you picked above.
              </p>
              <ul className="space-y-1 text-xs text-neutral-500">
                <li>Highlights my recent work, skills, and projects.</li>
                <li>Great when you need a quick copy or are browsing my background.</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={generateResume}
              disabled={
                isLoadingThemes || isGenerating || themesStatus !== "success" || !selectedTheme
              }
              className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
            >
              {isGenerating && activeOperation === "general"
                ? "Generating…"
                : "Generate general résumé"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Hand me a LinkedIn job URL or paste the description and I will highlight the
                most relevant accomplishments automatically.
              </p>
              <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-3 text-xs text-neutral-400">
                <p className="font-medium text-neutral-200">What you get</p>
                <p className="mt-1">
                  A customised HTML and PDF résumé tuned to that opportunity. The links are stored
                  on my backend so you can revisit them later.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTailorMode("linkedin")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  tailorMode === "linkedin"
                    ? "bg-green-500 text-white shadow"
                    : "border border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-600"
                }`}
                disabled={isGenerating}
              >
                LinkedIn job URL
              </button>
              <button
                type="button"
                onClick={() => setTailorMode("description")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  tailorMode === "description"
                    ? "bg-green-500 text-white shadow"
                    : "border border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-600"
                }`}
                disabled={isGenerating}
              >
                Job description text
              </button>
            </div>

            {tailorMode === "linkedin" ? (
              <label className="flex flex-col gap-2 text-sm font-medium">
                LinkedIn job URL
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(event) => setLinkedinUrl(event.target.value)}
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isGenerating}
                />
                <span className="text-xs font-normal text-neutral-500">
                  Paste the public job link — the workflow extracts the posting ID automatically.
                </span>
              </label>
            ) : (
              <label className="flex flex-col gap-2 text-sm font-medium">
                Job description
                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  rows={6}
                  placeholder="Paste the job description here..."
                  className="min-h-[120px] rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isGenerating}
                />
                <span className="text-xs font-normal text-neutral-500">
                  Include responsibilities and desired skills so the résumé can respond in kind.
                </span>
              </label>
            )}

            <button
              type="button"
              onClick={tailorResume}
              disabled={
                isLoadingThemes ||
                isGenerating ||
                themesStatus !== "success" ||
                !selectedTheme ||
                !isTailorInputValid
              }
              className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
            >
              {isGenerating && activeOperation === "tailored"
                ? "Tailoring…"
                : "Generate tailored résumé"}
            </button>
          </div>
        )}
      </section>

      {status === "error" && (
        <div className="rounded-md border border-red-500/60 bg-red-950/40 p-4 text-red-400">
          <p className="font-medium">
            {activeOperation === "tailored" ? "Tailoring failed" : "Generation failed"}
          </p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {status === "success" && resumeLinks && (
        <div className="space-y-3">
          <p className="text-green-500">
            {resultType === "tailored"
              ? "Tailored résumé is ready. Choose a format:"
              : "Résumé is ready. Choose a format:"}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                window.open(resumeLinks.viewUrl, "_blank", "noopener,noreferrer");
              }}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              View HTML version
            </button>
            <button
              onClick={() => {
                window.open(resumeLinks.pdfUrl, "_blank", "noopener,noreferrer");
              }}
              className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Download PDF version
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
