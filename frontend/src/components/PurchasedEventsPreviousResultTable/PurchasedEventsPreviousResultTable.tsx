import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  formatDateTime,
  getMonthFromDateTime,
  getDayOfYearFromDateTime,
} from '../../helpers'
import { getCustomerPreviousBookingsByUserId } from '../../features/user/userAction'
import NoBookingsCreated from '../NoBookingsCreated'
import EventStatusBadge from '../../components/EventStatusBadge'
import BookingReceiptButton from '../BookingReceiptButton'

const PurchasedEventsPreviousResultTable: FC = () => {
  const dispatch = useDispatch()

  const { customerPreviousBookings, error } = useSelector(
    (store: any) => store.user,
  )
  const userIdFromStorage = localStorage.getItem('userId')

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getCustomerPreviousBookingsByUserId({ userId: userIdFromStorage }),
    )
  }, [])

  return (
    <div>
      {!error ? (
        <>
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-[800px]">Events</th>
                <th>Status</th>
                <th> </th>
              </tr>
            </thead>

            <tbody>
              {customerPreviousBookings?.items?.map(
                (event: any, idx: number) => (
                  <tr key={idx}>
                    <td className="flex">
                      <div className="flex items-center flex-col justify-center">
                        <p className="font-bold text-orange-600">
                          {getMonthFromDateTime(event.start_datetime)}
                        </p>
                        <p className="font-bold">
                          {getDayOfYearFromDateTime(event.start_datetime)}
                        </p>
                      </div>
                      <div className="mx-[15px]">
                        <img
                          src={event.photo_url}
                          alt="event"
                          className="w-[80px] h-[80px] object-cover rounded-md"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link
                          to={`/event/${event.event_id}`}
                          className="text-left font-bold cursor-pointer hover:underline"
                        >
                          {event.title}
                        </Link>
                        <p>{formatDateTime(event.start_datetime)}</p>
                      </div>
                    </td>
                    <td>
                      <EventStatusBadge status={event.status} />
                    </td>
                    <td>
                      <BookingReceiptButton
                        bookingId={event.id}
                        startDateTime={event.start_datetime}
                      />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </>
      ) : (
        <NoBookingsCreated />
      )}
    </div>
  )
}

export default PurchasedEventsPreviousResultTable
