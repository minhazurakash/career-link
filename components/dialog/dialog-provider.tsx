"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type DialogVariant = "info" | "success" | "warning" | "error";

export interface AlertOptions {
  title?: string;
  message: string;
  variant?: DialogVariant;
  confirmLabel?: string;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface DialogState {
  type: "alert" | "confirm";
  title: string;
  message: string;
  variant: DialogVariant;
  confirmLabel: string;
  cancelLabel: string;
}

interface DialogContextValue {
  alert: (options: AlertOptions | string) => Promise<void>;
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

function normalizeAlert(options: AlertOptions | string): Omit<DialogState, "type" | "cancelLabel"> {
  if (typeof options === "string") {
    return {
      title: "Notice",
      message: options,
      variant: "info",
      confirmLabel: "OK",
    };
  }
  return {
    title: options.title ?? defaultTitle(options.variant ?? "info"),
    message: options.message,
    variant: options.variant ?? "info",
    confirmLabel: options.confirmLabel ?? "OK",
  };
}

function normalizeConfirm(options: ConfirmOptions | string): Omit<DialogState, "type"> {
  if (typeof options === "string") {
    return {
      title: "Confirm",
      message: options,
      variant: "warning",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
    };
  }
  return {
    title: options.title ?? "Confirm",
    message: options.message,
    variant: options.variant ?? "warning",
    confirmLabel: options.confirmLabel ?? "Confirm",
    cancelLabel: options.cancelLabel ?? "Cancel",
  };
}

function defaultTitle(variant: DialogVariant): string {
  switch (variant) {
    case "success":
      return "Success";
    case "error":
      return "Error";
    case "warning":
      return "Warning";
    default:
      return "Notice";
  }
}

function DialogIcon({ variant }: { variant: DialogVariant }) {
  const base = "flex size-12 shrink-0 items-center justify-center rounded-full";
  const iconClass = "size-6";

  if (variant === "success") {
    return (
      <span className={`${base} bg-green-100 text-green-600`}>
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (variant === "error") {
    return (
      <span className={`${base} bg-red-100 text-red-600`}>
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  }
  if (variant === "warning") {
    return (
      <span className={`${base} bg-amber-100 text-amber-600`}>
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className={`${base} bg-[#e8f1ff] text-[#0a65cc]`}>
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </span>
  );
}

function confirmButtonClass(variant: DialogVariant, isConfirm: boolean): string {
  if (!isConfirm) {
    return "cursor-pointer rounded-[3px] border border-[#e4e5e8] bg-white px-5 py-2.5 text-sm font-semibold text-[#5e6670] transition-colors hover:bg-[#f1f2f4]";
  }
  if (variant === "error" || variant === "warning") {
    return "cursor-pointer rounded-[3px] bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700";
  }
  if (variant === "success") {
    return "cursor-pointer rounded-[3px] bg-[#0a65cc] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#095bb8]";
  }
  return "cursor-pointer rounded-[3px] bg-[#0a65cc] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#095bb8]";
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback((result: boolean) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setDialog(null);
  }, []);

  const alert = useCallback((options: AlertOptions | string) => {
    return new Promise<void>((resolve) => {
      const normalized = normalizeAlert(options);
      resolveRef.current = () => resolve();
      setDialog({
        type: "alert",
        cancelLabel: "",
        ...normalized,
      });
    });
  }, []);

  const confirm = useCallback((options: ConfirmOptions | string) => {
    return new Promise<boolean>((resolve) => {
      const normalized = normalizeConfirm(options);
      resolveRef.current = resolve;
      setDialog({
        type: "confirm",
        ...normalized,
      });
    });
  }, []);

  useEffect(() => {
    if (!dialog) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(dialog.type === "confirm" ? false : true);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dialog, close]);

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 cursor-default bg-[#18191c]/50 backdrop-blur-[2px]"
            onClick={() => close(dialog.type === "confirm" ? false : true)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            className="dialog-panel-enter relative w-full max-w-md rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-[0_24px_64px_rgba(0,44,109,0.18)]"
          >
            <div className="flex gap-4">
              <DialogIcon variant={dialog.variant} />
              <div className="min-w-0 flex-1">
                <h2
                  id="dialog-title"
                  className="text-lg font-semibold text-[#18191c]"
                >
                  {dialog.title}
                </h2>
                <p
                  id="dialog-description"
                  className="mt-2 text-sm leading-6 text-[#5e6670]"
                >
                  {dialog.message}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {dialog.type === "confirm" && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className={confirmButtonClass(dialog.variant, false)}
                >
                  {dialog.cancelLabel}
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className={confirmButtonClass(
                  dialog.variant,
                  true
                )}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
