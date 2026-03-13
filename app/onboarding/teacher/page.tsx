'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from '@/components/onboarding/ProgressBar'
import StepOne from '@/components/onboarding/teacher/StepOne'
import StepTwo from '@/components/onboarding/teacher/StepTwo'
import StepThree from '@/components/onboarding/teacher/StepThree'
import StepFour from '@/components/onboarding/teacher/StepFour'
import {
  submitTeacherProfile,
  type EquipmentData,
} from '@/lib/actions/teacher-onboarding'

const EMPTY_EQUIPMENT: EquipmentData = {
  brand: '',
  model: '',
  laser_type: '',
  wattage: '',
  notes: '',
}

export default function TeacherOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1
  const [fullName, setFullName] = useState('')
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState(60)
  const [sessionLengths, setSessionLengths] = useState<number[]>([30, 60])

  // Step 2
  const [equipment, setEquipment] = useState<EquipmentData[]>([
    { ...EMPTY_EQUIPMENT },
  ])

  // Step 3
  const [specialties, setSpecialties] = useState<string[]>([])

  // Step 4
  const [confirmed, setConfirmed] = useState(false)

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleFieldChange = (
    field: string,
    value: string | number | number[]
  ) => {
    switch (field) {
      case 'fullName':
        setFullName(value as string)
        break
      case 'headline':
        setHeadline(value as string)
        break
      case 'bio':
        setBio(value as string)
        break
      case 'hourlyRate':
        setHourlyRate(value as number)
        break
      case 'sessionLengths':
        setSessionLengths(value as number[])
        break
    }
  }

  const handleEquipmentChange = (
    index: number,
    field: keyof EquipmentData,
    value: string
  ) => {
    setEquipment((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddEquipment = () => {
    setEquipment((prev) => [...prev, { ...EMPTY_EQUIPMENT }])
  }

  const handleRemoveEquipment = (index: number) => {
    setEquipment((prev) => prev.filter((_, i) => i !== index))
  }

  const handleToggleSpecialty = (specialty: string) => {
    setSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
  }

  const handleAddCustomSpecialty = (specialty: string) => {
    setSpecialties((prev) => [...prev, specialty])
  }

  const validateStep = (step: number): string[] => {
    const errors: string[] = []
    switch (step) {
      case 1:
        if (!fullName.trim()) errors.push('Full name is required')
        if (headline.length < 10)
          errors.push('Headline must be at least 10 characters')
        if (bio.length < 50)
          errors.push('Bio must be at least 50 characters')
        if (hourlyRate < 20 || hourlyRate > 500)
          errors.push('Hourly rate must be between $20 and $500')
        if (sessionLengths.length === 0)
          errors.push('Select at least one session length')
        break
      case 2:
        if (equipment.length === 0)
          errors.push('Add at least one machine')
        equipment.forEach((eq, i) => {
          if (!eq.brand)
            errors.push(`Machine ${i + 1}: Brand is required`)
          if (!eq.laser_type)
            errors.push(`Machine ${i + 1}: Laser type is required`)
        })
        break
      case 3:
        if (specialties.length < 3)
          errors.push('Select at least 3 specialties')
        break
    }
    return errors
  }

  const handleNext = () => {
    const errors = validateStep(currentStep)
    setValidationErrors(errors)
    if (errors.length === 0) {
      setCurrentStep((prev) => prev + 1)
      setError(null)
    }
  }

  const handleBack = () => {
    setValidationErrors([])
    setError(null)
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!confirmed) return
    setSubmitting(true)
    setError(null)

    const result = await submitTeacherProfile({
      fullName,
      headline,
      bio,
      hourlyRate,
      sessionLengths,
      equipment,
      specialties,
    })

    if (result.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    router.push('/onboarding/teacher/complete')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Set Up Your Teacher Profile
          </h1>
          <p className="text-gray-500 mt-1">
            Complete your profile to start helping makers on MakerHelp.
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {currentStep === 1 && (
            <StepOne
              fullName={fullName}
              headline={headline}
              bio={bio}
              hourlyRate={hourlyRate}
              sessionLengths={sessionLengths}
              onChange={handleFieldChange}
            />
          )}

          {currentStep === 2 && (
            <StepTwo
              equipment={equipment}
              onEquipmentChange={handleEquipmentChange}
              onAddEquipment={handleAddEquipment}
              onRemoveEquipment={handleRemoveEquipment}
            />
          )}

          {currentStep === 3 && (
            <StepThree
              specialties={specialties}
              onToggleSpecialty={handleToggleSpecialty}
              onAddCustomSpecialty={handleAddCustomSpecialty}
            />
          )}

          {currentStep === 4 && (
            <StepFour
              fullName={fullName}
              headline={headline}
              bio={bio}
              hourlyRate={hourlyRate}
              sessionLengths={sessionLengths}
              equipment={equipment}
              specialties={specialties}
              confirmed={confirmed}
              onConfirmChange={setConfirmed}
            />
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <ul className="text-sm text-red-600 space-y-1">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!confirmed || submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Profile for Review'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
