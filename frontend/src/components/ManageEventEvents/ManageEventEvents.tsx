import { FC } from 'react'
import CreateEventButton from '../CreateEventButton'
import EventsUpcomingResultsTable from '../EventsUpcomingResultTable'
import EventsPreviousResultsTable from '../EventsPreviousResultsTable'
import EventTabs from '../EventTabs'

/*
  A component that contains the two sections of My Events to view Upcoming and Previous created events
 */

const ManageEventEvents: FC = () => {
  const tabsData = [
    {
      label: 'Upcoming',
      content: <EventsUpcomingResultsTable />,
    },
    {
      label: 'Previous',
      content: <EventsPreviousResultsTable />,
    },
  ]

  return (
    <div className="px-[120px] py-[40px]">
      <div className="flex mb-[20px]">
        <div className="flex-1">
          <h1 className="text-[45px] font-bold">My Events</h1>
        </div>

        <div className="flex items-center justify-center">
          <CreateEventButton />
        </div>
      </div>

      {/*EventTabs contains the logic whether which component to render on the page*/}
      <EventTabs tabsData={tabsData} />
    </div>
  )
}

export default ManageEventEvents
