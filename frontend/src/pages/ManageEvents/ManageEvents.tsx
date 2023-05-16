import { FC, useState } from 'react'
import ManageEventEvents from '../../components/ManageEventEvents'
import ManageEventReports from '../../components/ManageEventReports'

/*
  Manage my events for upcoming and previous
 */

const ManageEvents: FC = () => {
  // Setting local state whether to render the ManageEventEvents component based on boolean value initial set to true
  const [showEvents, setShowEvents] = useState<boolean>(true)
  const [eventsClassName, setEventsClassName] = useState<string>(
    'rounded-sm bg-blue-100',
  )

  // Setting local state whether to render the ManageEventReports component based on boolean value initially set to false
  const [showReports, setShowReports] = useState<boolean>(false)
  const [reportsClassName, setReportsClassName] = useState<string>('rounded-sm')

  // functions to display the active menu by displaying the style of blue as active
  const displayEvents = () => {
    setShowEvents(true)
    setEventsClassName('rounded-sm bg-blue-100')
    setShowReports(false)
    setReportsClassName('rounded-sm')
  }

  const displayReports = () => {
    setShowReports(true)
    setReportsClassName('rounded-sm bg-blue-100')
    setShowEvents(false)
    setEventsClassName('rounded-sm')
  }

  return (
    <div className="flex">
      {/*Two-column where this left side of the page contains the menu for the user to navigate between the Events and Reports section*/}
      <div className="flex flex-col h-screen p-3 bg-white shadow w-60">
        <div className="space-y-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Dashboard</h2>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1">
              <li className={eventsClassName} onClick={displayEvents}>
                <a className="flex items-center p-2 space-x-3 rounded-md cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>

                  <span>Events</span>
                </a>
              </li>
              <li className={reportsClassName} onClick={displayReports}>
                <a className="flex items-center p-2 space-x-3 rounded-md cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                    />
                  </svg>

                  <span>Reports</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/*This right hand section conditionally renders either the ManageEventEvents component or the ManageEventReports*/}
      {/*Depending on the active menu*/}
      <div className="container">
        {showEvents && <ManageEventEvents />}
        {showReports && <ManageEventReports />}
      </div>
    </div>
  )
}

export default ManageEvents
