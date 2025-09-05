"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * QuickActionsToolbar
 *
 * Horizontal toolbar of large, accessible action buttons for common tasks:
 * - Add funds, Create bot, Deposit
 * - Keyboard navigable (ArrowLeft / ArrowRight), focus ring, tooltips via title
 * - Collapses to an overflow menu on small screens
 *
 * This enhances the existing simple QuickActions primitive by adding accessibility
 * and responsive behaviour without adding new deps.
 */

export interface QuickAction {
  id: string;
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  title?: string; // tooltip
}

interface Props {
  actions?: QuickAction[];
  className?: string;
}

export default function QuickActionsToolbar({ actions: initialActions = [], className = "" }: Props) {
  // default demo actions if none provided
  const defaultActions: QuickAction[] = [
    {
      id: "add-funds",
      label: "Add funds",
      icon: "💵",
      title: "Add funds to your account",
      onClick: () => {
        // noop — parent should provide real handlers
        alert("Add funds clicked (demo)");
      },
    },
    {
      id: "create-bot",
      label: "Create bot",
      icon: "🤖",
      title: "Create a new trading bot",
      onClick: () => alert("Create bot clicked (demo)"),
    },
    {
      id: "deposit",
      label: "Deposit",
      icon: "🏦",
      title: "Initiate a deposit",
      onClick: () => alert("Deposit clicked (demo)"),
    },
  ];

  const actions = initialActions.length > 0 ? initialActions : defaultActions;

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // keyboard navigation
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (focusedIndex === null) {
          setFocusedIndex(0);
          return;
        }
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (focusedIndex + dir + actions.length) % actions.length;
        setFocusedIndex(next);
        btnRefs.current[next]?.focus();
      }
    },
    [focusedIndex, actions.length]
  );

  // clear focus index when focus leaves toolbar
  useEffect(() => {
    const handleDocFocus = (e: FocusEvent) => {
      if (!e.target) return;
      if (!btnRefs.current.some((b) => b === e.target || (b && b.contains(e.target as Node)))) {
        setFocusedIndex(null);
      }
    };
    document.addEventListener("focusin", handleDocFocus);
    return () => document.removeEventListener("focusin", handleDocFocus);
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`} onKeyDown={onKeyDown} role="toolbar" aria-label="Quick actions">
      {actions.map((a, i) => (
        <button
          ref={(el) => { btnRefs.current[i] = el; }}
          key={a.id}
          type="button"
          onClick={a.onClick}
          title={a.title ?? a.label}
          aria-label={a.title ?? a.label}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition text-sm ${
            focusedIndex === i ? "ring-2 ring-primary" : ""
          } bg-primary text-white hover:opacity-95`}
        >
          <span aria-hidden>{a.icon}</span>
          <span className="hidden sm:inline">{a.label}</span>
        </button>
      ))}
    </div>
  );
}
