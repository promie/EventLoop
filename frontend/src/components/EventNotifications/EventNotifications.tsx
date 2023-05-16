import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { MdEditCalendar, MdOutlineFreeCancellation } from 'react-icons/md'
import { GiFinishLine } from 'react-icons/gi'
import { formatDateTime } from '../../helpers'
import { readNotificationMessage } from '../../features/user/userAction'
import NoNotifications from '../NoNotifications'
import ThatsAllNotifications from '../ThatsAllNotifications'

const EventNotifications: FC = () => {
  const { notifications } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const eventNotifications = notifications?.events || []

  const handleClick = () => {
    const elem = document.activeElement
    if (elem) {
      // @ts-ignore
      elem?.blur()
    }
  }

  const readMessage = async (notificationId: any, type: any, eventId: any) => {
    handleClick()
    await dispatch(
      // @ts-ignore
      readNotificationMessage({ notificationId, type }),
    )
    navigate(`/event/${eventId}`)
  }

  const notificationStyle = (isRead: any) => {
    return cx('border-b-1 p-[10px] cursor-pointer flex', [
      !isRead && 'bg-blue-50',
    ])
  }

  const eventNotificationType = (description: string) => {
    let notificationType = ''

    if (description.includes('updated to Finished')) {
      notificationType = 'FINISHED'
    } else if (description.includes('updated')) {
      notificationType = 'UPDATED'
    } else if (description.includes('Customer')) {
      notificationType = 'CUSTOMER_CANCELLED'
    } else {
      notificationType = 'CANCELLED'
    }

    return notificationType
  }

  console.log('notifications', notifications)

  return (
    <div className="overflow-scroll" style={{ maxHeight: '400px' }}>
      {eventNotifications.length > 0 ? (
        eventNotifications?.map((event: any, idx: number) => (
          <div
            key={idx}
            className={notificationStyle(event.is_read)}
            onClick={() => readMessage(event.id, 'events', event.event_id)}
          >
            <div className="pr-[35px]">
              {eventNotificationType(event.description) === 'CANCELLED' && (
                <>
                  <p>
                    The event <span className="font-bold">{event.title}</span>{' '}
                    that you are attending is cancelled.
                  </p>
                  <p className="text-gray-400">
                    {formatDateTime(event.date_created)}
                  </p>
                </>
              )}

              {eventNotificationType(event.description) ===
                'CUSTOMER_CANCELLED' && (
                <>
                  <p>
                    {event.description}{' '}
                    <span className="font-bold">{event.title}</span>.
                  </p>
                  <p className="text-gray-400">
                    {formatDateTime(event.date_created)}
                  </p>
                </>
              )}

              {eventNotificationType(event.description) === 'FINISHED' && (
                <>
                  <p>
                    The event <span className="font-bold">{event.title}</span>{' '}
                    that you have created is finished.
                  </p>
                  <p className="text-gray-400">
                    {formatDateTime(event.date_created)}
                  </p>
                </>
              )}

              {eventNotificationType(event.description) === 'UPDATED' && (
                <>
                  <p>
                    The host has made an update to{' '}
                    <span className="font-bold">{event.title}</span> that you
                    attending.{' '}
                  </p>
                  <p className="text-gray-400">
                    {formatDateTime(event.date_created)}
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center mr-[20px]">
              {eventNotificationType(event.description) === 'CANCELLED' && (
                <MdOutlineFreeCancellation size={35} />
              )}

              {eventNotificationType(event.description) === 'FINISHED' && (
                <GiFinishLine size={35} />
              )}

              {eventNotificationType(event.description) === 'UPDATED' && (
                <MdEditCalendar size={35} />
              )}
            </div>
          </div>
        ))
      ) : (
        <NoNotifications />
      )}

      {eventNotifications.length > 0 && <ThatsAllNotifications />}
    </div>
  )
}

export default EventNotifications
