"use client";

import { useState } from "react";
import { useQuoteBuilder } from "src/features/hireme/useQuoteBuilder";
import { QuoteStepper } from "src/features/hireme/components/QuoteStepper";
import { ProjectTypeStep } from "src/features/hireme/components/ProjectTypeStep";
import { FeaturesStep } from "src/features/hireme/components/FeaturesStep";
import { ComplexityStep } from "src/features/hireme/components/ComplexityStep";
import { TimelineStep } from "src/features/hireme/components/TimelineStep";
import { BudgetStep } from "src/features/hireme/components/BudgetStep";
import { ContactStep } from "src/features/hireme/components/ContactStep";
import { PriceSummary } from "src/features/hireme/components/PriceSummary";
import { SelectionsSummary } from "src/features/hireme/components/SelectionsSummary";

export default function HireMePage() {
  const {
    state,
    projectTypes,
    featuresByProjectType,
    budgetRanges,
    priceAfterComplexity,
    priceAfterTimeline,
    roundedFinalPrice,
    updateProjectType,
    toggleFeature,
    updateComplexity,
    updateTimeline,
    updateBudgetRange,
    updateContactField,
    buildPayload,
    nextStep,
    prevStep,
    goToStep,
    maxVisitedStep,
  } = useQuoteBuilder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const suggestedBudgetRange = budgetRanges.find((range) => {
    const max = range.max ?? Number.POSITIVE_INFINITY;
    return roundedFinalPrice >= range.min && roundedFinalPrice <= max;
  }) ?? null;

  const projectTypeLabel = state.projectType
    ? projectTypes.find((type) => type.id === state.projectType)?.label ?? null
    : null;

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const payload = buildPayload();
      const response = await fetch("https://thebackend.rocket-champ.pw/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "hire-quote",
          quote: payload,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      setSubmitSuccess(true);
    } catch {
      setSubmitError(
        "Something went wrong while sending your request. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <QuoteStepper
      currentStep={state.currentStep}
      totalSteps={6}
      estimatedTotal={roundedFinalPrice}
      onNext={nextStep}
      onPrev={prevStep}
      onStepChange={goToStep}
      maxClickableStep={maxVisitedStep}
      canGoNext={
        state.currentStep === 6
          ? false
          : state.currentStep === 1
          ? !!state.projectType
          : state.currentStep === 2
          ? !!state.projectType
          : true
      }
    >
      <div className="space-y-4">
        <PriceSummary
          basePrice={state.basePrice}
          featureAddOns={state.featureAddOns}
          priceAfterComplexity={priceAfterComplexity}
          priceAfterTimeline={priceAfterTimeline}
          roundedFinalPrice={roundedFinalPrice}
          budgetRange={state.budgetRange}
          budgetMismatch={state.budgetMismatch}
        />

        <SelectionsSummary
          projectType={state.projectType}
          projectTypeLabel={projectTypeLabel}
          selectedFeatures={state.selectedFeatures}
          complexity={state.complexity}
          timeline={state.timeline}
          budgetRange={state.budgetRange}
        />

        {state.currentStep === 1 && (
          <ProjectTypeStep
            projectTypes={projectTypes}
            selectedId={state.projectType}
            onSelect={updateProjectType}
          />
        )}

        {state.currentStep === 2 && (
          <FeaturesStep
            projectType={state.projectType}
            featuresByProjectType={featuresByProjectType}
            selectedFeatures={state.selectedFeatures}
            onToggle={toggleFeature}
          />
        )}

        {state.currentStep === 3 && (
          <ComplexityStep
            projectType={state.projectType}
            selected={state.complexity}
            onSelect={updateComplexity}
          />
        )}

        {state.currentStep === 4 && (
          <TimelineStep
            projectType={state.projectType}
            complexity={state.complexity}
            standardTimeline={state.estimatedWeeks}
            selected={state.timeline}
            onSelect={updateTimeline}
          />
        )}

        {state.currentStep === 5 && (
          <BudgetStep
            ranges={budgetRanges}
            selectedRange={state.budgetRange}
            suggestedRange={suggestedBudgetRange}
            roundedFinalPrice={roundedFinalPrice}
            budgetMismatch={state.budgetMismatch}
            onSelect={updateBudgetRange}
          />
        )}

        {state.currentStep === 6 && (
          <div className="space-y-3">
            {submitSuccess && (
              <p className="rounded-md border border-green-500/60 bg-green-500/10 p-3 text-xs text-green-300">
                Thanks for your request. I&apos;ll review your answers and get back to you with a
                refined proposal.
              </p>
            )}
            <ContactStep
              contact={state.contact}
              isSubmitting={isSubmitting}
              error={submitError}
              onChangeField={updateContactField}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </QuoteStepper>
  );
}
