"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RESUME_BACKEND_BASE_URL,
  RESUME_BACKEND_RESUME_URL,
  RESUME_BACKEND_THEMES_URL,
  RESUME_GIST_URL,
  RESUME_TAILORING_URL,
} from "src/features/resume/constants";
import { Resume } from "src/features/resume/types";
import resumeSchema from "src/features/resume/schema.json";
import { Validator, ValidationError } from "jsonschema";

interface ResumeLinks {
  viewUrl: string;
  pdfUrl: string;
}

interface ResumeTailoringRequest {
  linkedin_url?: string;
  job_description?: string;
  theme: string;
  resume: Resume;
}

interface ResumeTailoringResponse {
  viewUrl: string;
  pdfUrl: string;
  jsonResume: Resume;
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
  const [fetchStatus, setFetchStatus] = useState<GenerationStatus>("idle");
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resumeLinks, setResumeLinks] = useState<ResumeLinks | null>(null);
  const [resultType, setResultType] = useState<"general" | "tailored" | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<"general" | "tailored">("general");
  const [tailorMode, setTailorMode] = useState<"linkedin" | "description">("linkedin");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loadedResumeJson, setLoadedResumeJson] = useState<Resume | null>(null);
  const [resumeJson, setResumeJson] = useState<Resume | null>(null);
  const [editedResumeJson, setEditedResumeJson] = useState("");
  const [jsonEditingError, setJsonEditingError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const validator = useMemo(() => new Validator(), []);

  const fetchGeneralResume = useCallback(async () => {
    setFetchStatus("loading");
    setError(null);
    setResumeLinks(null);
    setResultType(null);
    setGenerationStatus("idle");
    setValidationErrors([]);
    setJsonEditingError(null);
    try {
      const response = await fetch(RESUME_GIST_URL, {
        cache: "no-store",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch resume data (status ${response.status}).`);
      }

      const resume = (await response.json()) as Resume;
      setLoadedResumeJson(resume);
      setResumeJson(resume);
      setEditedResumeJson(JSON.stringify(resume, null, 2));
      setFetchStatus("success");
      setIsEditorOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setFetchStatus("error");
      setError(message);
    }
  }, []);

  const fetchTailoredResume = useCallback(async () => {
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

    setFetchStatus("loading");
    setError(null);
    setResumeLinks(null);
    setResultType(null);
    setGenerationStatus("idle");
    setValidationErrors([]);
    setJsonEditingError(null);

    try {
      const baseResumeResponse = await fetch(RESUME_GIST_URL, {
        cache: "no-store",
        mode: "cors",
      });

      if (!baseResumeResponse.ok) {
        throw new Error(
          `Failed to fetch resume data (status ${baseResumeResponse.status}).`
        );
      }

      const resume = (await baseResumeResponse.json()) as Resume;

      const requestBody: ResumeTailoringRequest = {
        resume,
        theme: selectedTheme || "",
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
      const { jsonResume } = data;

      if (!jsonResume || typeof jsonResume !== "object") {
        throw new Error("Tailoring service response is missing the tailored résumé JSON.");
      }

      setLoadedResumeJson(jsonResume);
      setResumeJson(jsonResume);
      setEditedResumeJson(JSON.stringify(jsonResume, null, 2));
      setFetchStatus("success");
      setIsEditorOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setFetchStatus("error");
      setError(message);
    }
  }, [jobDescription, linkedinUrl, selectedTheme, tailorMode]);

  const validateEditedResume = useCallback(
    (json: Resume) => {
      const result = validator.validate(json, resumeSchema as never);
      if (result.valid) {
        setValidationErrors([]);
        return true;
      }

      setValidationErrors(result.errors);
      return false;
    },
    [validator]
  );

  useEffect(() => {
    if (!editedResumeJson.trim()) {
      setJsonEditingError(null);
      setValidationErrors([]);
      setResumeJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(editedResumeJson) as Resume;
      setJsonEditingError(null);
      setResumeJson(parsed);
      validateEditedResume(parsed);
    } catch (err) {
      setResumeJson(null);
      setValidationErrors([]);

      if (err instanceof SyntaxError) {
        setJsonEditingError(`Invalid JSON: ${err.message}`);
        return;
      }

      const message = err instanceof Error ? err.message : "Unknown error";
      setJsonEditingError(message);
    }
  }, [editedResumeJson, validateEditedResume]);

  const generateResume = useCallback(async () => {
    if (!resumeJson || jsonEditingError || validationErrors.length > 0) {
      setError("Fix the résumé JSON issues before generating.");
      return;
    }

    if (!selectedTheme) {
      setError("Please select a theme before generating the resume.");
      return;
    }

    try {
      setGenerationStatus("loading");
      setResumeLinks(null);
      setResultType(null);
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
      setResultType(selectedFlow);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setGenerationStatus("error");
      setError(message);
    }
  }, [jsonEditingError, resumeJson, selectedFlow, selectedTheme, validationErrors.length]);

  const isLoadingThemes = themesStatus === "loading";
  const isFetchingResume = fetchStatus === "loading";
  const isGenerating = generationStatus === "loading";
  const hasEditedResume = !!editedResumeJson.trim();
  const hasValidationErrors = validationErrors.length > 0;
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

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">1. Decide what to start from</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Fetch a general résumé or tailor one first, then refine the JSON below.
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
            disabled={isFetchingResume || isGenerating}
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
            disabled={isFetchingResume || isGenerating}
          >
            Tailored résumé
          </button>
        </div>

        {selectedFlow === "general" ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Grab the latest JSON from my public résumé source. You can tweak it after it loads.
            </p>
            <button
              type="button"
              onClick={fetchGeneralResume}
              disabled={isFetchingResume || isGenerating}
              className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
            >
              {isFetchingResume ? "Loading…" : "Load general résumé JSON"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Provide a job reference so the tailored workflow can highlight relevant experience.
              </p>
              <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-3 text-xs text-neutral-400">
                <p className="font-medium text-neutral-200">What you get</p>
                <p className="mt-1">
                  A tailored résumé JSON matching the job. Review and adjust it before generating the final files.
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
                disabled={isFetchingResume || isGenerating}
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
                disabled={isFetchingResume || isGenerating}
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
                  disabled={isFetchingResume || isGenerating}
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
                  disabled={isFetchingResume || isGenerating}
                />
                <span className="text-xs font-normal text-neutral-500">
                  Include responsibilities and desired skills so the résumé can respond in kind.
                </span>
              </label>
            )}

            <button
              type="button"
              onClick={fetchTailoredResume}
              disabled={isFetchingResume || isGenerating}
              className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
            >
              {isFetchingResume ? "Tailoring…" : "Fetch tailored résumé JSON"}
            </button>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">2. Review and edit the résumé JSON</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Adjust details and the schema validator will keep you honest while you type.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditorOpen((current) => !current)}
              disabled={fetchStatus !== "success"}
              className="rounded-md border border-neutral-700 px-3 py-1 text-xs font-semibold text-neutral-200 transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-600"
            >
              {isEditorOpen ? "Hide JSON editor" : "Edit JSON (optional)"}
            </button>
          </div>
          {fetchStatus === "success" && (
            <p className="text-xs font-medium text-neutral-400">
              Status: {jsonEditingError ? "Invalid JSON syntax" : validationErrors.length > 0 ? "Needs schema fixes" : "Valid résumé JSON"}
            </p>
          )}
        </div>

        {isEditorOpen && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span>
                {fetchStatus === "success"
                  ? "Loaded résumé JSON. Tweak fields below to tailor content."
                  : "Load a résumé JSON above to start editing."}
              </span>
              {fetchStatus === "success" && loadedResumeJson && (
                <button
                  type="button"
                  onClick={() => {
                    setEditedResumeJson(JSON.stringify(loadedResumeJson, null, 2));
                    setJsonEditingError(null);
                    setValidationErrors([]);
                  }}
                  className="text-xs font-semibold text-green-400 transition hover:text-green-300"
                >
                  Reset edits
                </button>
              )}
            </div>

            <textarea
              value={editedResumeJson}
              onChange={(event) => {
                setEditedResumeJson(event.target.value);
              }}
              rows={18}
              className="w-full min-h-[260px] rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-xs text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isFetchingResume || fetchStatus === "idle"}
              placeholder="Load a résumé JSON above to edit it here."
            />
          </div>
        )}

        {jsonEditingError && (
          <p className="text-xs text-red-400">
            {jsonEditingError}
          </p>
        )}

        {validationErrors.length > 0 && (
          <div className="space-y-2 rounded-md border border-red-500/60 bg-red-950/40 p-3 text-xs text-red-300">
            <p className="font-semibold text-red-200">Schema validation issues</p>
            <ul className="list-disc space-y-1 pl-5">
              {validationErrors.map((validationError, index) => (
                <li key={`${validationError.stack}-${index}`}>
                  {validationError.stack}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">3. Pick a theme and generate</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Themes change the visual presentation. Validate first to avoid surprises.
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
            The résumé you generate below will use this theme.
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

        <button
          type="button"
          onClick={generateResume}
          disabled={
            !resumeJson ||
            !selectedTheme ||
            isLoadingThemes ||
            isGenerating ||
            themesStatus !== "success" ||
            jsonEditingError !== null ||
            validationErrors.length > 0
          }
          className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
        >
          {isGenerating ? "Generating…" : "Generate résumé"}
        </button>

        {(jsonEditingError || validationErrors.length > 0) && (
          <p className="text-xs text-yellow-400">
            Resolve the JSON issues above to enable résumé generation.
          </p>
        )}
      </section>

      {(generationStatus === "error" || fetchStatus === "error") && error && (
        <div className="rounded-md border border-red-500/60 bg-red-950/40 p-4 text-red-400">
          <p className="font-medium">{fetchStatus === "error" ? "Resume fetch failed" : "Generation failed"}</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {generationStatus === "success" && resumeLinks && (
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
