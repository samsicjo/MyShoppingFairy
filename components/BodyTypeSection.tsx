import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface BodyTypeSectionProps {
  selectedBodyTypes: string[]
  onBodyTypeChange: (bodyTypeId: string) => void
  bodyTypeOptions: { id: string; label: string }[]
}

const BodyTypeSection: React.FC<BodyTypeSectionProps> = React.memo(
  ({
    selectedBodyTypes,
    onBodyTypeChange,
    bodyTypeOptions
  }) => {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">👤 체형 특징 (선택사항)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bodyTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`bodytype-${option.id}`}
                  checked={selectedBodyTypes.includes(option.id)}
                  onCheckedChange={() => onBodyTypeChange(option.id)}
                />
                <Label htmlFor={`bodytype-${option.id}`} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
)

BodyTypeSection.displayName = 'BodyTypeSection'

export default BodyTypeSection
