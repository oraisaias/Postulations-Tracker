"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"

export function useSimpleForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is changed
    if (errors[name as keyof T]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof T]
        return newErrors
      })
    }
  }

  const handleDateChange = (name: keyof T, value: Date | null) => {
    setValues((prev) => ({ ...prev, [name]: value || new Date() }))

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = (validationRules: Record<keyof T, (value: any) => string | null>) => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach((key) => {
      const fieldKey = key as keyof T
      const error = validationRules[fieldKey](values[fieldKey])
      if (error) {
        newErrors[fieldKey] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (
    onSubmit: (values: T) => void | Promise<void>,
    validationRules?: Record<keyof T, (value: any) => string | null>,
  ) => {
    return async (e: FormEvent) => {
      e.preventDefault()

      // Validate if rules provided
      if (validationRules && !validate(validationRules)) {
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const reset = (newValues: T = initialValues) => {
    setValues(newValues)
    setErrors({})
  }

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleDateChange,
    handleSelectChange,
    handleSubmit,
    reset,
    setValues,
  }
}
