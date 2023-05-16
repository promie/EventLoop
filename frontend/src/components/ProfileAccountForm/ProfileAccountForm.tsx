import { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { InfinitySpin } from 'react-loader-spinner'
import AvatarImageDropzone from '../AvatarImageDropzone'
import { updateProfileAccount } from '../../features/user/userAction'
import { uploadImageS3 } from '../../features/events/eventsAction'

const ProfileAccountForm: FC = () => {
  // @ts-ignore
  const { userInfo } = useSelector(state => state.user)
  const userIdFromStorage = localStorage.getItem('userId')

  const [data, setData] = useState<any>({
    gender: userInfo?.gender,
  })
  const [loading, setLoading] = useState<boolean>(false)

  const [photoURL, setPhotoURL] = useState(userInfo?.photo_url || '')

  const dispatch = useDispatch()

  const handleOnChange = (e: any) => {
    const { name, value } = e.target

    setData({ ...data, [name]: value })
  }

  const onSave = async () => {
    const payload = {
      gender: data.gender,
      photoFile: photoURL,
    }

    setLoading(true)

    // Condition checking there's already a user profile uploaded
    if (typeof payload.photoFile === 'string') {
      const resp = await dispatch(
        // @ts-ignore
        updateProfileAccount({
          userId: userIdFromStorage,
          gender: data.gender,
          photoURL: payload.photoFile,
        }),
      )

      if (resp.type === 'user/updateProfileAccount/fulfilled') {
        toast.success('User details successfully updated')
        setLoading(false)
      }
    } else {
      // Otherwise, send the file object to S3 first, get the URL and then make the update
      const response = await dispatch(
        // @ts-ignore
        uploadImageS3({ file: payload.photoFile }),
      )

      if (response.type === 'event/upload/s3/fulfilled') {
        const resp = await dispatch(
          // @ts-ignore
          updateProfileAccount({
            userId: userIdFromStorage,
            gender: data.gender,
            photoURL: response.payload,
          }),
        )

        if (resp.type === 'user/updateProfileAccount/fulfilled') {
          toast.success('User details successfully updated')
          setLoading(false)
        }
      }

      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            First name
          </label>
        </div>

        <input
          type="text"
          id="firstName"
          name="firstName"
          value={userInfo?.first_name}
          className="input input-bordered w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          disabled={true}
        />
      </div>
      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Last name
          </label>
        </div>

        <input
          type="text"
          id="lastName"
          name="lastName"
          value={userInfo?.last_name}
          className="input input-bordered w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          disabled={true}
        />
      </div>
      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Date of birth
          </label>
        </div>

        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={userInfo?.birthday}
          className="input input-bordered w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          disabled={true}
        />
      </div>
      <div className="flex my-3">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Gender
          </label>
        </div>

        <div className="flex">
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Male"
                className="radio checked:bg-blue-500"
                onChange={handleOnChange}
                defaultChecked={data?.gender === 'Male'}
              />
              <span className="label-text ml-[5px]">Male</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleOnChange}
                className="radio checked:bg-blue-500"
                defaultChecked={data?.gender === 'Female'}
              />
              <span className="label-text ml-[5px]">Female</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Non-binary"
                onChange={handleOnChange}
                className="radio checked:bg-blue-500"
                defaultChecked={data?.gender === 'Non-binary'}
              />
              <span className="label-text ml-[5px]">Non-binary</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex my-1 mt-[10px]">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Photo
          </label>
        </div>

        <div className="avatar">
          <div className="w-[120px] rounded-full">
            <AvatarImageDropzone value={photoURL} setImage={setPhotoURL} />
          </div>
        </div>
      </div>
      {/*Save button here*/}
      <hr className="divide-dashed my-[45px]" />

      <div className="flex justify-end mt-[-10px]">
        <button
          className="w-[150px] btn btn-primary btn-block capitalize ml-[10px]"
          onClick={() => onSave()}
          type="submit"
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

export default ProfileAccountForm
