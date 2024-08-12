import { startCase } from 'app/utils/startCase'
import { SetStateAction, useEffect, useState } from 'react'
import * as yup from 'yup'

export enum ValidationSchemaType {
  yup = 'yup'
}

type ValidationFormErrors<T> = Record<keyof T, string>

export function useForm<T>(
  initial: T,
  constant?: Partial<T>,
  options?: {
    validationSchema?: {
      type?: ValidationSchemaType
      schema: yup.AnyObjectSchema
    }
    label?: boolean
  }
) {
  const [form, setForm] = useState<T>(initial)
  const [errors, setErrors] = useState<ValidationFormErrors<T>>({} as any)
  const [dirty, setDirty] = useState<Record<keyof T, boolean>>({} as any)
  const [apiErrors, setApiErrors] = useState({})

  function setApiFormErrors(errors: SetStateAction<{}>) {
    setApiErrors(errors)
  }

  useEffect(() => {
    setErrors(prevErrors => ({
      ...prevErrors,
      ...apiErrors
    }))
  }, [apiErrors])

  function validate(): [boolean, Record<keyof T, string>] {
    try {
      const validationSchema = options?.validationSchema?.schema

      const validationSchemaType = options?.validationSchema?.type || ValidationSchemaType.yup
      if (validationSchema) {
        switch (validationSchemaType) {
          case ValidationSchemaType.yup:
            validationSchema.validateSync(form, {
              abortEarly: false
            })
            break

          default:
            break
        }
      }
      return [true, {} as ValidationFormErrors<T>]
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce((acc, curr) => {
          if (curr instanceof yup.ValidationError) {
            return { ...acc, [curr.path!]: curr.message }
          } else return acc
        }, {}) as ValidationFormErrors<T>

        return [false, errors]
      } else {
        return [false, { unknown: 'unknown' } as ValidationFormErrors<T>]
      }
    }
  }

  function handleChange<TKey extends keyof T>(key: TKey, value: T[TKey]) {
    setDirty(previousState => ({ ...previousState, [key]: true }))
    setForm(previousForm => ({ ...previousForm, [key]: value, ...constant }))
  }

  function getError<TKey extends keyof T>(key: TKey) {
    return errors[key] || ''
  }

  useEffect(() => {
    const [valid, errors] = validate()
    setErrors(() => {
      const dityKeys = Object.entries(dirty)
        .filter(([key, value]) => value === true)
        .map(([key]) => key) as (keyof T)[]

      const newErrors = {} as typeof errors

      dityKeys.forEach(key => {
        newErrors[key] = errors[key]
      })

      return newErrors
    })
  }, [form])

  function setTextInputProps<TKey extends keyof T>(key: TKey) {
    return {
      value: form[key],
      onChangeText: (text: T[TKey]) => handleChange(key, text),
      error: errors[key],
      label: options?.label === true ? startCase(key as string) : undefined
    }
  }

  function setSecureTextInputProps<TKey extends keyof T>(key: TKey) {
    return {
      value: form[key],
      onChangeText: (text: T[TKey]) => handleChange(key, text),
      error: errors[key],
      label: options?.label === true ? startCase(key as string) : undefined,
      isSecureText: true
    }
  }

  return {
    setApiFormErrors,
    validate,
    form,
    setTextInputProps,
    setSecureTextInputProps,
    isValid: () => validate()[0],
    runIfValid: (callback: () => any) => {
      const [valid, errors] = validate()
      if (valid) {
        callback()
      }
      setErrors(errors)
    },
    handleChange,
    resetForm: (resetData?: Partial<T>) => {
      setForm({ ...initial, ...constant, ...(resetData || {}) })
      setErrors({} as ValidationFormErrors<T>)
      setDirty({} as Record<keyof T, boolean>)
    },
    getError
  }
}
