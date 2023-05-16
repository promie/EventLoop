import { string, object, InferType, ref, date } from 'yup'
import { sub } from 'date-fns/fp'

export const emailRegisterFormSchema = object({
  email: string()
    .email('Email must be a valid email')
    .required('This field is required'),
})

// @ts-ignore
export const registerFormSchema = object({
  firstName: string().required('This field is required'),
  lastName: string().required('This field is required'),
  dateOfBirth: date()
    .typeError('This field is required')
    .required()
    .max(sub({ years: 12 }, new Date()), 'You must be 12 years old and over'),
  billingAddress: string().required('This field is required'),
  email: string()
    .email('Email must be a valid email')
    .required('This field is required'),
  password: string()
    .required('This field is required')
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password cannot be more than 15 characters')
    .test(
      'isValidPass',
      'Password must contain an uppercase, lowercase, number and special character',
      (value: any, context: any) => {
        const hasUpperCase = /[A-Z]/.test(value)
        const hasLowerCase = /[a-z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        const hasSymbole = /[!@#%&]/.test(value)
        let validConditions = 0
        const numberOfMustBeValidConditions = 3
        const conditions = [hasLowerCase, hasUpperCase, hasNumber, hasSymbole]
        conditions.forEach(condition => (condition ? validConditions++ : null))
        if (validConditions >= numberOfMustBeValidConditions) {
          return true
        }
        return false
      },
    ),
  confirmPassword: string()
    .required('This field is required')
    .oneOf([ref('password'), null], 'Passwords must match')
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password cannot be more than 15 characters')
    .test(
      'isValidPass',
      'Password must contain an uppercase, lowercase, number and special character',
      (value: any, context: any) => {
        const hasUpperCase = /[A-Z]/.test(value)
        const hasLowerCase = /[a-z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        const hasSymbole = /[!@#%&]/.test(value)
        let validConditions = 0
        const numberOfMustBeValidConditions = 3
        const conditions = [hasLowerCase, hasUpperCase, hasNumber, hasSymbole]
        conditions.forEach(condition => (condition ? validConditions++ : null))
        if (validConditions >= numberOfMustBeValidConditions) {
          return true
        }
        return false
      },
    ),
})

export type EmailRegisterFormSchemaType = InferType<
  typeof emailRegisterFormSchema
>
export type RegisterFormSchemaType = InferType<typeof registerFormSchema>
