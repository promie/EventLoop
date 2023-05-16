import { FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NoNotifications from '../NoNotifications'
import { readNotificationMessage } from '../../features/user/userAction'
import cx from 'classnames'
import { formatDateTime } from '../../helpers'
import ThatsAllNotifications from '../ThatsAllNotifications'
import { GrConnect } from 'react-icons/gr'

const ConnectionNotifications: FC = () => {
  const { notifications } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const connectionsNotifications = notifications?.connections || []

  const handleClick = () => {
    const elem = document.activeElement
    if (elem) {
      // @ts-ignore
      elem?.blur()
    }
  }

  console.log('connectionsNotifications', connectionsNotifications)

  const readMessage = async (
    notificationId: any,
    type: any,
    matchedUserId: any,
  ) => {
    handleClick()
    await dispatch(
      // @ts-ignore
      readNotificationMessage({ notificationId, type }),
    )
    navigate(`/profile/${matchedUserId}`)
  }

  const notificationStyle = (isRead: any) => {
    return cx('border-b-1 p-[10px] cursor-pointer flex', [
      !isRead && 'bg-blue-50',
    ])
  }

  return (
    <div className="overflow-scroll" style={{ maxHeight: '400px' }}>
      {connectionsNotifications.length > 0 ? (
        connectionsNotifications?.map((connection: any, idx: number) => (
          <div
            key={idx}
            className={notificationStyle(connection.is_read)}
            onClick={() =>
              readMessage(
                connection.id,
                'connections',
                connection.matched_user_id,
              )
            }
          >
            <div className="pr-[35px]">
              <p>
                You may want to connect with{' '}
                <span className="font-bold">{connection.matched_user}</span>{' '}
                from the event{' '}
                <span className="font-bold">{connection.title}</span> you are
                attending.
              </p>
              <p className="text-gray-400">
                {formatDateTime(connection.date_created)}
              </p>
            </div>

            <div className="flex items-center mr-[20px]">
              <GrConnect size={35} />
            </div>
          </div>
        ))
      ) : (
        <NoNotifications />
      )}

      {connectionsNotifications.length > 0 && <ThatsAllNotifications />}
    </div>
  )
}

export default ConnectionNotifications
