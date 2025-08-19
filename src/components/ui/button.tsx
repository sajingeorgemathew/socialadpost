// src/components/ui/button.tsx
"use client";

import { FC, ButtonHTMLAttributes, ReactNode } from "react";
import cn from "clsx"; // optional for conditional classNames

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
}

export const Button: FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "default",
  className,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeClass =
    size === "sm" ? "px-2 py-1 text-sm" : size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2 text-base";
  const variantClass =
    variant === "outline"
      ? "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button className={`${base} ${sizeClass} ${variantClass} ${className || ""}`} {...props}>
      {children}
    </button>
  );
};
