import { string, object, InferType } from 'yup'

export const forgotPasswordFormSchema = object({
  email: string()
    .email('Email must be a valid email')
    .required('This field is required'),
})

export type ForgotPasswordFormSchemaType = InferType<
  typeof forgotPasswordFormSchema
>
