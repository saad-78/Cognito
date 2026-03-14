import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-black selection:text-white border-border h-12 w-full min-w-0 rounded-none border bg-background px-4 text-sm transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
        "focus:border-foreground focus:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
