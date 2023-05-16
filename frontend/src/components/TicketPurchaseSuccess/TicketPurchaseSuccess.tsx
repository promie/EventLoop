import { FC } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { dollarValueFormat, formatDateTime } from '../../helpers'
import PurchaseSuccess from '../../assets/purchase-success.webp'

interface IProps {
  event: any
  totalAmount: number
  flattenedTicketTypes: any
  transactionID: any
}

const TicketPurchaseSuccess: FC<IProps> = ({
  event,
  totalAmount,
  flattenedTicketTypes,
  transactionID,
}) => {
  const { token } = useSelector((store: any) => store.auth)
  const navigate = useNavigate()

  const goToTicketsPage = () => {
    navigate('/bookings')
  }

  return (
    <>
      <div className="flex">
        {/*Working on two columns*/}
        <div className="w-[700px]">
          <div className="border-b-[0.5px] text-center pb-[15px]">
            <h1 className="text-[26px] font-bold text-[#38b6ff]">
              {event?.title}
            </h1>
            <p>
              {formatDateTime(event?.start_datetime)} -{' '}
              {formatDateTime(event?.end_datetime)}
            </p>
          </div>

          <div className="h-[500px] flex flex-col">
            <div className="flex-1">
              <div
                className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mx-[50px] mt-[30px]"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-teal-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">Thank you for purchasing!</p>
                    <p className="text-sm">
                      This message is to confirm that the purchase for this
                      event is complete.{' '}
                      {totalAmount !== 0 && (
                        <>
                          For your reference, the transaction ID for this
                          purchase is{' '}
                          <span className="underline">{transactionID}</span>.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <img
                src={PurchaseSuccess}
                alt="purchase success"
                className="w-[450px]"
              />
            </div>

            <div className="mx-[50px] flex justify-end">
              <button
                className="btn btn-primary btn-block mt-[20px] w-[200px] capitalize"
                onClick={goToTicketsPage}
              >
                Go to Bookings page
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#F5F5F5] w-[500px] h-[600px]">
          {/*Image section*/}
          <div>
            <img
              src={event?.photo_url}
              alt="event"
              className="h-[200px] w-full object-cover"
            />
          </div>

          {/*Cart Section*/}
          <div>
            {flattenedTicketTypes.length > 0 ? (
              <div className="py-[25px] px-[30px]">
                <div className="font-bold mb-[10px]">Order Summary</div>
                {flattenedTicketTypes?.map((ticket: any, idx: number) => (
                  <div key={idx} className="flex justify-evenly">
                    <p className="flex-1">
                      {ticket.quantity} x {ticket.ticket_type}
                    </p>
                    <p>{dollarValueFormat(ticket.total)}</p>
                  </div>
                ))}

                <div className="flex mt-[250px] text-[18px] font-bold">
                  <div className="flex-1">Total</div>
                  <div>{dollarValueFormat(totalAmount)}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[360px]">
                {token ? (
                  <MdOutlineShoppingCart color={'gray'} size={45} />
                ) : (
                  <div>Only logged in user has access to this content.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t-[0.5px] flex justify-end"></div>
    </>
  )
}

export default TicketPurchaseSuccess
