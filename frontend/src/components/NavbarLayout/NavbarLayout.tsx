import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import ProfileNotificationBanner from '../ProfileNotificationBanner'
import { profileCompletionPercentage } from '../../helpers'

const NavbarLayout: FC = () => {
  const { pageLoad, token } = useSelector((state: any) => state.auth)
  const { userInfo } = useSelector((state: any) => state.user)

  const profileCompletion = profileCompletionPercentage(userInfo)

  const [displayNotification, setDisplayNotification] = useState<boolean>(false)

  // On the page re-render (every time the user updates his/her profile) perform a progress check in order to display the banner
  useEffect(() => {
    setDisplayNotification(profileCompletion !== '100.00')
  }, [profileCompletion])

  const location = useLocation()
  const { pathname } = location

  return (
    <>
      <Navbar />
      {/* Conditionally show the profile notification banner based on whether the user has completed his or her  profile */}
      {/* e g. profile status is at 100% complete otherwise the banner will display on homepage to remind the user to update his or her profile*/}
      {pathname === '/' && displayNotification && token && !pageLoad && (
        <ProfileNotificationBanner />
      )}

      {/*This render the components under the common navbar*/}
      <div>
        <Outlet />
      </div>

      {/*During the page load, only show the infitinity loader and hide the footer*/}
      {!pageLoad && <Footer />}
    </>
  )
}

export default NavbarLayout
