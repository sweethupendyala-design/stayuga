"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

const fieldBase =
  "w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-colors";

function FieldWrapper({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Input({
  label,
  error,
  className,
  type,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <FieldWrapper label={label} error={error}>
      <div className="relative">
        {/* suppressHydrationWarning: password-manager extensions (LastPass, Dashlane, …)
            inject attributes like fdprocessedid onto inputs after hydration — see layout.tsx */}
        <input
          suppressHydrationWarning
          type={isPassword ? (visible ? "text" : "password") : type}
          className={clsx(fieldBase, isPassword && "pr-11", className)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-soft hover:text-ink"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <FieldWrapper label={label} error={error}>
      <textarea suppressHydrationWarning className={clsx(fieldBase, "min-h-32 resize-y", className)} {...props} />
    </FieldWrapper>
  );
}

export function Select({
  label,
  error,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <FieldWrapper label={label} error={error}>
      <select suppressHydrationWarning className={clsx(fieldBase, className)} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}
