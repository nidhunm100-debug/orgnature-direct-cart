import type { ReactNode } from "react";

import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import { openWhatsApp } from "@/lib/whatsapp";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("h-4 w-4", className)} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.47.13-.62.15-.15.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.45 1.06 2.85 1.21 3.05.15.2 2.06 3.28 5.02 4.48.7.3 1.25.48 1.68.61.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41a9.35 9.35 0 0 1 6.65 2.76 9.32 9.32 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.42 9.41Zm8.02-17.43A11.28 11.28 0 0 0 12.04.75C5.82.75.76 5.81.76 12.03c0 1.99.52 3.93 1.5 5.64L.66 23.25l5.72-1.5a11.25 11.25 0 0 0 5.66 1.52h.01c6.21 0 11.27-5.06 11.27-11.28 0-3.01-1.17-5.84-3.3-7.96Z" />
    </svg>
  );
}

type Props = {
  message: string;
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  onOpened?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-7 text-sm sm:text-base",
};

export function WhatsAppButton({
  message,
  children,
  className,
  variant = "solid",
  size = "md",
  onOpened,
  disabled,
  type = "button",
}: Props) {
  const { contact } = useSettings();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={() => {
        openWhatsApp(message, contact.whatsapp);
        onOpened?.();
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide uppercase transition-all disabled:pointer-events-none disabled:opacity-50",
        variant === "solid"
          ? "bg-whatsapp text-whatsapp-foreground shadow-soft hover:brightness-95 active:scale-[0.98]"
          : "border border-whatsapp text-whatsapp hover:bg-whatsapp/10",
        sizes[size],
        className,
      )}
    >
      <WhatsAppIcon className="h-4 w-4 shrink-0" />
      {children}
    </button>
  );
}
