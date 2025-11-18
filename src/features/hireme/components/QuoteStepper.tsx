"use client";

import { ReactNode } from "react";

interface QuoteStepperProps {
  currentStep: number;
  totalSteps: number;
  estimatedTotal: number;
  children: ReactNode;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
}

export function QuoteStepper({
  currentStep,
  totalSteps,
  estimatedTotal,
  children,
  onNext,
  onPrev,
  canGoNext,
}: QuoteStepperProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Hire me</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Answer a few quick questions to get a tailored project estimate and a fast follow-up
          from me. This is an early version of the quote builder — we&apos;ll refine it together.
        </p>
      </header>

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>Estimated total: €{estimatedTotal.toLocaleString()}</span>
      </div>

      <div>{children}</div>

      <footer className="flex justify-between border-t border-neutral-800 pt-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 1}
          className="rounded-md border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:border-neutral-900 disabled:text-neutral-600"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="rounded-md bg-green-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
        >
          Continue
        </button>
      </footer>
    </section>
  );
}
