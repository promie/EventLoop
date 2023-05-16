import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useLocation } from 'react-router-dom'
import EventsSearch from '../../components/EventsSearch'
import EventsResults from '../../components/EventsResults'
import EventsMap from '../../components/EventsMap'
import { getAllEvents } from '../../features/events/eventsAction'
import { InfinitySpin } from 'react-loader-spinner'
import Chatbot from '../../components/Chatbot'

/*
  Events search page
 */

const Events: FC = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const { loading, events } = useSelector((store: any) => store.events)

  // On page re-render look for the change in query params to perform a refetch of the API based on the filter
  useEffect(() => {
    // @ts-ignore
    dispatch(getAllEvents({ query: searchParams.toString() }))
  }, [searchParams.toString()])

  const { search } = location

  return (
    <div>
      {/*Search component with different filters*/}
      <EventsSearch />

      {loading ? (
        <div className="h-[950px] flex items-center justify-center">
          <InfinitySpin color="#38b6ff" />
        </div>
      ) : (
        <>
          <div className="flex h-[950px]">
            <div className="flex-1 overflow-scroll">
              {search && events?.items?.length > 0 && (
                <div className="text-[24px] font-bold px-[70px] mb-[-50px] mt-[25px]">
                  Results ({events?.items?.length})
                </div>
              )}

              {/*Results based off the search filters*/}
              <EventsResults />
            </div>

            <div className="flex-2 w-[750px]">
              {/*Show's the marker of each of the different location from the search result*/}
              <EventsMap />
            </div>
          </div>
          <Chatbot />
        </>
      )}
    </div>
  )
}

export default Events
