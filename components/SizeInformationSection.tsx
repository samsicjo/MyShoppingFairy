import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SizeInformationSectionProps {
  topSize: string | ''
  setTopSize: (value: string | '') => void
  waistSize: number | ''
  setWaistSize: (value: number | '') => void
  shoeSize: number | ''
  setShoeSize: (value: number | '') => void
  topSizeOptions: string[]
  waistSizeOptions: string[]
  shoeSizeOptions: string[]
}

const SizeInformationSection: React.FC<SizeInformationSectionProps> = React.memo(
  ({
    topSize,
    setTopSize,
    waistSize,
    setWaistSize,
    shoeSize,
    setShoeSize,
    topSizeOptions,
    waistSizeOptions,
    shoeSizeOptions,
  }) => {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">📏 사이즈 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="topSize" className="text-base font-medium text-gray-700">
                상의 사이즈
              </Label>
              <Select value={topSize} onValueChange={(value: TopSize) => setTopSize(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="상의 사이즈를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {topSizeOptions.map((size) => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waistSize" className="text-base font-medium text-gray-700">허리 사이즈 (inch)</Label>
              <Select value={String(waistSize)} onValueChange={(value) => setWaistSize(Number(value))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="하의 사이즈를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {waistSizeOptions.map((size) => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shoeSize" className="text-base font-medium text-gray-700">
                신발 사이즈
              </Label>
              <Select value={String(shoeSize)} onValueChange={(value) => setShoeSize(Number(value))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="신발 사이즈를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {shoeSizeOptions.map((size) => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

SizeInformationSection.displayName = 'SizeInformationSection'

export default SizeInformationSection
