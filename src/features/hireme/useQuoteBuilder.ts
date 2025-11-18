"use client";

import { useCallback, useMemo, useState } from "react";
import {
  BUDGET_RANGES,
  COMPLEXITY_MULTIPLIERS,
  FEATURES_BY_PROJECT_TYPE,
  PROJECT_TYPES,
  TIMELINE_MULTIPLIERS,
  addWeeksToDate,
  calculateStandardTimelineWeeks,
  formatDateIso,
  getFeaturePriceTotal,
  getProjectTypeConfig,
  getSuggestedComplexity,
} from "./config";
import {
  BudgetRangeDefinition,
  ComplexityLevel,
  FeatureDefinition,
  ProjectType,
  QuotePayload,
  QuoteState,
  TimelineChoice,
} from "./types";

const INITIAL_CONTACT = {
  name: "",
  email: "",
  company: "",
  additionalInfo: "",
  agreeToTerms: false,
};

const INITIAL_STATE: QuoteState = {
  currentStep: 1,
  maxVisitedStep: 1,
  projectType: null,
  basePrice: 0,
  baseTimeline: null,
  selectedFeatures: [],
  featureAddOns: 0,
  complexity: "medium",
  complexityMultiplier: COMPLEXITY_MULTIPLIERS["medium"],
  timeline: "standard",
  timelineMultiplier: TIMELINE_MULTIPLIERS["standard"],
  estimatedWeeks: null,
  estimatedDelivery: null,
  budgetRange: null,
  budgetMismatch: false,
  contact: INITIAL_CONTACT,
  finalPrice: 0,
};

export function useQuoteBuilder() {
  const [state, setState] = useState<QuoteState>(INITIAL_STATE);

  const subtotalBeforeComplexity = useMemo(
    () => state.basePrice + state.featureAddOns,
    [state.basePrice, state.featureAddOns]
  );

  const priceAfterComplexity = useMemo(
    () => subtotalBeforeComplexity * state.complexityMultiplier,
    [subtotalBeforeComplexity, state.complexityMultiplier]
  );

  const priceAfterTimeline = useMemo(
    () => priceAfterComplexity * state.timelineMultiplier,
    [priceAfterComplexity, state.timelineMultiplier]
  );

  const roundedFinalPrice = useMemo(
    () => Math.round(state.finalPrice / 50) * 50,
    [state.finalPrice]
  );

  const updateProjectType = useCallback((projectType: ProjectType) => {
    const config = getProjectTypeConfig(projectType);
    const baseFeatures = FEATURES_BY_PROJECT_TYPE[projectType].base;
    const optionalFeatures: FeatureDefinition[] = [];

    const featureAddOns = getFeaturePriceTotal(optionalFeatures);

    const standardWeeks = calculateStandardTimelineWeeks(
      projectType,
      state.complexity,
      optionalFeatures.length
    );

    const estimatedDelivery = addWeeksToDate(new Date(), standardWeeks.max);

    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep, 1),
      projectType,
      basePrice: config.basePrice,
      baseTimeline: config.baseTimeline,
      selectedFeatures: [...baseFeatures, ...optionalFeatures],
      featureAddOns,
      estimatedWeeks: standardWeeks,
      estimatedDelivery,
    }));
  }, [state.complexity]);

  const toggleFeature = useCallback((projectType: ProjectType, feature: FeatureDefinition) => {
    setState((prev) => {
      if (!prev.projectType || prev.projectType !== projectType) {
        return prev;
      }

      const featuresConfig = FEATURES_BY_PROJECT_TYPE[projectType];

      if (feature.isBase) {
        return prev;
      }

      const existingIndex = prev.selectedFeatures.findIndex((item) => item.id === feature.id);
      let nextSelected: FeatureDefinition[];

      if (existingIndex >= 0) {
        nextSelected = prev.selectedFeatures.filter((item) => item.id !== feature.id);
      } else {
        nextSelected = [...prev.selectedFeatures, feature];
      }

      const baseLocked = featuresConfig.base;
      const allSelectedWithBase = [
        ...baseLocked,
        ...nextSelected.filter((feature) => !feature.isBase),
      ];

      const featureAddOns = getFeaturePriceTotal(allSelectedWithBase);

      const hasAdvancedFeatures = allSelectedWithBase.some((item) => item.isAdvanced);
      const nextComplexity = getSuggestedComplexity(
        allSelectedWithBase.length,
        hasAdvancedFeatures
      );

      const complexityMultiplier = COMPLEXITY_MULTIPLIERS[nextComplexity];
      const standardWeeks = calculateStandardTimelineWeeks(
        projectType,
        nextComplexity,
        allSelectedWithBase.length
      );
      const estimatedDelivery = addWeeksToDate(new Date(), standardWeeks.max);

      const finalPrice =
        (prev.basePrice + featureAddOns) * complexityMultiplier * prev.timelineMultiplier;

      return {
        ...prev,
        selectedFeatures: allSelectedWithBase,
        featureAddOns,
        complexity: nextComplexity,
        complexityMultiplier,
        estimatedWeeks: standardWeeks,
        estimatedDelivery,
        finalPrice,
      };
    });
  }, []);

  const updateComplexity = useCallback((complexity: ComplexityLevel) => {
    setState((prev) => {
      const multiplier = COMPLEXITY_MULTIPLIERS[complexity];
      const projectType = prev.projectType;

      let estimatedWeeks = prev.estimatedWeeks;
      let estimatedDelivery = prev.estimatedDelivery;

      if (projectType) {
        estimatedWeeks = calculateStandardTimelineWeeks(
          projectType,
          complexity,
          prev.selectedFeatures.length
        );
        estimatedDelivery = addWeeksToDate(new Date(), estimatedWeeks.max);
      }

      const finalPrice =
        (prev.basePrice + prev.featureAddOns) * multiplier * prev.timelineMultiplier;

      return {
        ...prev,
        complexity,
        complexityMultiplier: multiplier,
        estimatedWeeks,
        estimatedDelivery,
        finalPrice,
      };
    });
  }, []);

  const updateTimeline = useCallback((timeline: TimelineChoice) => {
    setState((prev) => {
      const multiplier = TIMELINE_MULTIPLIERS[timeline];
      const finalPrice =
        (prev.basePrice + prev.featureAddOns) * prev.complexityMultiplier * multiplier;

      return {
        ...prev,
        timeline,
        timelineMultiplier: multiplier,
        finalPrice,
      };
    });
  }, []);

  const updateBudgetRange = useCallback((budget: BudgetRangeDefinition | null) => {
    setState((prev) => {
      if (!budget) {
        return {
          ...prev,
          budgetRange: null,
          budgetMismatch: false,
        };
      }

      const max = budget.max ?? Number.POSITIVE_INFINITY;
      const mismatch = roundedFinalPrice > max;

      return {
        ...prev,
        budgetRange: budget,
        budgetMismatch: mismatch,
      };
    });
  }, [roundedFinalPrice]);

  const updateContactField = useCallback((field: keyof typeof INITIAL_CONTACT, value: string | boolean) => {
    setState((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 6),
      maxVisitedStep: Math.max(prev.maxVisitedStep, Math.min(prev.currentStep + 1, 6)),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(Math.max(step, 1), prev.maxVisitedStep),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const buildPayload = useCallback((): QuotePayload => {
    return {
      projectType: state.projectType,
      features: state.selectedFeatures.map((feature) => feature.id),
      complexity: state.complexity,
      timeline: state.timeline,
      budgetRangeId: state.budgetRange?.id ?? null,
      budgetMismatch: state.budgetMismatch,
      contact: state.contact,
      calculatedPrice: roundedFinalPrice,
      estimatedDelivery: formatDateIso(state.estimatedDelivery),
    };
  }, [roundedFinalPrice, state]);

  return {
    state,
    subtotalBeforeComplexity,
    priceAfterComplexity,
    priceAfterTimeline,
    roundedFinalPrice,
    maxVisitedStep: state.maxVisitedStep,
    projectTypes: PROJECT_TYPES,
    budgetRanges: BUDGET_RANGES,
    featuresByProjectType: FEATURES_BY_PROJECT_TYPE,
    updateProjectType,
    toggleFeature,
    updateComplexity,
    updateTimeline,
    updateBudgetRange,
    updateContactField,
    nextStep,
    prevStep,
    goToStep,
    reset,
    buildPayload,
  };
}
