import { FC, useState, useEffect } from 'react'
import { useWizard } from 'react-use-wizard'
import { IoTicketSharp } from 'react-icons/io5'
import { TiDeleteOutline } from 'react-icons/ti'
import { BsJournalText, BsPen } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { numberWithCommas, dollarValueFormat } from '../../helpers'
import { saveTicketsInformation } from '../../features/events/eventsSlice'
import { Required } from '../EventInformation/EventInformation'

import {
  goNextSection,
  goPreviousSection,
} from '../../features/events/eventsSlice'

interface IStateInitial {
  ticketType: string
  maxCount: number | string
  ticketPrice: number | string
}

const initialState: IStateInitial = {
  ticketType: '',
  maxCount: '',
  ticketPrice: '',
}

const Tickets: FC = () => {
  const { ticketsInformation } = useSelector((store: any) => store.events)

  const [data, setData] = useState<IStateInitial>(initialState)
  const [tickets, setTickets] = useState<any>(ticketsInformation)
  const [ticketValidationPass, setTicketValidationPass] =
    useState<boolean>(false)

  const dispatch = useDispatch()
  const { previousStep, nextStep, activeStep } = useWizard()

  const allTicketFormValid = () => {
    return Object.values(data).every(value => value !== '')
  }

  useEffect(() => {
    // Perform ticket validation fields to ensure that all forms are field
    allTicketFormValid()
      ? setTicketValidationPass(true)
      : setTicketValidationPass(false)
  }, [data])

  const goNext = () => {
    dispatch(saveTicketsInformation(tickets))
    dispatch(goNextSection(activeStep))
    nextStep()
  }

  const goPrevious = () => {
    dispatch(goPreviousSection(activeStep))
    previousStep()
  }

  const onChangeHandler = (e: any) => {
    e.preventDefault()
    const { name, value } = e.target

    if (name === 'maxCount' || name === 'ticketPrice') {
      setData({ ...data, [name]: Number(value) })
    } else {
      setData({ ...data, [name]: value })
    }
  }

  const addTicket = () => {
    setTickets(tickets.concat(data))
    setData(initialState)
  }

  const deleteEntry = (
    ticketType: string,
    maxCount: number,
    ticketPrice: number,
  ) => {
    setTickets(
      tickets.filter(
        (item: any) =>
          item.ticketType !== ticketType ||
          item.maxCount !== maxCount ||
          item.ticketPrice !== ticketPrice,
      ),
    )
  }

  return (
    <div>
      <hr className="divide-dashed my-5" />

      <div className="flex items-center font-bold">
        <IoTicketSharp size={35} />
        <span className="text-xl ml-2">Tickets</span>
      </div>

      <div className="alert alert-neutral shadow-lg mt-[15px] mb-[20px]">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            The host can only create up to five ticket types per event.
          </span>
        </div>
      </div>

      {/*Notification section here*/}

      <div className="flex justify-between">
        {/*Left part for the tickets form*/}
        <div className="px-[10px] w-[300px] mb-[150px]">
          <div className="flex items-center font-bold mb-[15px] mt-[25px]">
            <BsPen size={35} />
            <span className="text-xl ml-2">Create</span>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold">
              Ticket type <Required>*</Required>
            </label>
            <input
              type="textarea"
              id="ticketType"
              name="ticketType"
              value={data.ticketType}
              placeholder="Enter ticket type"
              className={
                'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
              onChange={onChangeHandler}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-bold">
              Total no. of tickets <Required>*</Required>
            </label>
            <input
              type="number"
              id="maxCount"
              name="maxCount"
              placeholder="Enter total no. of tickets"
              value={data.maxCount}
              className={
                'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
              onChange={onChangeHandler}
              min="1"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-bold">
              Ticket price (in AUD) <Required>*</Required>
            </label>
            <input
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              value={data.ticketPrice}
              placeholder="Enter ticket price"
              className={
                'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
              onChange={onChangeHandler}
              min="1"
              step="any"
            />
          </div>
        </div>
        {/*Center part for the tickets form*/}
        <div className="flex items-center justify-center w-[50px] mx-[10px]">
          <div className="px-[10px] ">
            <button
              onClick={() => addTicket()}
              className="w-[50px] h-[50px] rounded-full
                       btn bg-primary capitalize"
              disabled={!ticketValidationPass || tickets.length >= 5}
            >
              Add
            </button>
          </div>
        </div>

        {/*Right part for the tickets form*/}
        <div className="flex-1 w-[200px]">
          <div className="flex items-center font-bold mb-[15px] mt-[25px]">
            <BsJournalText size={35} />
            <span className="text-xl ml-2">Summary</span>
          </div>
          {tickets.length === 0 ? (
            <div className="bg-gray-100 h-[320px] flex items-center justify-center rounded-md">
              <div className="flex items-center font-bold mb-[15px] mt-[25px]">
                <span className="text-xl ml-2">No summary to display</span>
              </div>
            </div>
          ) : (
            <div>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Ticket Type</th>
                    <th>No. of Tickets</th>
                    <th>Price (in AUD)</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody className=" h-[50px] overflow-auto">
                  {tickets?.map((ticket: any) => (
                    <tr>
                      <td>{ticket.ticketType}</td>
                      <td>{numberWithCommas(ticket.maxCount)}</td>
                      <td>{dollarValueFormat(ticket.ticketPrice)}</td>
                      <td
                        onClick={() =>
                          deleteEntry(
                            ticket.ticketType,
                            ticket.maxCount,
                            ticket.ticketPrice,
                          )
                        }
                        className="cursor-pointer"
                      >
                        <TiDeleteOutline color={'red'} size={30} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/*<hr className="divide-dashed my-5 mt-[50px]" />*/}
      <hr />

      <div className="mt-[10px] flex justify-between">
        <div className="flex1">
          <button
            onClick={() => goPrevious()}
            className="btn btn-primary btn-block capitalize w-[150px]"
          >
            Previous
          </button>
        </div>

        <div className="flex-1 right-0 flex justify-end">
          <button
            onClick={() => goNext()}
            className="btn btn-primary btn-block capitalize w-[150px]"
            disabled={tickets.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tickets
