// src/components/auth/ApplicantSignupForm.tsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { inputClass, inputErrorClass, labelClass, fieldErrorClass } from '@/components/auth/formFieldStyles'

const applicantSchema = z.object({
  full_name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type ApplicantFormValues = z.infer<typeof applicantSchema>

interface Props {
  onBack: () => void
  onSubmit: (data: ApplicantFormValues) => void | Promise<void>
  isSubmitting: boolean
  error: string | null
}

export default function ApplicantSignupForm({ onBack, onSubmit, isSubmitting, error }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    defaultValues: { full_name: '', email: '', password: '' },
    mode: 'onBlur',
  })

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>
      <h2 className="text-base font-semibold text-card-foreground mb-1">Talent / Applicant Sign Up</h2>
      <p className="text-[12px] text-muted-foreground mb-5">
        Create your account to start browsing verified jobs.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            className={`${inputClass} ${errors.full_name ? inputErrorClass : ''}`}
            {...register('full_name')}
          />
          {errors.full_name && <p className={fieldErrorClass}>{errors.full_name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
            {...register('email')}
          />
          {errors.email && <p className={fieldErrorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`${inputClass} pr-10 ${errors.password ? inputErrorClass : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className={fieldErrorClass}>{errors.password.message}</p>}
        </div>

        {error && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-gold text-black text-[13px] font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        >
          <Lock className="w-3.5 h-3.5" />
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </>
  )
}
