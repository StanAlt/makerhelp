'use client'

import { useState } from 'react'
import SpecialtyTag from './SpecialtyTag'

const PRESET_SPECIALTIES: Record<string, string[]> = {
  Software: [
    'LightBurn',
    'RDWorks',
    'LaserGRBL',
    'xTool Creative Space',
    'Inkscape',
    'Illustrator',
    'CorelDRAW',
    'Fusion 360',
    'Canva',
  ],
  Materials: [
    'Wood',
    'Acrylic',
    'Leather',
    'Slate',
    'Glass',
    'Anodized Aluminum',
    'Stainless Steel',
    'Fabric',
    'Paper',
    'Foam',
    'Ceramic',
    'Cork',
  ],
  Techniques: [
    'Photo Engraving',
    'Vector Cutting',
    'Rotary Engraving',
    '3D Engraving',
    'Tile Method',
    'Painted Surfaces',
    'Multi-pass Cutting',
  ],
  'Machine Topics': [
    'Machine Setup & Calibration',
    'Focus & Alignment',
    'Speed & Power Settings',
    'Safety & Ventilation',
    'Maintenance & Cleaning',
    'Upgrades & Mods',
    'Troubleshooting',
  ],
  Business: [
    'Etsy & Selling',
    'Pricing Your Work',
    'Starting a Laser Business',
    'Product Photography',
  ],
}

interface StepThreeProps {
  specialties: string[]
  onToggleSpecialty: (specialty: string) => void
  onAddCustomSpecialty: (specialty: string) => void
}

export default function StepThree({
  specialties,
  onToggleSpecialty,
  onAddCustomSpecialty,
}: StepThreeProps) {
  const [customInput, setCustomInput] = useState('')

  const handleAddCustom = () => {
    const trimmed = customInput.trim()
    if (trimmed && !specialties.includes(trimmed)) {
      onAddCustomSpecialty(trimmed)
      setCustomInput('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Specialties & Skills</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select at least 3 specialties. These help makers find the right expert.
        </p>
      </div>

      {Object.entries(PRESET_SPECIALTIES).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <SpecialtyTag
                key={item}
                label={item}
                selected={specialties.includes(item)}
                onClick={() => onToggleSpecialty(item)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Custom specialties that aren't in presets */}
      {specialties.filter(
        (s) => !Object.values(PRESET_SPECIALTIES).flat().includes(s)
      ).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Custom</h3>
          <div className="flex flex-wrap gap-2">
            {specialties
              .filter((s) => !Object.values(PRESET_SPECIALTIES).flat().includes(s))
              .map((item) => (
                <SpecialtyTag
                  key={item}
                  label={item}
                  selected={true}
                  onClick={() => onToggleSpecialty(item)}
                />
              ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add a custom specialty
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCustom()
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type a specialty..."
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {specialties.length} selected{specialties.length < 3 && ' (minimum 3)'}
      </p>
    </div>
  )
}
