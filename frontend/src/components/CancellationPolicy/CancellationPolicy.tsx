import { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { MdFreeCancellation } from 'react-icons/md'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { customerCancelsBooking } from '../../features/bookings/bookingsAction'
import { InfinitySpin } from 'react-loader-spinner'
import { toast } from 'react-toastify'

interface IProps {
  startDateTime: any
  bookingId: any
  closeModal: any
}

const CancellationPolicy: FC<IProps> = ({
  startDateTime,
  bookingId,
  closeModal,
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const today = new Date().toLocaleString('en-US', {
    timeZone: 'Australia/Sydney',
  })

  const dateDiff = differenceInCalendarDays(
    new Date(startDateTime),
    new Date(today),
  )

  const onCancelHandler = async () => {
    if (
      window.confirm(
        'By cancelling your booking, the event host wil be notified by email that your booking is cancelled. Do you want to confirm?',
      )
    ) {
      setLoading(true)

      const response = await dispatch(
        // @ts-ignore
        customerCancelsBooking({ bookingId }),
      )

      if (response?.payload?.status === 'OK') {
        // Close Modal
        closeModal()
        // Show success toast
        toast.success('Your booking has been successfully cancelled.')
        setLoading(false)
      }

      setLoading(false)
    }
  }

  return (
    <div className="flex">
      <div className="flex w-[480px]">
        <div className="w-[50px] flex justify-center pt-[15px]">
          <MdFreeCancellation size={34} />
        </div>
        <div className="flex-1 p-[15px]">
          <h1 className="font-bold">Cancellation Policy</h1>
          {dateDiff <= 7 ? (
            <p>
              The event is scheduled to occur in the next 7 days. This booking
              cannot be cancelled.
            </p>
          ) : (
            <p>
              A booking can only be cancelled if the event is scheduled to occur
              at least 7 days in the future. 100% refund of booking cost will be
              returned to the customer.
            </p>
          )}
        </div>
      </div>
      <div className="w-[200px] flex items-center justify-center">
        <button
          className="w-[150px] btn btn-outline btn-block capitalize ml-2"
          disabled={dateDiff <= 7}
          onClick={onCancelHandler}
        >
          {loading ? (
            <span className="mt-[-10px] ml-[-25px]">
              <InfinitySpin width="150" color="#38b6ff" />
            </span>
          ) : (
            'Cancel booking'
          )}{' '}
        </button>
      </div>
    </div>
  )
}

export default CancellationPolicy
