import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../Logo'
import CreateEventButton from '../CreateEventButton'
import SearchEventNav from '../SearchEventNav'
import NotificationTabs from '../NotificationTabs'
import { logout, setTokenFromStorage } from '../../features/auth/authSlice'
import {
  clearUserInfoFromStorage,
  setUserInfoFromStorage,
} from '../../features/user/userSlice'
import {
  getUserInfoByUserId,
  getUserNotifications,
} from '../../features/user/userAction'
import { getInitialsFromName } from '../../helpers'

const Navbar: FC = () => {
  // @ts-ignore
  const { token } = useSelector(state => state.auth)
  const { createBookingSuccess } = useSelector((store: any) => store.bookings)
  const { userInfo, notifications, readNotificationSuccess } = useSelector(
    (state: any) => state.user,
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // @ts-ignore
  useEffect(() => {
    const getUserInfo = async () => {
      // Check if the token && email && userID still exist on the local storage. If Yes, set it on the global state
      const tokenFromStorage = localStorage.getItem('token')
      const emailFromStorage = localStorage.getItem('email')
      const userIdFromStorage = localStorage.getItem('userId')

      if (tokenFromStorage && emailFromStorage && userIdFromStorage) {
        dispatch(setTokenFromStorage(tokenFromStorage))
      }

      if (token) {
        const userRes = await dispatch(
          // @ts-ignore
          getUserInfoByUserId({ userId: userIdFromStorage }),
        )

        // Ensure that the token is not expired, if token is expired,
        // Systematically log out, otherwise save information to location storage
        if (userRes?.type === 'user/getUserInfoByUserId/rejected') {
          // Log out user
          dispatch(logout())
          // Clear userInfo from storage
          dispatch(clearUserInfoFromStorage())
        } else {
          // As a fallback look into the localStorage and see if there's information there
          const userInfoFromStorageRaw = localStorage.getItem('userInfo')

          // @ts-ignore
          dispatch(setUserInfoFromStorage(JSON.parse(userInfoFromStorageRaw)))
        }
      }
    }

    getUserInfo()
  }, [token, dispatch])

  useEffect(() => {
    const getNotifications = async () => {
      const userIdFromStorage = localStorage.getItem('userId')

      await dispatch(
        // @ts-ignore
        getUserNotifications({ userId: userIdFromStorage }),
      )
    }

    if (token) {
      getNotifications()
    }
  }, [readNotificationSuccess, createBookingSuccess])

  const handleClick = () => {
    const elem = document.activeElement
    if (elem) {
      // @ts-ignore
      elem?.blur()
    }
  }

  const { pathname } = location

  const newEventsNotifications =
    notifications?.events?.filter((event: any) => !event.is_read) || []
  const newConnectionsNotifications =
    notifications?.connections?.filter(
      (connection: any) => !connection.is_read,
    ) || []

  const newNotifications =
    newEventsNotifications?.length > 0 ||
    newConnectionsNotifications?.length > 0

  return (
    <div className="navbar bg-base-100 border-b-[0.5px] border-[#38b6ff]">
      <div className="flex-1">
        <Logo />

        {!pathname.includes('/events') &&
          !pathname.includes('/manage-events') && <SearchEventNav />}
      </div>

      {token && (
        <>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <>
                {!pathname.includes('/manage-events') && (
                  <li>
                    <CreateEventButton />
                  </li>
                )}

                <li>
                  <Link to={'/bookings'}>Bookings</Link>
                </li>
              </>
            </ul>
          </div>

          <div className="flex-none">
            {/*Notification bell to only show on the dashboard and profiles page*/}
            {!pathname.includes('/manage-events') &&
              !pathname.includes('/connections') && (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>

                      {newNotifications && (
                        <span className="badge badge-sm badge-accent indicator-item"></span>
                      )}
                    </div>
                  </label>
                  <div
                    tabIndex={0}
                    className="mt-3 card card-compact dropdown-content w-[500px]  bg-base-100 shadow"
                  >
                    <div className="card-body" style={{ maxHeight: '520px' }}>
                      <span className="font-bold text-lg">Notifications</span>
                      <NotificationTabs />
                    </div>
                  </div>
                </div>
              )}

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-[#EBD148] flex">
                  <span className="flex items-center justify-center text-[23px] mt-[12px]">
                    {userInfo && (
                      <>
                        {getInitialsFromName(
                          userInfo.first_name,
                          userInfo.last_name,
                        )}
                      </>
                    )}
                  </span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li onClick={handleClick}>
                  <Link to={'/'} className="justify-between">
                    Home
                  </Link>
                </li>
                <li onClick={handleClick}>
                  <Link to={'/profile'} className="justify-between">
                    My Profile
                  </Link>
                </li>
                <li onClick={handleClick}>
                  <Link to={'/manage-events'}>Manage Event</Link>
                </li>
                <li onClick={handleClick}>
                  <Link to={'/connections'}>Connections</Link>
                </li>
                <li
                  onClick={() => {
                    handleClick()
                    dispatch(logout())
                    dispatch(clearUserInfoFromStorage())
                    navigate('/')
                  }}
                >
                  <a>Log Out</a>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}

      {!token && (
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0">
            <li className="cursor-pointer">
              <Link to={'/login'}>Login</Link>
            </li>
            <li className="cursor-pointer">
              <Link to={'/register'}>Register</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
