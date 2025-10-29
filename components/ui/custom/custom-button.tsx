'use client'

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"
import { MouseEventHandler } from "react"

interface CustomButtonProps {
  icon: LucideIcon
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  tooltip: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

export const CustomButton = ({ icon: Icon, variant = "outline", tooltip, onClick, className = '' }: CustomButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="sm"
            className={`h-8 w-8 p-0 ${className}`}
            onClick={onClick}
          >
            <Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

