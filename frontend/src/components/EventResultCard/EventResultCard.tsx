import { FC } from 'react'
import { Link } from 'react-router-dom'
import EventStatusBadge from '../EventStatusBadge'
import { getTicketPriceRanges, formatDateTime } from '../../helpers'

interface IProps {
  event: any
}

const EventResultCard: FC<IProps> = ({ event }) => {
  return (
    <Link
      to={`/event/${event?.id}`}
      className="flex cursor-pointer px-[40px] py-[20px] my-[30px] pt-[20px] hover:shadow-xl items-center"
    >
      <div>
        <img
          src={event?.photo_url}
          className="w-[250px] h-[150px] object-cover"
          alt={'event preview'}
        />
      </div>
      <div className="px-[15px] flex-1">
        <h1 className="text-[18px] font-bold">{event?.title}</h1>
        <p className="font-bold text-[#EBD148]">
          {formatDateTime(event?.start_datetime)}
        </p>

        <div className="mt-[20px]">
          <p>{event?.location_add}</p>
          <p>
            Prices:{' '}
            {getTicketPriceRanges(event?.tickets) === '$0.00'
              ? 'FREE'
              : getTicketPriceRanges(event?.tickets)}
          </p>
          <p>By: {event?.owner_name}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <EventStatusBadge status={event.status} />
      </div>
    </Link>
  )
}

export default EventResultCard
