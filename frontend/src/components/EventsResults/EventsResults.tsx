import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdArrowForwardIos, MdArrowBackIosNew } from 'react-icons/md'

import NoSearchResults from '../NoSearchResults'
import EventResultCard from '../EventResultCard'

/*
 Event search results which renders the result card
 */

const EventsResults: FC = () => {
  // Retrieving the events from the redux store for events
  const { events } = useSelector((store: any) => store.events)

  // Next and previous links in order for pagination and keeping tabs on the current page
  const prevLink =
    events?.links?.prev &&
    events?.links?.prev?.split('events')[1].slice(0, -2).replace('+', '%2B')
  const nextLink =
    events?.links?.next &&
    events?.links?.next?.split('events')[1].slice(0, -2).replace('+', '%2B')

  return (
    <div className="p-[30px] flex flex-col">
      <div className="flex-1 h-[250px]">
        {/*Perform if there are any events from the search result*/}
        {events?.items?.length > 0 ? (
          events?.items?.map((event: any) => (
            <EventResultCard key={event.id} event={event} />
          ))
        ) : (
          <div className="flex items-center justify-center mt-[250px]">
            {/*In a scenario where there are no results, display the NoSearch results to the user*/}
            <NoSearchResults />
          </div>
        )}
      </div>

      {/*Next and previous button to next page*/}
      {events?.total_pages > 1 && (
        <div className="flex justify-center font-bold">
          {/*Conditionally displays the back button if there's a page to go back*/}
          {events?.has_prev && (
            <Link to={`/events${prevLink}`} className="flex items-center">
              <MdArrowBackIosNew className="cursor-pointer" />
            </Link>
          )}

          <div className="mx-[25px]">
            {events?.page} of {events?.total_pages}
          </div>

          {/*Conditionally displays the next button if there's the next page to go to*/}
          {events?.has_next && (
            <Link to={`/events${nextLink}`} className="flex items-center">
              <MdArrowForwardIos className="cursor-pointer" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default EventsResults
