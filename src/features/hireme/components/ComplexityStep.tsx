"use client";

import { ComplexityLevel, ProjectType } from "../types";

interface ComplexityStepProps {
  projectType: ProjectType | null;
  selected: ComplexityLevel;
  onSelect: (level: ComplexityLevel) => void;
}

const OPTION_ORDER: ComplexityLevel[] = ["simple", "medium", "complex"];

export function ComplexityStep({ projectType, selected, onSelect }: ComplexityStepProps) {
  const labels: Record<ComplexityLevel, string> = {
    simple: "Simple",
    medium: "Medium",
    complex: "Complex",
  };

  const multiplierText: Record<ComplexityLevel, string> = {
    simple: "0.8×",
    medium: "1.0×",
    complex: "1.4×",
  };

  function description(level: ComplexityLevel): string {
    if (!projectType) {
      if (level === "simple") return "Lean scope, straightforward flows.";
      if (level === "medium") return "Balanced scope with some custom logic.";
      return "Advanced scope, multiple moving parts.";
    }

    if (projectType === "landing") {
      if (level === "simple") return "1–3 pages, standard layout, light animations.";
      if (level === "medium") return "4–6 pages, custom design, richer interactions.";
      return "7+ pages, advanced animations and interactive elements.";
    }

    if (projectType === "dashboard") {
      if (level === "simple") return "Single role, a few tables and basic charts.";
      if (level === "medium") return "Multiple roles, several tables, interactive charts.";
      return "Many roles, real-time data and complex workflows.";
    }

    if (projectType === "api") {
      if (level === "simple") return "Basic CRUD endpoints, single database, simple auth.";
      if (level === "medium") return "More endpoints, a couple of integrations and webhooks.";
      return "Large surface area, multiple APIs, advanced security and rate limiting.";
    }

    if (projectType === "mvp") {
      if (level === "simple") return "Core MVP with a few features and one user type.";
      if (level === "medium") return "Richer MVP with several features and roles.";
      return "Feature-heavy MVP with real-time, payments and complex flows.";
    }

    return "";
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">How complex is your project?</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Pick the option that best matches the number of features and how custom the flows are.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OPTION_ORDER.map((level) => {
          const isActive = selected === level;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onSelect(level)}
              className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isActive
                  ? "border-green-500 bg-green-500/10 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:border-neutral-700"
              }`}
              aria-pressed={isActive}
            >
              <span className="font-semibold flex items-center gap-1">
                {labels[level]}
                {level === "medium" && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                    Recommended
                  </span>
                )}
              </span>
              <span className="mt-1 text-xs text-neutral-400">{description(level)}</span>
              <span className="mt-2 text-xs font-medium text-green-400">
                Price multiplier: {multiplierText[level]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
