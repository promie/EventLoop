import { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineShoppingCart, MdKeyboardArrowLeft } from 'react-icons/md'
import { dollarValueFormat, formatDateTime } from '../../helpers'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import TicketPurchaseSuccess from '../TicketPurchaseSuccess'
import FreeEventInfo from '../FreeEventInfo'
import { createBooking } from '../../features/bookings/bookingsAction'
import { InfinitySpin } from 'react-loader-spinner'

interface IProps {
  event: any
  totalAmount: number
  flattenedTicketTypes: any
  setShowTicketPurchase: any
  closeModal: any
}

const TicketPurchase: FC<IProps> = ({
  event,
  totalAmount,
  flattenedTicketTypes,
  setShowTicketPurchase,
  closeModal,
}) => {
  const [showTicketPurchaseSuccess, setShowTicketPurchaseSuccess] =
    useState<boolean>(false)
  const [transactionID, setTransactionID] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { token } = useSelector((store: any) => store.auth)
  const freeEvent = totalAmount === 0

  const purchaseTicket = (transactionsId: any) => {
    // Dispatch payload to the server
    setLoading(true)
    const payload = {
      customer_id: Number(localStorage.getItem('userId')),
      event_id: event.id,
      transaction_id: transactionsId,
      booking_details: flattenedTicketTypes.map((ticket: any) => {
        return {
          ticket_type: ticket.ticket_type,
          quantity: Number(ticket.quantity),
        }
      }),
    }

    // @ts-ignore
    dispatch(createBooking({ payload }))
    setLoading(false)
  }

  return (
    <>
      {!showTicketPurchaseSuccess ? (
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

              {/*<div>*/}
              {/*  <MdKeyboardArrowLeft*/}
              {/*    size={45}*/}
              {/*    onClick={() => setShowTicketPurchase(false)}*/}
              {/*    className="cursor-pointer"*/}
              {/*  />*/}
              {/*</div>*/}

              {freeEvent ? (
                <div className="flex flex-col h-[520px] border-b-[0.5px]">
                  <div className="flex-1">
                    <FreeEventInfo />
                  </div>

                  <div className="mx-[50px] flex justify-end mb-[15px]">
                    <button
                      className="btn btn-neutral btn-block mt-[20px] w-[200px] capitalize mr-[10px]"
                      onClick={() => closeModal()}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-block mt-[20px] w-[200px] capitalize"
                      onClick={() => {
                        setTransactionID('N/A')
                        // MAKE API CALL HERE
                        purchaseTicket('N/A')
                        setShowTicketPurchaseSuccess(true)
                      }}
                    >
                      {loading ? (
                        <div className="mt-[-22px] ml-[10px]">
                          <InfinitySpin color={'white'} width="200px" />
                        </div>
                      ) : (
                        'Confirm'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-b-[0.5px] h-[510px]">
                  <div
                    className="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 mx-[50px] mt-[10px]"
                    role="alert"
                  >
                    <p className="font-bold">Payment Options</p>
                    <p className="text-sm">
                      Click the below options to finalise payment.
                    </p>
                  </div>

                  <div className="flex items-center px-[130px]">
                    <div className="mt-[40px] w-[70%] items-center flex-1">
                      <div className="mb-[20px]">
                        <p className="mb-[10px] text-sm italic">
                          For demonstration purposes, please use the below
                          PayPal sandbox credentials to login and finalise
                          payment.
                        </p>

                        <div className="text-sm">
                          <p>
                            email:{' '}
                            <span className="font-bold">
                              sb-o5xwv21736885@personal.example.com
                            </span>
                          </p>
                          <p>
                            password:{' '}
                            <span className="font-bold">jT%pCH0f</span>
                          </p>
                        </div>
                      </div>
                      <PayPalScriptProvider
                        options={{ 'client-id': 'test', currency: 'AUD' }}
                      >
                        <PayPalButtons
                          style={{
                            layout: 'vertical',
                            color: 'blue',
                            shape: 'pill',
                          }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: totalAmount.toString(),
                                  },
                                },
                              ],
                            })
                          }}
                          onApprove={(data, actions: any) => {
                            return actions.order
                              .capture()
                              .then(function (details: any) {
                                setTransactionID(details.id.toString())
                                purchaseTicket(details.id.toString())
                                setShowTicketPurchaseSuccess(true)
                              })
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  </div>

                  <div className="mx-[50px] flex justify-end mb-[15px]">
                    <button
                      className="btn btn-neutral btn-block mt-[70px] w-[200px] capitalize"
                      onClick={() => closeModal()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
        </>
      ) : (
        <TicketPurchaseSuccess
          event={event}
          totalAmount={totalAmount}
          flattenedTicketTypes={flattenedTicketTypes}
          transactionID={transactionID}
        />
      )}
    </>
  )
}

export default TicketPurchase
