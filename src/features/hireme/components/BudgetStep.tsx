"use client";

import { BudgetRangeDefinition } from "../types";

interface BudgetStepProps {
  ranges: BudgetRangeDefinition[];
  selectedRange: BudgetRangeDefinition | null;
  suggestedRange: BudgetRangeDefinition | null;
  roundedFinalPrice: number;
  budgetMismatch: boolean;
  onSelect: (range: BudgetRangeDefinition | null) => void;
}

export function BudgetStep({
  ranges,
  selectedRange,
  suggestedRange,
  roundedFinalPrice,
  budgetMismatch,
  onSelect,
}: BudgetStepProps) {
  const handleSelect = (range: BudgetRangeDefinition | null) => {
    onSelect(range);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">What&apos;s your budget range?</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        This helps me understand how to tailor scope and timelines. You can skip this if you&apos;re
        not sure yet.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ranges.map((range) => {
          const isActive = selectedRange?.id === range.id;
          const isSuggested = suggestedRange?.id === range.id;
          const isBelowEstimate = roundedFinalPrice > (range.max ?? Number.POSITIVE_INFINITY);

          return (
            <button
              key={range.id}
              type="button"
              onClick={() => handleSelect(range)}
              className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isActive
                  ? "border-green-500 bg-green-500/10 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:border-neutral-700"
              }`}
            >
              <span className="font-semibold flex items-center gap-1">
                {range.label}
                {isSuggested && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                    Suggested
                  </span>
                )}
              </span>
              {isBelowEstimate && (
                <span className="mt-1 text-xs text-amber-300">
                  Below current estimate (~€{roundedFinalPrice.toLocaleString()}). We&apos;ll likely
                  adjust scope, complexity or timeline.
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
            !selectedRange ? "border-green-500 bg-green-500/10 text-neutral-100" : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:border-neutral-700"
          }`}
        >
          <span className="font-semibold">Not sure yet</span>
          <span className="mt-1 text-xs text-neutral-400">
            I can propose a range based on your selections so far.
          </span>
        </button>
      </div>

      {budgetMismatch && selectedRange && (
        <p className="text-xs text-amber-300">
          Your selections would typically land above this range. I&apos;ll suggest options like
          prioritising MVP features or using a more flexible timeline.
        </p>
      )}
    </div>
  );
}
