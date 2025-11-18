"use client";

import { ProjectTypeConfig } from "../types";

interface ProjectTypeStepProps {
  projectTypes: ProjectTypeConfig[];
  selectedId: string | null;
  onSelect: (id: ProjectTypeConfig["id"]) => void;
}

export function ProjectTypeStep({ projectTypes, selectedId, onSelect }: ProjectTypeStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">What do you need built?</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projectTypes.map((type) => {
          const isActive = selectedId === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isActive
                  ? "border-green-500 bg-green-500/10 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:border-neutral-700"
              }`}
              aria-pressed={isActive}
            >
              <span className="font-semibold">{type.label}</span>
              <span className="mt-1 text-xs text-neutral-400">{type.description}</span>
              <span className="mt-2 text-xs font-medium text-green-400">
                Starting at €{type.basePrice.toLocaleString()} · {type.baseTimeline.min}–
                {type.baseTimeline.max} weeks
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
