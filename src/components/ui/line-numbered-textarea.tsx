"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LineNumberedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  lineNumbersClassName?: string;
}

const LineNumberedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  LineNumberedTextareaProps
>(({ className, lineNumbersClassName, onChange, value, ...props }, ref) => {
  const [lineCount, setLineCount] = React.useState<number>(1);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const combinedRef = (node: HTMLTextAreaElement) => {
    textareaRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  // Calculate line numbers when value changes
  React.useEffect(() => {
    const lines = ((value as string) || "").split("\n").length;
    setLineCount(lines);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
    
    // Update line count
    const lines = e.target.value.split("\n").length;
    setLineCount(lines);
  };

  // Create line numbers
  const lineNumbers = React.useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");
  }, [lineCount]);

  return (
    <div className="relative flex">
      {/* Line numbers */}
      <div 
        className={cn(
          "absolute top-0 left-0 flex-shrink-0 px-2 pt-2 pb-0 text-right select-none text-neutral-400 bg-neutral-200 rounded-l-md z-10 font-mono whitespace-pre",
          lineNumbersClassName
        )}
        style={{ 
          width: "2rem",
          height: "100%",
          overflowY: "hidden"
        }}
        aria-hidden="true"
      >
        {lineNumbers}
      </div>
      
      {/* Actual textarea */}
      <textarea
        ref={combinedRef}
        className={cn(
          "flex w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-8 font-mono",
          className
        )}
        onChange={handleChange}
        value={value}
        {...props}
      />
    </div>
  );
});
LineNumberedTextarea.displayName = "LineNumberedTextarea";

export { LineNumberedTextarea }; 