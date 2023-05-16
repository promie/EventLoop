import { FC } from 'react'
import { FcInfo } from 'react-icons/fc'

const EditEventNotification: FC = () => {
  return (
    <div className="flex p-[20px] items-center bg-orange-50 rounded-sm mt-[15px] mb-[10px]">
      <div>
        <FcInfo size={28} />
      </div>
      <p className="flex-1 ml-[15px]">
        Only the below fields are editable for an event.
      </p>
    </div>
  )
}

export default EditEventNotification
