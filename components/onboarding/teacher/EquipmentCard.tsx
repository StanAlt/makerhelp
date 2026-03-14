'use client'

import { EquipmentEntry } from './TeacherOnboardingForm'

const BRANDS = [
  'xTool',
  'Atomstack',
  'Glowforge',
  'OMTech',
  'Thunder Laser',
  'Sculpfun',
  'Creality',
  'FLUX (Beamo/Hexa)',
  'Longer',
  'Monport',
  'Boss Laser',
  'Full Spectrum',
  'Trotec',
  'Epilog',
  'ComMarker',
  'WeCreat',
  'Other',
]

const LASER_TYPES = [
  { value: 'diode', label: 'Diode' },
  { value: 'co2', label: 'CO2' },
  { value: 'fiber', label: 'Fiber' },
  { value: 'uv', label: 'UV' },
  { value: 'galvo', label: 'Galvo' },
]

interface EquipmentCardProps {
  equipment: EquipmentEntry
  index: number
  canRemove: boolean
  onChange: (index: number, field: string, value: string) => void
  onRemove: (index: number) => void
}

export default function EquipmentCard({
  equipment,
  index,
  canRemove,
  onChange,
  onRemove,
}: EquipmentCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 relative">
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg font-bold"
          title="Remove machine"
        >
          &times;
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            value={equipment.brand}
            onChange={(e) => onChange(index, 'brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select brand...</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            value={equipment.model}
            onChange={(e) => onChange(index, 'model', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="P2, S1, 55W, etc."
          />
          {!equipment.model && equipment.brand && (
            <p className="text-xs text-amber-600 mt-1">
              Adding a model helps makers find you
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Laser Type <span className="text-red-500">*</span>
          </label>
          <select
            value={equipment.laserType}
            onChange={(e) => onChange(index, 'laserType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select type...</option>
            {LASER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wattage
          </label>
          <input
            type="text"
            value={equipment.wattage}
            onChange={(e) => onChange(index, 'wattage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="10W, 55W, 100W, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={equipment.notes}
            onChange={(e) => onChange(index, 'notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any special config, add-ons, or experience notes"
          />
        </div>
      </div>
    </div>
  )
}
