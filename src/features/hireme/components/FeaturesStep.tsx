"use client";

import { FeaturesByProjectType, FeatureDefinition, ProjectType } from "../types";

interface FeaturesStepProps {
  projectType: ProjectType | null;
  featuresByProjectType: Record<ProjectType, FeaturesByProjectType>;
  selectedFeatures: FeatureDefinition[];
  onToggle: (projectType: ProjectType, feature: FeatureDefinition) => void;
}

export function FeaturesStep({
  projectType,
  featuresByProjectType,
  selectedFeatures,
  onToggle,
}: FeaturesStepProps) {
  if (!projectType) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">What features do you need?</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          First choose a project type to see the relevant feature options.
        </p>
      </div>
    );
  }

  const config = featuresByProjectType[projectType];

  const isSelected = (feature: FeatureDefinition) =>
    selectedFeatures.some((item) => item.id === feature.id);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">What features do you need?</h2>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Included by default
          </p>
          <ul className="mt-2 space-y-1 text-sm text-neutral-300">
            {config.base.map((feature) => (
              <li key={feature.id} className="flex items-start gap-2">
                <span className="mt-0.5 h-3 w-3 rounded-full bg-green-500" aria-hidden />
                <div>
                  <span className="font-medium">{feature.label}</span>
                  {feature.description && (
                    <span className="ml-1 text-xs text-neutral-400">{feature.description}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Optional add-ons
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {config.optional.map((feature) => {
              const checked = isSelected(feature);

              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => onToggle(projectType, feature)}
                  className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left text-xs transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    checked
                      ? "border-green-500 bg-green-500/10 text-neutral-100"
                      : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:border-neutral-700"
                  }`}
                  aria-pressed={checked}
                >
                  <span className="font-medium">{feature.label}</span>
                  {feature.description && (
                    <span className="mt-1 text-[11px] text-neutral-400">{feature.description}</span>
                  )}
                  <span className="mt-2 text-[11px] font-semibold text-green-400">
                    +€{feature.price.toLocaleString()}
                    {feature.isAdvanced && " · Advanced"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
