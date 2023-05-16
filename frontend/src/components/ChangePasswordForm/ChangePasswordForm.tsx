import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { InfinitySpin } from 'react-loader-spinner'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  changePasswordFormSchema,
  ChangePasswordFormSchemaType,
} from '../../schema/changePassword'
import { changePassword } from '../../features/auth/authAction'
import InvalidNotification from '../InvalidNotification'

interface IProps {
  setShowChangePassword: any
}

const ChangePasswordForm: FC<IProps> = ({ setShowChangePassword }) => {
  const [showErrorNotifcation, setShowErrorNotification] =
    useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { loading } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormSchemaType>({
    resolver: yupResolver(changePasswordFormSchema),
  })

  const onSubmit = async (values: ChangePasswordFormSchemaType) => {
    const response = await dispatch(
      // @ts-ignore
      changePassword({
        email: localStorage.getItem('email'),
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    )

    if (response.type === 'auth/changePassword/rejected') {
      setShowErrorNotification(true)
      setErrorMessage(response.payload)
    } else {
      setShowErrorNotification(false)
      setErrorMessage('')
      setShowChangePassword(false)
      toast.success('You have successfully updated your password.')
    }
  }

  return (
    <>
      {showErrorNotifcation && (
        <div className="mb-[25px]">
          <InvalidNotification header={'Error'} content={errorMessage} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex my-1">
          <div className="flex items-center">
            <label className="block text-gray-700 font-bold w-[300px]">
              Current password
            </label>
          </div>

          <div className="w-full">
            <input
              type="password"
              id="currentPassword"
              {...register('currentPassword')}
              className={
                errors?.currentPassword?.message
                  ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                  : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
            />
            <span className="text-red-500">
              {errors?.currentPassword?.message}
            </span>
          </div>
        </div>

        <div className="flex my-1">
          <div className="flex items-center">
            <label className="block text-gray-700 font-bold w-[300px]">
              New password
            </label>
          </div>

          <div className="w-full">
            <input
              type="password"
              id="newPassword"
              {...register('newPassword')}
              className={
                errors?.newPassword?.message
                  ? 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border border-red-500 focus:border-red-500 focus:bg-white focus:outline-red-500'
                  : 'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
            />
            <span className="text-red-500">{errors?.newPassword?.message}</span>
          </div>
        </div>

        <div className="flex my-1">
          <div className="flex items-center">
            <label className="block text-gray-700 font-bold w-[300px]">
              Confirm new password
            </label>
          </div>

          <div className="w-full">
            <input
              type="password"
              id="confirmNewPassword"
              {...register('confirmNewPassword')}
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
        </div>

        {/*Save button here*/}
        <hr className="divide-dashed my-[45px]" />

        <div className="flex justify-end mt-[-10px]">
          <button
            className="w-[150px] btn btn-neutral btn-block capitalize"
            onClick={() => setShowChangePassword(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="w-[150px] btn btn-primary btn-block capitalize ml-[10px]"
            type="submit"
          >
            {loading ? (
              <div className="mt-[-22px]">
                <InfinitySpin color={'white'} />
              </div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </>
  )
}

export default ChangePasswordForm
