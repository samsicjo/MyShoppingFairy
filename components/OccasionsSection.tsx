import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface OccasionsSectionProps {
  selectedSituations: string[]
  onSituationChange: (situationId: string) => void
  situationOptions: { id: string; label: string; icon: string }[]
}

const OccasionsSection: React.FC<OccasionsSectionProps> = React.memo(
  ({
    selectedSituations,
    onSituationChange,
    situationOptions
  }) => {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">👔 주요 스타일 상황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {situationOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`situation-${option.id}`}
                  checked={selectedSituations.includes(option.id)}
                  onCheckedChange={() => onSituationChange(option.id)}
                />
                <Label htmlFor={`situation-${option.id}`} className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
)

OccasionsSection.displayName = 'OccasionsSection'

export default OccasionsSection
