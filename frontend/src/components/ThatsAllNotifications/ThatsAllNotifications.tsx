import { FC } from 'react'
import { BsFlag } from 'react-icons/bs'

const ThatsAllNotifications: FC = () => {
  return (
    <div className="bg-grey-100 flex flex-col items-center justify-center p-[10px] mt-[20px]">
      <BsFlag size={35} />
      <div className="mt-[5px]">
        <p>That's all your notifications from the last 7 days.</p>
      </div>
    </div>
  )
}

export default ThatsAllNotifications
