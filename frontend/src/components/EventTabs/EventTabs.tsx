import { FC, useState } from 'react'

interface IProps {
  tabsData: any
}

const EventTabs: FC<IProps> = ({ tabsData }) => {
  // Keep track of the index of the tab with the initial index of 0 = Upcoming Purchased Components
  const [activeTabIndex, setActiveTabIndex] = useState(0)

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

export default EventTabs
