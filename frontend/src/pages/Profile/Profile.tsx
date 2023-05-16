import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Tabs from '../../components/Tabs'
import defaultProfilePic from '../../assets/default-profile.png'
import { getUserInfoByUserId } from '../../features/user/userAction'
import { profileCompletionPercentage } from '../../helpers'
import {
  setUserInfoFromStorage,
  clearUserInfoFromStorage,
} from '../../features/user/userSlice'
import { logout } from '../../features/auth/authSlice'

const Profile: FC = () => {
  const dispatch = useDispatch()

  // Retrieving the user information from the user store within the state management
  // @ts-ignore
  const { userInfo } = useSelector(state => state.user)

  const [profilePicture, setProfilePicture] = useState<any>(defaultProfilePic)

  // Retrieving the users the logged in users email address from local storage
  const emailFromStorage = localStorage.getItem('email')

  useEffect(() => {
    const getUserInfo = async () => {
      const userIdFromStorage = localStorage.getItem('userId')

      const userRes = await dispatch(
        // @ts-ignore
        getUserInfoByUserId({ userId: userIdFromStorage }),
      )

      // Ensure that the token is not expired, if token is expired,
      // Systematically log out, otherwise save information to location storage
      if (userRes?.type === 'user/getUserInfoByUserId/rejected') {
        // Log out user
        dispatch(logout())
        // Clear userInfo from storage
        dispatch(clearUserInfoFromStorage())
      } else {
        setProfilePicture(userInfo?.photo_url || defaultProfilePic)

        // As a fallback look into the localStorage and see if there's information there
        const userInfoFromStorageRaw = localStorage.getItem('userInfo')
        // @ts-ignore
        dispatch(setUserInfoFromStorage(JSON.parse(userInfoFromStorageRaw)))
      }
    }

    getUserInfo()
  }, [userInfo?.photo_url])

  // Keeping track of the profile completion status to control the reminder banner on the main page
  const completionPercentage = profileCompletionPercentage(userInfo) || '0'

  return (
    <div className="px-[250px] py-[80px] h-[1120px]">
      {/*profile section*/}
      <div className="flex">
        <div className="px-[50px] w-full">
          {/*Top section of profile*/}
          <div className="flex">
            <div className="avatar">
              <div className="w-[200px] rounded-full">
                <img src={profilePicture} alt="avatar preview" />
              </div>
            </div>

            {/*Users name and description*/}
            <div className="flex-1 flex flex-col justify-center px-[50px]">
              <div className="font-bold text-[50px]">
                {userInfo?.first_name} {userInfo?.last_name}
              </div>
              <div className="text-gray-500">{emailFromStorage}</div>
              {/*Profile progression status*/}
              <div className="relative pt-1 w-[250px] mt-[30px]">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#000] bg-neutral">
                      Profile completion
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-[#000]">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${completionPercentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#38b6ff]"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <hr className="divide-dashed my-[45px]" />

          <div className="mt-[-20px] px-[150px]">
            <Tabs />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
