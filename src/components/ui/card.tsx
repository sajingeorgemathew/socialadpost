// src/components/ui/card.tsx
"use client";

import { FC, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => {
  return <div className={`bg-white rounded-lg shadow p-4 ${className || ""}`}>{children}</div>;
};

export const CardContent: FC<CardProps> = ({ children, className }) => {
  return <div className={`p-4 ${className || ""}`}>{children}</div>;
};
