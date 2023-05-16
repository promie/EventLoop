import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { dollarValueFormat, formatDateTime } from '../../helpers'
import TicketPurchase from '../TicketPurchase'

interface IProps {
  event: any
  closeModal: any
}

const TicketForm: FC<IProps> = ({ event, closeModal }) => {
  const [data, setData] = useState<any>([])
  const [showTicketPurchase, setShowTicketPurchase] = useState<boolean>(false)

  const { token } = useSelector((store: any) => store.auth)
  const navigate = useNavigate()

  const onChangeHandler = (e: any, ticket_type: any, price: any) => {
    const { name, value } = e.target

    setData({
      ...data,
      [name]: {
        quantity: value,
        ticket_type,
        price,
        total: value * price,
      },
    })
  }

  const loginToCheckout = () => {
    navigate('/login')
  }

  const tickets = Object.entries(data).map(e => ({ [e[0]]: e[1] }))
  const flattenedTicketTypes = tickets
    .map(tix => Object.values(tix))
    .flat()
    .filter((h: any) => h.quantity > 0)

  const totalPrice = flattenedTicketTypes
    .map((item: any) => item.total)
    .reduce((prev, curr) => prev + curr, 0)

  return (
    <>
      {!showTicketPurchase ? (
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

              <div className="h-[500px]">
                {event?.tickets.map((tix: any, idx: any) => (
                  <div
                    className="flex justify-between mt-[15px] px-[30px]"
                    key={idx}
                  >
                    <div className="mb-1">
                      <p className="text-[20px] font-bold">{tix.ticket_type}</p>
                      <p>{dollarValueFormat(tix.price)} </p>
                      <span className="text-[12px] text-gray-500">
                        ({tix.total_number} Tickets Available)
                      </span>
                    </div>

                    {token && (
                      <input
                        type="number"
                        min="1"
                        max={tix.total_number}
                        id="ticket_type"
                        name={`${tix.ticket_type}`}
                        value={data.ticket_type}
                        defaultValue={0}
                        onChange={e =>
                          onChangeHandler(e, tix.ticket_type, tix.price)
                        }
                        className={
                          'mr-[30px] h-[50px] w-[90px] px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                        }
                        disabled={!token}
                      />
                    )}
                  </div>
                ))}
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
                      <div>{dollarValueFormat(totalPrice)}</div>
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

          <div className="border-t-[0.5px] flex justify-end">
            {token ? (
              <button
                className="btn btn-primary btn-block capitalize mt-[20px] w-[200px]"
                onClick={() => setShowTicketPurchase(true)}
              >
                Checkout
              </button>
            ) : (
              <button
                className="btn btn-primary btn-block mt-[20px] w-[200px] capitalize"
                onClick={() => loginToCheckout()}
              >
                Login to purchase
              </button>
            )}
          </div>
        </>
      ) : (
        <TicketPurchase
          event={event}
          totalAmount={totalPrice}
          flattenedTicketTypes={flattenedTicketTypes}
          setShowTicketPurchase={setShowTicketPurchase}
          closeModal={closeModal}
        />
      )}
    </>
  )
}

export default TicketForm
