import { FC } from 'react'
import { BsBell } from 'react-icons/bs'

const NoNotifications: FC = () => {
  return (
    <div className="bg-grey-100 flex flex-col items-center justify-center p-[10px]">
      <BsBell size={35} />
      <h1 className="font-bold text-[16px] mt-[25px]">No notifications yet</h1>
      <p>When you get notifications, they'll show up here</p>
    </div>
  )
}

export default NoNotifications
