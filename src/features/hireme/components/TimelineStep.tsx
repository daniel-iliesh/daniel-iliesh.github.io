"use client";

import { ComplexityLevel, ProjectType, TimelineChoice, TimelineRange } from "../types";

interface TimelineStepProps {
  projectType: ProjectType | null;
  complexity: ComplexityLevel;
  standardTimeline: TimelineRange | null;
  selected: TimelineChoice;
  onSelect: (choice: TimelineChoice) => void;
}

export function TimelineStep({
  projectType,
  complexity,
  standardTimeline,
  selected,
  onSelect,
}: TimelineStepProps) {
  const hasStandard = standardTimeline && standardTimeline.min > 0 && standardTimeline.max > 0;
  const hideRush = !!standardTimeline && standardTimeline.max > 4;
  const showExtended = projectType === "mvp";

  const options: { id: TimelineChoice; label: string; description: string; note?: string }[] = [];

  if (!hideRush) {
    options.push({
      id: "rush",
      label: "Rush",
      description: "Compressed timeline with a premium fee.",
      note: "1.2× price multiplier",
    });
  }

  options.push({
    id: "standard",
    label: "Standard",
    description: "Balanced timeline for quality and predictable delivery.",
    note: "1.0× price multiplier",
  });

  options.push({
    id: "flexible",
    label: "Flexible",
    description: "More breathing room and a small discount.",
    note: "0.9× price multiplier",
  });

  if (showExtended) {
    options.push({
      id: "extended",
      label: "Extended",
      description: "MVP spread over a longer window with more room for iteration.",
      note: "0.85× price multiplier",
    });
  }

  options.push({
    id: "not-sure",
    label: "Not sure yet",
    description: "I&apos;ll propose a realistic timeline based on everything you selected.",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">When do you need it delivered?</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Your choices so far suggest a {complexity} project
        {hasStandard
          ? `, which typically lands around ${standardTimeline!.min}–${standardTimeline!.max} weeks.`
          : "."}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isActive = selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isActive
                  ? "border-green-500 bg-green-500/10 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:border-neutral-700"
              }`}
              aria-pressed={isActive}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="mt-1 text-xs text-neutral-400">{option.description}</span>
              {option.note && (
                <span className="mt-2 text-xs font-medium text-green-400">{option.note}</span>
              )}
            </button>
          );
        })}
      </div>

      {hasStandard && (
        <p className="text-xs text-neutral-500">
          Based on similar projects, I would expect to wrap between
          {" "}
          <span className="font-medium text-neutral-200">
            {standardTimeline!.min}–{standardTimeline!.max} weeks
          </span>
          .
        </p>
      )}
    </div>
  );
}
