import { FC } from 'react'
import PurchasedEvents from '../../components/PurchasedEvents'

/*
  Manage user bookings container
 */

const Tickets: FC = () => {
  return (
    <div className="flex">
      {/*This section show's the page side bar with an option for the user to View The bookings*/}
      <div className="flex flex-col h-screen p-3 bg-white shadow w-60">
        <div className="space-y-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Bookings</h2>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1">
              <li className="rounded-sm bg-blue-100">
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

                  <span>View My Bookings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/*Right-hand column of a two-column that contains the PurchasedEvents container by the user*/}
      <div className="container">
        <PurchasedEvents />
      </div>
    </div>
  )
}

export default Tickets
