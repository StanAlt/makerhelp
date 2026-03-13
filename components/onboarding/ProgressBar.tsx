'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const stepLabels = ['Basic Info', 'Equipment', 'Specialties', 'Review']

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep
          return (
            <div key={step} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-2 w-full rounded-full transition-colors ${
                  isCompleted
                    ? 'bg-blue-600'
                    : isCurrent
                    ? 'bg-blue-400'
                    : 'bg-gray-200'
                }`}
              />
              <span
                className={`text-xs ${
                  isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {stepLabels[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
