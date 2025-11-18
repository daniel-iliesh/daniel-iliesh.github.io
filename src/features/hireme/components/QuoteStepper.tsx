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
  helperText?: string | null;
  onStepChange?: (step: number) => void;
}

export function QuoteStepper({
  currentStep,
  totalSteps,
  estimatedTotal,
  children,
  onNext,
  onPrev,
  canGoNext,
  helperText,
  onStepChange,
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

      <div className="flex flex-col gap-2 text-xs text-neutral-500">
        <div className="flex items-center justify-between">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Estimated total: €{estimatedTotal.toLocaleString()}</span>
        </div>
        <div className="flex gap-1" aria-label="Quote builder steps">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCurrent = stepNumber === currentStep;
            const isVisited = stepNumber <= currentStep;

            const canClick = !!onStepChange && stepNumber <= currentStep;

            return (
              <button
                key={stepNumber}
                type="button"
                onClick={canClick ? () => onStepChange(stepNumber) : undefined}
                disabled={!canClick}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex-1 rounded-full border px-0.5 py-1 text-[10px] font-medium transition focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  isCurrent
                    ? "border-green-500 bg-green-500/20 text-green-200"
                    : isVisited
                    ? "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-500"
                    : "border-neutral-900 bg-neutral-950 text-neutral-600"
                }`}
              >
                {stepNumber}
              </button>
            );
          })}
        </div>
      </div>

      <div>{children}</div>

      <footer className="flex flex-col gap-2 border-t border-neutral-800 pt-4">
        {helperText && (
          <p className="text-[11px] text-neutral-500">{helperText}</p>
        )}
        <div className="flex justify-between">
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
        </div>
      </footer>
    </section>
  );
}
