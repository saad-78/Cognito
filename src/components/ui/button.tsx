import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-black uppercase tracking-widest transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-foreground",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90",
        destructive: "bg-foreground text-background hover:opacity-80 transition-opacity",
        outline: "border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background",
        secondary: "bg-secondary text-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-10 px-6",
        lg: "h-14 px-10",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
