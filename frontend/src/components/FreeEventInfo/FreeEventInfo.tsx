import { FC } from 'react'
import FreeEvent from '../../assets/free.webp'

const FreeEventInfo: FC = () => {
  return (
    <>
      <div
        className="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 mx-[50px] mt-[10px]"
        role="alert"
      >
        <p className="font-bold">Free Entry</p>
        <p className="text-sm">
          Payment is not required for this event. Click confirm to finalise your
          order.
        </p>
      </div>
      <div className="flex items-center justify-center">
        <img src={FreeEvent} alt={'Free event'} className="w-[550px]" />
      </div>
    </>
  )
}

export default FreeEventInfo
