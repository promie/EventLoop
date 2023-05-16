import { string, object, InferType } from 'yup'

export const loginSchema = object({
  email: string()
    .email('Email must be a valid email')
    .required('This field is required'),
  password: string().required('This field is required'),
})

export type LoginSchemaType = InferType<typeof loginSchema>
