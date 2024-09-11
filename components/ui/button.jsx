import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-auto disabled:cursor-not-allowed	disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90",
        // default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary: "bg-[#E2E8F0] text-[#2D2D2D] hover:bg-[#E2E8F0]/80 dark:bg-[#E2E8F0] dark:text-[#2D2D2D] dark:hover:bg-[#E2E8F0]/80",
        // secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        tertiary: "bg-[#673090] text-white hover:bg-[#673090]/80 dark:bg-[#673090] dark:text-white dark:hover:bg-[#673090]/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading}
      ref={ref}
      {...props}>
        <>
          {loading && <Loader2 className={cn('h-4 w-4 animate-spin', children && 'mr-2')} />}
          {children}
        </>
      </Comp>
      )
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
