import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import EventNotifications from '../EventNotifications'
import ConnectionNotifications from '../ConnectionNotifications'

const NotificationTabs: FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const { notifications } = useSelector((state: any) => state.user)

  const numEvents =
    notifications?.events?.filter((event: any) => !event.is_read).length || 0
  const numConnections =
    notifications?.connections?.filter((connection: any) => !connection.is_read)
      .length || 0

  const tabsData = [
    {
      label: `Events (${numEvents})`,
      content: <EventNotifications />,
    },
    {
      label: `Connections (${numConnections})`,
      content: <ConnectionNotifications />,
    },
  ]

  return (
    <div>
      <div className="flex space-x-3 border-b">
        {/* Loop through tab data and render button for each. */}
        {tabsData.map((tab: any, idx: number) => {
          return (
            <button
              key={idx}
              className={`py-2 px-2 border-b-4 transition-colors duration-300 font-bold ${
                idx === activeTabIndex
                  ? 'border-[#38b6ff]'
                  : 'border-transparent hover:border-gray-200'
              }`}
              // Change the active tab on click.
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {/* Show active tab content. */}
      <div className="py-4">
        <p>{tabsData[activeTabIndex].content}</p>
      </div>
    </div>
  )
}

export default NotificationTabs
