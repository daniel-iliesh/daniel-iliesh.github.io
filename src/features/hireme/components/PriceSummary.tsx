"use client";

import { BudgetRangeDefinition } from "../types";

interface PriceSummaryProps {
  basePrice: number;
  featureAddOns: number;
  priceAfterComplexity: number;
  priceAfterTimeline: number;
  roundedFinalPrice: number;
  budgetRange: BudgetRangeDefinition | null;
  budgetMismatch: boolean;
}

export function PriceSummary({
  basePrice,
  featureAddOns,
  priceAfterComplexity,
  priceAfterTimeline,
  roundedFinalPrice,
  budgetRange,
  budgetMismatch,
}: PriceSummaryProps) {
  return (
    <section className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/40 p-3 text-xs text-neutral-300">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-100">Estimate overview</span>
        <span className="text-sm font-semibold text-green-400">
          €{roundedFinalPrice.toLocaleString()}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Base package</span>
          <span>€{basePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Add-ons</span>
          <span>+€{featureAddOns.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>After complexity</span>
          <span>€{Math.round(priceAfterComplexity).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>After timeline</span>
          <span>€{Math.round(priceAfterTimeline).toLocaleString()}</span>
        </div>
      </div>
      {budgetRange && (
        <div className="mt-1 flex justify-between border-t border-neutral-800 pt-1">
          <span>Budget range</span>
          <span className="font-medium">{budgetRange.label}</span>
        </div>
      )}
      {budgetMismatch && budgetRange && (
        <p className="mt-1 text-[11px] text-amber-300">
          Your estimate is above this range. I&apos;ll suggest scope or timeline adjustments when I
          reply.
        </p>
      )}
      {!budgetRange && (
        <p className="mt-1 text-[11px] text-neutral-500">
          We haven&apos;t set a budget range yet. You&apos;ll be able to do that in the next step.
        </p>
      )}
    </section>
  );
}
