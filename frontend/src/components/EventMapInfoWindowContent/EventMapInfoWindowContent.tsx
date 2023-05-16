import { FC } from 'react'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../../helpers'

interface IProps {
  eventInfo: any
}

const EventMapInfoWindowContent: FC<IProps> = ({ eventInfo }) => {
  return (
    <div className="w-[350px] h-[100px]">
      <div className="flex">
        <img
          src={eventInfo?.photo_url}
          alt={'event preview'}
          className="w-[130px] h-[100px] object-cover"
        />
        <div className="ml-[10px]">
          <Link
            to={`/event/${eventInfo?.id}`}
            className="font-bold text-[16px] cursor-pointer hover:underline hover:text-blue-500"
          >
            {eventInfo?.title}
          </Link>

          <div className="mt-[5px]">
            <p>{formatDateTime(eventInfo?.start_datetime)}</p>
            <p className="mt-[5px]">{eventInfo?.location_add}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventMapInfoWindowContent
