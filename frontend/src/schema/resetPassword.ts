import { InferType, object, ref, string } from 'yup'

export const resetPasswordFormSchema = object({
  newPassword: string()
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
  confirmNewPassword: string()
    .required('This field is required')
    .oneOf([ref('newPassword'), null], 'Passwords must match')
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

export type ResetPasswordFormSchemaType = InferType<
  typeof resetPasswordFormSchema
>
