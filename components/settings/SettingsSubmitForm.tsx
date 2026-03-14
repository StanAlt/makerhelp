'use client'

import { useState } from 'react'
import { submitSettings } from '@/app/settings/submit/actions'

const BRANDS = [
  'xTool', 'Atomstack', 'Glowforge', 'OMTech', 'Thunder Laser', 'Sculpfun',
  'Creality', 'FLUX', 'Longer', 'Monport', 'Boss Laser', 'Full Spectrum',
  'Trotec', 'Epilog', 'ComMarker', 'WeCreat', 'Other',
]

const COMMON_MATERIALS = [
  'Wood', 'Birch Plywood', 'MDF', 'Acrylic', 'Leather', 'Slate', 'Glass',
  'Anodized Aluminum', 'Stainless Steel', 'Fabric', 'Paper', 'Cardboard',
  'Foam', 'Ceramic', 'Cork', 'Rubber',
]

export function SettingsSubmitForm({ userId }: { userId: string }) {
  const [operationType, setOperationType] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const showLineInterval = operationType === 'engrave' || operationType === 'fill'
  const showDpi = operationType === 'engrave'

  return (
    <form
      action={async (formData: FormData) => {
        setSubmitting(true)
        await submitSettings(formData)
        setSubmitting(false)
      }}
      className="space-y-6"
    >
      {/* Machine Section */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Machine</legend>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <select
              name="machine_brand"
              required
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select brand...</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <input
              name="machine_model"
              type="text"
              placeholder="P2, S1, 55W..."
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Laser Type <span className="text-red-500">*</span>
            </label>
            <select
              name="laser_type"
              required
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select type...</option>
              <option value="diode">Diode</option>
              <option value="co2">CO2</option>
              <option value="fiber">Fiber</option>
              <option value="uv">UV</option>
              <option value="galvo">Galvo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Wattage</label>
            <input
              name="machine_wattage"
              type="text"
              placeholder="10W, 55W, 100W..."
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </fieldset>

      {/* Material Section */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Material</legend>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Material <span className="text-red-500">*</span>
            </label>
            <input
              name="material"
              type="text"
              required
              list="material-suggestions"
              placeholder="e.g. Birch Plywood"
              className="w-full border rounded-lg px-3 py-2"
            />
            <datalist id="material-suggestions">
              {COMMON_MATERIALS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Thickness (mm)
            </label>
            <input
              name="material_thickness_mm"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 3.0"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Material Brand
            </label>
            <input
              name="material_brand"
              type="text"
              placeholder="e.g. Woodcraft"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Finish
            </label>
            <input
              name="material_finish"
              type="text"
              placeholder="raw, painted, anodized..."
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </fieldset>

      {/* Operation & Settings Section */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Operation &amp; Settings</legend>

        <div>
          <label className="block text-sm font-medium mb-1">
            Operation Type <span className="text-red-500">*</span>
          </label>
          <select
            name="operation_type"
            required
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select operation...</option>
            <option value="cut">Cut</option>
            <option value="engrave">Engrave</option>
            <option value="score">Score</option>
            <option value="fill">Fill</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Speed (mm/min)
            </label>
            <input
              name="speed"
              type="number"
              min="1"
              placeholder="e.g. 300"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Power (%)
            </label>
            <input
              name="power_percent"
              type="number"
              min="1"
              max="100"
              placeholder="e.g. 80"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passes</label>
            <input
              name="passes"
              type="number"
              min="1"
              defaultValue={1}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          {showLineInterval && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Line Interval (mm)
              </label>
              <input
                name="line_interval_mm"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 0.06"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">
              Focus Offset (mm)
            </label>
            <input
              name="focus_offset_mm"
              type="number"
              step="0.1"
              placeholder="e.g. 0"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          {showDpi && (
            <div>
              <label className="block text-sm font-medium mb-1">DPI</label>
              <input
                name="dpi"
                type="number"
                min="50"
                placeholder="e.g. 318"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input name="air_assist" type="checkbox" className="w-4 h-4" />
          <span className="text-sm">Air assist used</span>
        </label>

        <div>
          <label className="block text-sm font-medium mb-1">Software</label>
          <select name="software" className="w-full border rounded-lg px-3 py-2">
            <option value="">Select software...</option>
            <option value="LightBurn">LightBurn</option>
            <option value="RDWorks">RDWorks</option>
            <option value="xTool Creative Space">xTool Creative Space</option>
            <option value="LaserGRBL">LaserGRBL</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </fieldset>

      {/* Result Section */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Result</legend>

        <div>
          <label className="block text-sm font-medium mb-1">
            Result Quality
          </label>
          <select
            name="result_quality"
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select quality...</option>
            <option value="perfect">Perfect</option>
            <option value="good">Good</option>
            <option value="ok">OK</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            name="result_notes"
            rows={3}
            placeholder="Any tips, observations, or warnings about these settings..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Settings'}
      </button>
    </form>
  )
}
