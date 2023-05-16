import { FC } from 'react'
import { BsCalendar4Week } from 'react-icons/bs'

const NoBookingsCreated: FC = () => {
  return (
    <div className="flex items-center justify-center flex-col mt-20">
      <BsCalendar4Week color={'#f6d860'} size={60} />
      <p className="text-[24px] font-bold">No bookings to show</p>
    </div>
  )
}

export default NoBookingsCreated
