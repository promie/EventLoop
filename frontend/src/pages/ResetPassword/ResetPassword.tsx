import { FC, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { InfinitySpin } from 'react-loader-spinner'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import Logo from '../../components/Logo'
import { Link } from 'react-router-dom'
import Copyright from '../../components/Copyright'
import {
  resetPasswordFormSchema,
  ResetPasswordFormSchemaType,
} from '../../schema/resetPassword'
import { resetPassword } from '../../features/auth/authAction'
import InvalidNotification from '../../components/InvalidNotification'

const ResetPassword: FC = () => {
  const [displayError, setDisplayError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { loading } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormSchemaType>({
    resolver: yupResolver(resetPasswordFormSchema),
  })

  const onSubmit = async (values: ResetPasswordFormSchemaType) => {
    const token = searchParams.get('token')
    setDisplayError(false)

    // Scenario where there is no token in the query string of the url
    if (!token) {
      setErrorMessage('There is no token being passed in the query string.')
      setDisplayError(true)
      return
    }

    if (token) {
      const response = await dispatch(
        // @ts-ignore
        resetPassword({ newPassword: values.newPassword, resetToken: token }),
      )

      // If there is a token, but the token is expired.
      if (response.type === 'auth/resetPassword/rejected') {
        setErrorMessage(response.payload)
        setDisplayError(true)
        return
      } else {
        // everything is all good, loading spinner and then redirect back to login page
        navigate('/login')
        toast.success('Your password has successfully been reset.')
      }
    }
  }

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-blue-600 hidden lg:block w-full wd:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://images.unsplash.com/photo-1641976689712-8a6d1c91a474?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          className="object-cover h-screen"
          alt="login event"
        />
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl font-bold ml-[-10px]">
            <Logo />
          </h1>{' '}
          <>
            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
              Reset Password
            </h1>

            {displayError && (
              <InvalidNotification header={'Error'} content={errorMessage} />
            )}

            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-gray-700 font-bold">
                  New password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...register('newPassword')}
                  placeholder="Enter new password"
                  className={
                    errors?.newPassword?.message
                      ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                      : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                  }
                />
                <span className="text-red-500">
                  {errors?.newPassword?.message}
                </span>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-bold">
                  Confirm new password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  {...register('confirmNewPassword')}
                  placeholder="Enter confirm new password"
                  className={
                    errors?.confirmNewPassword?.message
                      ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                      : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                  }
                />
                <span className="text-red-500">
                  {errors?.confirmNewPassword?.message}
                </span>
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
                  'Reset password'
                )}
              </button>
            </form>
            <hr className="my-6 border-gray-300 w-full" />
            <p className="mt-8">
              Already have an account?{' '}
              <Link to={'/register'} className="text-[#38b6ff] font-semibold">
                Login
              </Link>
            </p>
          </>
          <Copyright />
        </div>
      </div>
    </section>
  )
}

export default ResetPassword
