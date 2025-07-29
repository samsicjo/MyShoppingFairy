"use client"

import React, { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface OptimizedTextareaProps {
  id: string
  label: string
  placeholder: string
  initialValue: string
  maxLength: number
  onSave: (value: string) => void // Callback when value is finalized (e.g., on blur)
  description?: string
}

export function OptimizedTextarea({
  id,
  label,
  placeholder,
  initialValue,
  maxLength,
  onSave,
  description,
}: OptimizedTextareaProps) {
  const [internalMemo, setInternalMemo] = useState(initialValue)
  const [charCount, setCharCount] = useState(initialValue.length)

  // Update internal state if initialValue changes from parent (e.g., on initial load or reset)
  useEffect(() => {
    setInternalMemo(initialValue)
    setCharCount(initialValue.length)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInternalMemo(value)
    setCharCount(value.length)
  }

  const handleBlur = () => {
    onSave(internalMemo) // Propagate the value to the parent on blur
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Textarea
          id={id}
          placeholder={placeholder}
          value={internalMemo}
          onChange={handleChange}
          onBlur={handleBlur} // Important for performance optimization
          className="min-h-[120px] border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
          maxLength={maxLength}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {charCount}/{maxLength}자
        </div>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  )
}
