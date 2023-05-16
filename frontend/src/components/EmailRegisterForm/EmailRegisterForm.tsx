import { FC, Dispatch, SetStateAction } from 'react'
import { InfinitySpin } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  emailRegisterFormSchema,
  EmailRegisterFormSchemaType,
} from '../../schema/register'
import { verifyRegisteredUser } from '../../features/auth/authAction'

interface IProps {
  setAccountExist: Dispatch<SetStateAction<boolean>>
  setRegisteredEmailAddress: Dispatch<SetStateAction<string>>
  setDisplaySignUpForm: Dispatch<SetStateAction<boolean>>
}

const EmailRegisterForm: FC<IProps> = ({
  setAccountExist,
  setRegisteredEmailAddress,
  setDisplaySignUpForm,
}) => {
  const { loading } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailRegisterFormSchemaType>({
    resolver: yupResolver(emailRegisterFormSchema),
  })

  const onSubmit = async (values: EmailRegisterFormSchemaType) => {
    // @ts-ignore
    const res = await dispatch(verifyRegisteredUser(values))

    if (res?.error) {
      setAccountExist(true)
    } else {
      setAccountExist(false)
      setRegisteredEmailAddress(values?.email)
      setDisplaySignUpForm(true)
    }
  }

  return (
    <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-gray-700 font-bold">Email address</label>
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
          'Continue'
        )}
      </button>
    </form>
  )
}

export default EmailRegisterForm
