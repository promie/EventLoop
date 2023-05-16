import { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InfinitySpin } from 'react-loader-spinner'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import Geocode from 'react-geocode'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  registerFormSchema,
  RegisterFormSchemaType,
} from '../../schema/register'
import InvalidNotification from '../InvalidNotification'
import { registerUser } from '../../features/auth/authAction'

interface IProps {
  registeredEmailAddress: string
}

const RegisterForm: FC<IProps> = ({ registeredEmailAddress }) => {
  const [showInvalidAddressNotification, setShowInvalidAddressNotification] =
    useState<boolean>(false)
  const [address, setAddress] = useState<string>('')
  const [coordinates, setCoordinates] = useState<any>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false)

  const { loading, token } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<RegisterFormSchemaType>({
    resolver: yupResolver(registerFormSchema),
  })

  const { isLoaded } = useJsApiLoader({
    // @ts-ignore
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    region: 'au',
  })

  useEffect(() => {
    // redirect user to login page if registration was successful
    if (registrationSuccess) navigate(`/login?email=${registeredEmailAddress}`)

    if (token) navigate('/')
  }, [navigate, registrationSuccess])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <InfinitySpin width="200" color="#38b6ff" />
      </div>
    )
  }

  const getCoordinates = (e: any) => {
    const billingAddress = e.target.value
    setShowInvalidAddressNotification(false)

    // @ts-ignore
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
    Geocode.fromAddress(billingAddress)
      .then(res => {
        // All the processing is done here
        const results = res.results[0]
        const {
          formatted_address,
          geometry: { location },
        } = results

        setAddress(formatted_address)
        setCoordinates(location)
        clearErrors('billingAddress')
      })
      .catch(error => {
        // Show notification showing that your address is incorrect
        setShowInvalidAddressNotification(true)
        setError('billingAddress', {
          type: 'manual',
          message: 'You have enter an invalid address',
        })
        console.error(error)
      })
  }

  const onSubmit = async (values: RegisterFormSchemaType) => {
    // Preparing the payload to dispatch to the server
    const payload = {
      ...values,
      billingAddress: {
        address,
        coordinates,
      },
    }

    const payloadWithoutConfirmPassword = omit(payload, ['confirmPassword'])

    // @ts-ignore
    dispatch(registerUser(payloadWithoutConfirmPassword))
    setRegistrationSuccess(true)
    toast.success('Registration success. You can now log in.')
  }

  return (
    <>
      {showInvalidAddressNotification && (
        <InvalidNotification
          header={'Invalid billing address.'}
          content={
            'The address you have entered is invalid. Please enter a valid billing address to complete your registration.'
          }
        />
      )}

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex space-x-2.5">
          <div className="flex-1">
            <label className="block text-gray-700 font-bold">First name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              {...register('firstName')}
              className={
                errors?.firstName?.message
                  ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                  : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
            />
            <span className="text-red-500">{errors?.firstName?.message}</span>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-bold">Last name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              {...register('lastName')}
              className={
                errors?.lastName?.message
                  ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                  : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
            />
            <span className="text-red-500">{errors?.lastName?.message}</span>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-bold">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            {...register('email', {
              value: registeredEmailAddress,
            })}
            className={
              errors?.email?.message
                ? 'input input-bordered w-full px-4 py-3 rounded-lg mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                : 'input input-bordered w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
            }
            disabled={true}
          />
          <span className="text-red-500">{errors?.email?.message}</span>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-bold">Date of birth</label>
          <input
            type="date"
            id="dateOfBirth"
            placeholder="Enter birth date"
            {...register('dateOfBirth')}
            className={
              errors?.dateOfBirth?.message
                ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500 uppercase'
                : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none uppercase'
            }
          />
          <span className="text-red-500">{errors?.dateOfBirth?.message}</span>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-bold">
            Billing address
          </label>
          <Autocomplete>
            <input
              type="text"
              id="billingAddress"
              placeholder="Enter billing address"
              {...register('billingAddress')}
              className={
                errors?.billingAddress?.message
                  ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                  : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
              onBlur={e => getCoordinates(e)}
            />
          </Autocomplete>

          <span className="text-red-500">
            {errors?.billingAddress?.message}
          </span>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-bold">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            {...register('password')}
            className={
              errors?.password?.message
                ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
            }
          />
          <span className="text-red-500">{errors?.password?.message}</span>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-bold">
            Confirm password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Enter confirm password"
            {...register('confirmPassword')}
            className={
              errors?.confirmPassword?.message
                ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
            }
          />
          <span className="text-red-500">
            {errors?.confirmPassword?.message}
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
            'Register'
          )}
        </button>
      </form>
    </>
  )
}

export default RegisterForm
