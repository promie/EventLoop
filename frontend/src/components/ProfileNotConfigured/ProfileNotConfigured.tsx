import { FC } from 'react'
import { BiMessageAltEdit } from 'react-icons/bi'

const ProfileNotConfigured: FC = () => {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="text-center">
        <div className="flex justify-center">
          <BiMessageAltEdit size={60} />
        </div>
        <h1 className="text-[18px] mt-[20px]">
          User is still updating profile. Please check back again later.
        </h1>
      </div>
    </div>
  )
}

export default ProfileNotConfigured
