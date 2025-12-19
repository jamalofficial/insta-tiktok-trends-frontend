import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
      
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500",
      
        success:
          "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500",
      
        warning:
          "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400",
      
        info:
          "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500",
      
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
      
        muted:
          "bg-muted text-muted-foreground hover:bg-muted/80",
      
        link:
          "text-primary underline-offset-4 hover:underline",
      
        inverse:
          "bg-foreground text-background hover:bg-foreground/90",
      
        icon:
          "h-9 w-9 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent",
      
        disabled:
          "bg-muted text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
