import { FC } from 'react'
import { Link } from 'react-router-dom'
import { FaUserAlt } from 'react-icons/fa'
import { formatDateTime } from '../../helpers'
import EventStatusBadge from '../EventStatusBadge'

interface IProps {
  id: number
  title: string
  status: string
  startDate: string
  photoURL: string
  organiser: string
}

const Event: FC<IProps> = ({
  id,
  title,
  status,
  startDate,
  photoURL,
  organiser,
}) => {
  return (
    <div className="inline-block mr-1 cursor-pointer px-[5px] pb-[50px]">
      <Link to={`/event/${id}`}>
        <div className="card min-w-[320px] h-[400px] max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <figure>
            <img
              src={photoURL}
              alt="event display"
              className="min-h-[200px] max-h-[200px] w-full object-cover relative"
            />
            <div className="absolute right-0 top-0">
              <EventStatusBadge status={status} rounded={false} />
            </div>
          </figure>
          <div className="p-[15px] flex flex-col justify-evenly h-full">
            <div className="flex-1">
              <h2 className="card-title font-bold text-[18px]">{title}</h2>
              <p className="text-gray-500">{formatDateTime(startDate)}</p>
            </div>

            <div className="mt-8 flex items-center">
              <FaUserAlt /> <span className=" ml-[5px]">{organiser}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Event
