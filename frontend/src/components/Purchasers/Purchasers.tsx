import { FC, useEffect, Fragment, useState } from 'react'
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react'
import DefaultProfile from '../../assets/default-profile.png'
import { useDispatch, useSelector } from 'react-redux'
import { getListOfEventCustomers } from '../../features/events/eventsAction'
import { dollarValueFormat, formatDateTime } from '../../helpers'
import { getBookingReceiptInfoByBookingId } from '../../features/user/userAction'

interface IProps {
  eventId: any
  eventTitle: string
  eventStartDateTime: any
}

const Purchasers: FC<IProps> = ({
  eventId,
  eventTitle,
  eventStartDateTime,
}) => {
  const { eventCustomers } = useSelector((store: any) => store.events)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(0)
  const [receiptInfo, setReceiptInfo] = useState<any>()

  const handleOpen = async (value: any, bookingId: number) => {
    const data = await dispatch(
      // @ts-ignore
      getBookingReceiptInfoByBookingId({ bookingId }),
    )

    setReceiptInfo(data.payload)

    setOpen(open === value ? 0 : value)
  }

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getListOfEventCustomers({ eventId }),
    )
  }, [])

  return (
    <div>
      <div className="text-center">
        <h1 className="text-[25px] font-bold">{eventTitle}</h1>
        <p className="mb-[15px] mt-[-5px]">
          {formatDateTime(eventStartDateTime)}
        </p>
      </div>
      <hr className="divide-dashed" />

      <div className="text-[20px] font-bold mt-[20px]">Customers</div>

      <Fragment>
        {eventCustomers?.items?.map((customer: any, idx: number) => (
          <Accordion open={open === idx + 1}>
            <AccordionHeader
              onClick={() => handleOpen(idx + 1, customer.booking_id)}
            >
              <div className="flex w-full">
                <div className="flex items-center flex-1">
                  <img
                    src={customer.photo_url || DefaultProfile}
                    alt={'customer preview'}
                    className="w-[70px] h-[70px] object-cover rounded-full"
                  />
                  <div className="text-left">
                    <p className="ml-[10px] text-[16px]">{customer.customer}</p>
                    <p className="ml-[10px] text-[12px] mt-[-10px] text-gray-500">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="mr-[20px] flex items-center text-sm text-gray-500">
                  Booking ID: {customer.booking_id}
                </div>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="flex mb-[50px]">
                <div className="flex-1 pr-[20px]">
                  <div>
                    <div className="font-bold">Customer Info</div>
                    <div className="hover:underline cursor-pointer">
                      {customer.customer}
                    </div>
                    <div>{customer.email}</div>
                  </div>

                  <div className="mt-[20px]">
                    <div className="font-bold">Billing Address</div>
                    <div>{customer.billing_add}</div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="font-bold">Booking Details</div>
                  <div className="text-gray-500">
                    Transactions ID: {receiptInfo?.transaction_id}
                  </div>
                  <table className="table w-full mt-[8px]">
                    <thead>
                      <tr>
                        <th>Ticket Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiptInfo?.booking_details?.map(
                        (booking: any, idx: number) => (
                          <tr key={idx}>
                            <td>{booking.ticket_type}</td>
                            <td>{booking.quantity}</td>
                            <td>{dollarValueFormat(booking.price)}</td>
                            <td>
                              {dollarValueFormat(
                                booking.price * booking.quantity,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
        ))}
      </Fragment>
    </div>
  )
}

export default Purchasers
