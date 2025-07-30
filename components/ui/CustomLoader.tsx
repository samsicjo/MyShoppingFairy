"use client"

import React from "react"
import { Loader2, type LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"

const CustomLoader = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn("animate-spin text-[#E8B5B8]", className)}
        {...props}
      />
    )
  }
)
CustomLoader.displayName = "CustomLoader"

export { CustomLoader }
