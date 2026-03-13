'use client'

import { EquipmentData } from '@/lib/actions/teacher-onboarding'
import EquipmentCard from './EquipmentCard'

interface StepTwoProps {
  equipment: EquipmentData[]
  onEquipmentChange: (index: number, field: keyof EquipmentData, value: string) => void
  onAddEquipment: () => void
  onRemoveEquipment: (index: number) => void
}

export default function StepTwo({
  equipment,
  onEquipmentChange,
  onAddEquipment,
  onRemoveEquipment,
}: StepTwoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Your Equipment</h2>
        <p className="text-sm text-gray-500 mt-1">
          What machines do you own? This is the most important differentiator for makers looking for help.
        </p>
      </div>

      <div className="space-y-4">
        {equipment.map((eq, index) => (
          <EquipmentCard
            key={index}
            equipment={eq}
            index={index}
            canRemove={equipment.length > 1}
            onChange={onEquipmentChange}
            onRemove={onRemoveEquipment}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddEquipment}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Another Machine
      </button>
    </div>
  )
}
