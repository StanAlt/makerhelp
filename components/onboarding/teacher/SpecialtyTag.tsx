'use client'

interface SpecialtyTagProps {
  label: string
  selected: boolean
  onClick: () => void
}

export default function SpecialtyTag({ label, selected, onClick }: SpecialtyTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        selected
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}
