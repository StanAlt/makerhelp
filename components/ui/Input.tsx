import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-charcoal border border-steel rounded-btn px-4 py-3 font-ui text-sm text-ivory placeholder:text-sage focus:outline-none focus:border-ember transition-colors duration-200 ${className}`}
        {...props}
      />
    </div>
  )
}
