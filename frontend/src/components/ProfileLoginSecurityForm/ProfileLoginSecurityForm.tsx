import { FC, useState } from 'react'
import ChangePasswordForm from '../ChangePasswordForm'

const ProfileLoginSecurityForm: FC = () => {
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false)

  const emailLocalStorage = localStorage.getItem('email')

  return (
    <>
      {!showChangePassword ? (
        <>
          <div className="flex my-1">
            <div className="flex items-center">
              <label className="block text-gray-700 font-bold w-[300px]">
                Email address
              </label>
            </div>

            <input
              type="email"
              id="email"
              value={emailLocalStorage || ''}
              className="input input-bordered w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              disabled={true}
            />
          </div>

          <div className="flex my-5">
            <div className="flex items-center">
              <label className="block text-gray-700 font-bold w-[300px]">
                Password
              </label>
            </div>

            <p
              className="cursor-pointer text-[#38b6ff] hover:underline"
              onClick={() => setShowChangePassword(true)}
            >
              Change password
            </p>
          </div>

          {/*Save button here*/}
          <hr className="divide-dashed my-[45px]" />

          <div className="flex justify-end mt-[-10px]">
            <button className="w-[150px] btn btn-primary btn-block capitalize">
              Logout
            </button>
          </div>
        </>
      ) : (
        <ChangePasswordForm setShowChangePassword={setShowChangePassword} />
      )}
    </>
  )
}

export default ProfileLoginSecurityForm
