import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { InfinitySpin } from 'react-loader-spinner'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { loginSchema, LoginSchemaType } from '../../schema/login'
import { HiEyeOff, HiEye } from 'react-icons/hi'
import Logo from '../../components/Logo'
import { loginUser } from '../../features/auth/authAction'
import InvalidNotification from '../../components/InvalidNotification'
import Copyright from '../../components/Copyright'
import ForgotPassword from '../../components/ForgotPassword'

const Login: FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
  const [displayPassword, setDisplayPassword] = useState<boolean>(false)
  const [searchParams] = useSearchParams()

  const { loading, token, error } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  // Utilising the react-form-hooks and yup for form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(loginSchema),
  })

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [navigate, token])

  const onSubmit = (values: LoginSchemaType) => {
    // @ts-ignore
    dispatch(loginUser(values))
  }

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-blue-600 hidden lg:block w-full wd:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://images.unsplash.com/photo-1496024840928-4c417adf211d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          className="object-cover h-screen"
          alt="login event"
        />
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl font-bold ml-[-10px]">
            <Logo />
          </h1>{' '}
          {showForgotPassword ? (
            <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
          ) : (
            <>
              <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
                Login to your account
              </h1>
              {error && (
                <InvalidNotification
                  header={error}
                  content={'Please enter valid email and password'}
                />
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
                    {...register('email', {
                      value: searchParams.get('email') || '',
                    })}
                    className={
                      errors?.email?.message
                        ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                        : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                    }
                  />
                  <span className="text-red-500">{errors?.email?.message}</span>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 font-bold">
                    Password
                  </label>

                  <div className="flex items-center">
                    <input
                      type={displayPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Enter password"
                      {...register('password')}
                      className={
                        errors?.password?.message
                          ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                          : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                      }
                    />{' '}
                    {displayPassword ? (
                      <HiEyeOff
                        className="-ml-9 cursor-pointer"
                        size={20}
                        onClick={() => setDisplayPassword(!displayPassword)}
                      />
                    ) : (
                      <HiEye
                        className="-ml-9 cursor-pointer"
                        size={20}
                        onClick={() => setDisplayPassword(!displayPassword)}
                      />
                    )}
                  </div>
                  <span className="text-red-500">
                    {errors?.password?.message}
                  </span>
                </div>
                <div className="text-right mt-2">
                  <p
                    className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700 cursor-pointer"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot your password?
                  </p>
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
                    'Login'
                  )}
                </button>
              </form>
              <hr className="my-6 border-gray-300 w-full" />
              <p className="mt-8">
                Need an account?{' '}
                <Link to={'/register'} className="text-[#38b6ff] font-semibold">
                  Create an account
                </Link>
              </p>
            </>
          )}
          {showForgotPassword && <hr className="my-6 border-gray-300 w-full" />}
          <Copyright />
        </div>
      </div>
    </section>
  )
}

export default Login
