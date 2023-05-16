import { FC } from 'react'
import { BsCalendar4Week } from 'react-icons/bs'

const NoEventsCreated: FC = () => {
  return (
    <div className="flex items-center justify-center flex-col mt-20">
      <BsCalendar4Week color={'#f6d860'} size={60} />
      <p className="text-[24px] font-bold">No events to show</p>
    </div>
  )
}

export default NoEventsCreated
