import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmModal
 *
 * A minimal, accessible confirmation modal component used for destructive actions
 * such as deleting a bot or removing a team member.
 *
 * Notes:
 * - Keeps markup semantic and adds ARIA attributes for screen readers.
 * - Styling uses Tailwind utility classes to match the repo's styling approach.
 * - Controlled via the `isOpen` prop; parent is responsible for state.
 *
 * Usage:
 * <ConfirmModal
 *   isOpen={isOpen}
 *   title="Delete bot?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   onConfirm={handleConfirm}
 *   onCancel={() => setIsOpen(false)}
 * />
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    // Overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white dark:bg-gray-900 shadow-lg border p-6">
        <h2 id="confirm-modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id="confirm-modal-desc" className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 rounded-md border bg-transparent text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-sm text-white hover:bg-red-700 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
