import { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  formatDateTime,
  getMonthFromDateTime,
  getDayOfYearFromDateTime,
} from '../../helpers'
import EditEventButton from '../EditEventButton'
import CancelEventButton from '../CancelEventButton'
import EventSoldDetails from '../EventSoldDetails'
import NoEventsCreated from '../NoEventsCreated'
import { getHostUpcomingCreatedEventsByUserId } from '../../features/user/userAction'
import EventStatusBadge from '../../components/EventStatusBadge'

const EventsUpcomingResultsTable: FC = () => {
  const dispatch = useDispatch()

  const { hostUpcomingEvents, error } = useSelector((store: any) => store.user)
  const {
    hostEventUpdateSuccess,
    hostEventCancelSuccess,
    createNewEventSuccess,
  } = useSelector((store: any) => store.events)
  const userIdFromStorage = localStorage.getItem('userId')

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getHostUpcomingCreatedEventsByUserId({ userId: userIdFromStorage }),
    )
  }, [createNewEventSuccess, hostEventUpdateSuccess, hostEventCancelSuccess])

  return (
    <div>
      {!error ? (
        <>
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-[800px]">Events</th>
                <th>Sold</th>
                <th>Status</th>
                <th> </th>
              </tr>
            </thead>

            <tbody>
              {hostUpcomingEvents?.items?.map((event: any, idx: number) => (
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
                        to={`/event/${event.id}`}
                        className="text-left font-bold cursor-pointer hover:underline"
                      >
                        {event.title}
                      </Link>
                      <p>{formatDateTime(event.start_datetime)}</p>
                    </div>
                  </td>
                  <td className="cursor-pointer hover:underline">
                    <EventSoldDetails
                      soldTickets={event.sold_tickets}
                      totalTickets={event.total_tickets}
                      eventId={event.id}
                      eventTitle={event.title}
                      eventStartDateTime={event.start_datetime}
                    />
                  </td>
                  <td>
                    <EventStatusBadge status={event.status} />
                  </td>
                  <td>
                    <div className="flex justify-between">
                      <div>
                        <EditEventButton eventId={event.id} />
                      </div>

                      <div>
                        <CancelEventButton
                          eventId={event.id}
                          eventTitle={event.title}
                          eventStartDateTime={event.start_datetime}
                          soldTickets={event.sold_tickets}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <NoEventsCreated />
      )}
    </div>
  )
}

export default EventsUpcomingResultsTable
