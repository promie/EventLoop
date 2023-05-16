import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InfinitySpin } from 'react-loader-spinner'
import Hero from '../../components/Hero'
import CategoriesPanel from '../../components/CategoriesPanel'
import RecommendedEvents from '../../components/RecommendedEvents'
import UpcomingEvents from '../../components/UpcomingEvents'
import Chatbot from '../../components/Chatbot'
import {
  triggerLoadingState,
  stopLoadingState,
} from '../../features/auth/authSlice'
import {
  getUpcomingEvents,
  getRecommendedEventsByUserId,
} from '../../features/events/eventsAction'

const Home: FC = () => {
  const { pageLoad, token } = useSelector((state: any) => state.auth)
  const userIdFromStorage = localStorage.getItem('userId')
  const tokenFromStorage = localStorage.getItem('token')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(triggerLoadingState())
    // dispatch action to get the upcomingEvents
    // @ts-ignore
    dispatch(getUpcomingEvents())

    // dispatch action to get recommended events only if the user is logged in
    if (token || tokenFromStorage) {
      dispatch(
        // @ts-ignore
        getRecommendedEventsByUserId({ userId: userIdFromStorage }),
      )
    }

    // Abort the loading spinner after 3 seconds
    setTimeout(() => {
      dispatch(stopLoadingState())
    }, 3000)
  }, [])

  return (
    <div className="pl-[100px] pr-[100px]">
      {pageLoad ? (
        <div className="flex items-center justify-center h-[850px]">
          {/*The infinity spinner on the main page*/}
          <InfinitySpin width="200" color="#38b6ff" />
        </div>
      ) : (
        <>
          {/*All elements visible on the home page*/}
          <Hero />
          <CategoriesPanel />
          {/*only show the recommended events for logged in user*/}
          {(token || tokenFromStorage) && <RecommendedEvents />}
          <UpcomingEvents />
          <Chatbot />
        </>
      )}
    </div>
  )
}

export default Home
