import { FC } from 'react'
import EventTabs from '../EventTabs'
import PurchasedEventsUpcomingResultTable from '../PurchasedEventsUpcomingResultTable'
import PurchasedEventsPreviousResultTable from '../PurchasedEventsPreviousResultTable'
import PurchasedEventsReviews from '../PurchasedEventsReviews'

/*
  My Bookings that shows the tabs to navigate on the page
  for the Upcoming, Previous and Reviews section
 */

const PurchasedEvents: FC = () => {
  const tabsData = [
    {
      label: 'Upcoming',
      content: <PurchasedEventsUpcomingResultTable />,
    },
    {
      label: 'Previous',
      content: <PurchasedEventsPreviousResultTable />,
    },
    {
      label: 'Reviews',
      content: <PurchasedEventsReviews />,
    },
  ]

  return (
    <div className="px-[120px] py-[40px]">
      <div className="flex mb-[20px]">
        <div className="flex-1">
          <h1 className="text-[45px] font-bold">My Bookings</h1>
        </div>
      </div>

      {/*The EvenTabs accepts the tabsData information that contains the logic on which container to render*/}
      <EventTabs tabsData={tabsData} />
    </div>
  )
}

export default PurchasedEvents
