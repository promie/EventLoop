import { FC } from 'react'
import { dollarValueFormat, formatDateTime, formatDate } from '../../helpers'
import CancellationPolicy from '../CancellationPolicy'

interface IProps {
  receiptInfo: any
  startDateTime: any
  showCancellationPolicy?: any
  closeModal: any
}

const ReceiptInfo: FC<IProps> = ({
  receiptInfo,
  startDateTime,
  showCancellationPolicy = false,
  closeModal,
}) => {
  const bookingId = receiptInfo?.booking_details[0]?.booking_id || null

  return (
    <div>
      <div className="text-center">
        <h1 className="text-[25px] font-bold">{receiptInfo.title}</h1>
        <p className="mb-[15px] mt-[-5px]">{formatDateTime(startDateTime)}</p>
      </div>
      <hr className="divide-dashed" />

      <div className="mt-[25px]">
        <h2 className="font-bold">General Information</h2>
        <table className="table w-full mt-[5px]">
          <thead>
            <tr>
              <th className="w-[260px]">Organiser</th>
              <th>Transaction Date</th>
              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{receiptInfo.organiser}</td>
              <td>{formatDate(receiptInfo.date_created)}</td>
              <td>{receiptInfo.transaction_id}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-[25px]">
        <h2 className="font-bold">Booking Details</h2>
        <table className="table w-full mt-[5px]">
          <thead>
            <tr>
              <th>Ticket Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {receiptInfo?.booking_details?.map((booking: any, idx: number) => (
              <tr key={idx}>
                <td>{booking.ticket_type}</td>
                <td>{booking.quantity}</td>
                <td>{dollarValueFormat(booking.price)}</td>
                <td>{dollarValueFormat(booking.price * booking.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="divide-dashed my-[10px]" />

      {showCancellationPolicy && (
        <div>
          <CancellationPolicy
            startDateTime={startDateTime}
            bookingId={bookingId}
            closeModal={closeModal}
          />
        </div>
      )}
    </div>
  )
}

export default ReceiptInfo
