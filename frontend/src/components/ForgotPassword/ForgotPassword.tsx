import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { InfinitySpin } from 'react-loader-spinner'
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormSchemaType,
} from '../../schema/forgotPassword'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import ForgotPasswordConfirmation from '../ForgotPasswordConfirmation'
import InvalidNotification from '../InvalidNotification'
import { forgotPassword } from '../../features/auth/authAction'

interface IProps {
  setShowForgotPassword: any
}

const ForgotPassword: FC<IProps> = ({ setShowForgotPassword }) => {
  const [showForgotPasswordConfirmation, setShowForgotPasswordConfirmation] =
    useState<boolean>(false)
  const [showErrorState, setShowErrorState] = useState<boolean>(false)

  const { loading } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormSchemaType>({
    resolver: yupResolver(forgotPasswordFormSchema),
  })

  const onSubmit = async (values: ForgotPasswordFormSchemaType) => {
    const response = await dispatch(
      // @ts-ignore
      forgotPassword({
        email: values.email,
        frontEndHost: window.location.origin,
      }),
    )
    setShowErrorState(false)

    if (response?.payload === 'Invalid email.') {
      setShowErrorState(true)
      return
    }

    if (response?.payload?.status === 'OK') {
      // Show the confirmation email that it has been sent
      setShowErrorState(false)
      setShowForgotPasswordConfirmation(true)
    }
  }

  return (
    <div>
      {showForgotPasswordConfirmation ? (
        <ForgotPasswordConfirmation
          email={watch('email')}
          setShowForgotPassword={setShowForgotPassword}
          setShowForgotPasswordConfirmation={setShowForgotPasswordConfirmation}
        />
      ) : (
        <>
          <div className="mb-[45px]">
            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
              Forgot your password?
            </h1>
            <p className="text-[14px]">
              We will send you an email with instructions on how to reset your
              password.
            </p>
          </div>

          {showErrorState && (
            <InvalidNotification header={'Error'} content={'Invalid email.'} />
          )}

          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-bold">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                {...register('email')}
                className={
                  errors?.email?.message
                    ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                    : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                }
              />
              <span className="text-red-500">{errors?.email?.message}</span>
            </div>

            <button
              type="submit"
              className={
                loading
                  ? 'flex items-center justify-center w-full'
                  : 'btn btn-primary btn-block capitalize px-4 py-3 mt-6'
              }
            >
              {loading ? (
                <span>
                  <InfinitySpin width="150" color="#38b6ff" />
                </span>
              ) : (
                'Send'
              )}
            </button>
          </form>
          <div className="text-center mt-5">
            <p
              className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700 cursor-pointer"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to log in
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default ForgotPassword
