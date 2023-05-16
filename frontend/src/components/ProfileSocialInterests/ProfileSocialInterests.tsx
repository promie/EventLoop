import { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateProfileSocialAndInterests } from '../../features/user/userAction'
import Select from 'react-select'
import { interests } from '../../constants'
import ConnectionPermissionNotification from '../ConnectionPermisionNotification'
import { InfinitySpin } from 'react-loader-spinner'

const ProfileSocialInterests: FC = () => {
  // @ts-ignore
  const { userInfo } = useSelector(state => state.user)
  const userIdFromStorage = localStorage.getItem('userId')

  const [data, setData] = useState<any>({
    aboutMe: userInfo?.about_me,
    phoneNumber: userInfo?.phone,
    facebook: userInfo?.website_url,
    interests:
      userInfo?.interests?.split(', ').map((interest: any) => {
        return {
          label: interest,
          value: interest,
        }
      }) || '',
  })
  const [matchingOption, setMatchingOption] = useState<boolean>(
    userInfo?.matching_option || false,
  )
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const handleChangeChk = (chkValue: any) => {
    setMatchingOption(chkValue.target.checked)
  }

  const onSave = async () => {
    const response = await dispatch(
      // @ts-ignore
      updateProfileSocialAndInterests({
        userId: userIdFromStorage,
        aboutMe: data.aboutMe || '',
        phoneNumber: data.phoneNumber || '',
        facebook: data.facebook || '',
        matchingOption,
        interests:
          data.interests !== ''
            ? data.interests?.map((interest: any) => interest.value).join(', ')
            : '',
      }),
    )

    setLoading(true)

    if (response.type === 'user/updateProfileSocialAndInterests/fulfilled') {
      // @ts-ignore
      toast.success('User details successfully updated')
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <>
      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            About me
          </label>
        </div>

        <textarea
          id="aboutMe"
          name="aboutMe"
          value={data.aboutMe}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none h-[130px]"
        />
      </div>

      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Phone number
          </label>
        </div>

        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      </div>

      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Facebook
          </label>
        </div>

        <input
          type="text"
          id="facebook"
          name="facebook"
          value={data.facebook}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      </div>

      <ConnectionPermissionNotification />

      <div className="flex my-1 mt-[25px]">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Connection permission
          </label>
        </div>

        <input
          type="checkbox"
          id="matchingOption"
          name="matchingOption"
          checked={matchingOption}
          onChange={event => {
            handleChangeChk(event)
          }}
          className="checkbox checkbox-primary"
        />
      </div>

      <div className="flex my-1 mt-[25px]">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Interests
          </label>

          <div>
            <Select
              options={interests}
              isMulti
              name="interests"
              value={data.interests}
              className="w-[420px]"
              onChange={choice =>
                setData({
                  ...data,
                  interests: choice,
                })
              }
            />
          </div>
        </div>
      </div>

      {/*Save button here*/}
      <hr className="divide-dashed my-[45px]" />

      <div className="flex justify-end mt-[-10px]">
        <button
          className="w-[150px] btn btn-primary btn-block capitalize"
          onClick={() => onSave()}
        >
          {loading ? (
            <div className="mt-[-22px] ml-[10px]">
              <InfinitySpin color={'white'} width="200px" />
            </div>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </>
  )
}

export default ProfileSocialInterests
