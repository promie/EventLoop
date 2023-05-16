import { FC } from 'react'
import { Link } from 'react-router-dom'
import { MdClose } from 'react-icons/md'

const ProfileNotificationBanner: FC = () => {
  return (
    <div className="w-full h-[60px] bg-[#212936] p-[20px] text-[#FFF] flex">
      <p className="flex-1">
        Your profile is incomplete. Click here to go to the{' '}
        <Link to="/profile" className="text-[#4473CE] hover:underline">
          profiles page
        </Link>{' '}
        to have the rest of the information fill in.
      </p>
    </div>
  )
}

export default ProfileNotificationBanner
