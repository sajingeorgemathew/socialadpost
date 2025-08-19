// src/components/ui/textarea.tsx
"use client";

import { TextareaHTMLAttributes } from "react";

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
      {...props}
    />
  );
};
