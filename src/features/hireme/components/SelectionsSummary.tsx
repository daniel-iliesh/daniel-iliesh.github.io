"use client";

import { BudgetRangeDefinition, ComplexityLevel, FeatureDefinition, ProjectType, TimelineChoice } from "../types";

interface SelectionsSummaryProps {
  projectType: ProjectType | null;
  projectTypeLabel: string | null;
  selectedFeatures: FeatureDefinition[];
  complexity: ComplexityLevel;
  timeline: TimelineChoice;
  budgetRange: BudgetRangeDefinition | null;
}

function formatTimelineLabel(timeline: TimelineChoice): string {
  switch (timeline) {
    case "rush":
      return "Rush";
    case "standard":
      return "Standard";
    case "flexible":
      return "Flexible";
    case "extended":
      return "Extended";
    case "not-sure":
    default:
      return "Not sure yet";
  }
}

export function SelectionsSummary({
  projectType,
  projectTypeLabel,
  selectedFeatures,
  complexity,
  timeline,
  budgetRange,
}: SelectionsSummaryProps) {
  const featureCount = selectedFeatures.length;
  const visibleFeatures = selectedFeatures
    .filter((feature) => !feature.isBase)
    .slice(0, 3);
  const remainingFeatures = Math.max(0, selectedFeatures.filter((f) => !f.isBase).length - visibleFeatures.length);

  return (
    <section className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/40 p-3 text-[11px] text-neutral-300">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-100">Your choices so far</span>
        {projectType && (
          <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-300">
            Step preview
          </span>
        )}
      </div>

      {!projectType && (
        <p className="text-[11px] text-neutral-500">
          Start by choosing what you need built. I&apos;ll keep a running summary of your choices here.
        </p>
      )}

      {projectType && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Project type</span>
              <span className="font-medium text-neutral-100">{projectTypeLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Features</span>
              <span className="font-medium text-neutral-100">{featureCount} selected</span>
            </div>
            {visibleFeatures.length > 0 && (
              <p className="text-[11px] text-neutral-500">
                {visibleFeatures.map((feature) => feature.label).join(", ")}
                {remainingFeatures > 0 && ` +${remainingFeatures} more`}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Complexity</span>
              <span className="font-medium text-neutral-100 capitalize">{complexity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Timeline</span>
              <span className="font-medium text-neutral-100">{formatTimelineLabel(timeline)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Budget</span>
              <span className="font-medium text-neutral-100">
                {budgetRange ? budgetRange.label : "Not set yet"}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
