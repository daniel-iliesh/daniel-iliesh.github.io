"use client";

import { FormEvent } from "react";
import { ContactDetails } from "../types";

interface ContactStepProps {
  contact: ContactDetails;
  isSubmitting: boolean;
  error: string | null;
  onChangeField: (field: keyof ContactDetails, value: string | boolean) => void;
  onSubmit: () => Promise<void> | void;
}

export function ContactStep({
  contact,
  isSubmitting,
  error,
  onChangeField,
  onSubmit,
}: ContactStepProps) {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Where should I send your quote?</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          I&apos;ll use these details only to follow up about this project. No newsletters or spam.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Name
          <input
            type="text"
            value={contact.name}
            onChange={(event) => onChangeField("name", event.target.value)}
            required
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            value={contact.email}
            onChange={(event) => onChangeField("email", event.target.value)}
            required
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Company (optional)
          <input
            type="text"
            value={contact.company}
            onChange={(event) => onChangeField("company", event.target.value)}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Tell me more about your project (optional)
          <textarea
            value={contact.additionalInfo}
            onChange={(event) => onChangeField("additionalInfo", event.target.value)}
            rows={4}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Anything specific I should know about your product, users or constraints?"
          />
        </label>

        <label className="flex items-start gap-2 text-xs text-neutral-300">
          <input
            type="checkbox"
            checked={contact.agreeToTerms}
            onChange={(event) => onChangeField("agreeToTerms", event.target.checked)}
            className="mt-0.5 h-3 w-3 rounded border-neutral-700 bg-neutral-900 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span>
            I agree to receive a quote via email for this project. I understand you&apos;ll store my
            details only for this conversation.
          </span>
        </label>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !contact.name || !contact.email || !contact.agreeToTerms}
        className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-700"
      >
        {isSubmitting ? "Sending quote…" : "Get my free quote"}
      </button>
    </form>
  );
}
