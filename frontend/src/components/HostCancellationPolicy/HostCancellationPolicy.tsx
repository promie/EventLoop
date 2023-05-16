import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { formatDateTime } from '../../helpers'
import { MdFreeCancellation } from 'react-icons/md'
import { InfinitySpin } from 'react-loader-spinner'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { getListOfEventCustomers } from '../../features/events/eventsAction'
import { useSelector } from 'react-redux'
import { hostCancelsEvent } from '../../features/events/eventsAction'
import { toast } from 'react-toastify'

interface IProps {
  eventId: number
  eventTitle: string
  eventStartDateTime: any
  soldTickets: any
  closeModal: any
}

const HostCancellationPolicy: FC<IProps> = ({
  eventId,
  eventTitle,
  eventStartDateTime,
  soldTickets,
  closeModal,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const {
    eventCustomers,
    hostEventUpdateSuccess,
    hostEventCancelSuccess,
    createNewEventSuccess,
  } = useSelector((store: any) => store.events)

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getListOfEventCustomers({ eventId }),
    )
  }, [hostEventUpdateSuccess, hostEventCancelSuccess, createNewEventSuccess])

  const today = new Date().toLocaleString('en-US', {
    timeZone: 'Australia/Sydney',
  })

  const dateDiff = differenceInCalendarDays(
    new Date(eventStartDateTime),
    new Date(today),
  )

  const numCustomers = new Set(
    eventCustomers?.items?.map((customer: any) => customer.email),
  ).size

  const onCancelHandler = async () => {
    setLoading(true)

    const response = await dispatch(
      // @ts-ignore
      hostCancelsEvent({ eventId }),
    )

    if (response?.payload?.status === 'OK') {
      // Close Modal
      closeModal()
      // Show success toast
      toast.success('The event is successfully cancelled.')
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-[25px] font-bold">{eventTitle}</h1>
        <p className="mb-[15px] mt-[-5px]">
          {formatDateTime(eventStartDateTime)}
        </p>
      </div>
      <hr className="divide-dashed" />

      <div className="flex">
        <div className="flex w-[480px]">
          <div className="w-[50px] flex justify-center pt-[15px]">
            <MdFreeCancellation size={34} />
          </div>
          <div className="flex-1 p-[15px]">
            <h1 className="font-bold">Cancellation Note</h1>
            {dateDiff <= 7 ? (
              <p>
                The event is scheduled to occur in the next 7 days. This booking
                cannot be cancelled.
              </p>
            ) : (
              <p>
                This event has sold{' '}
                <span className="font-bold">
                  {soldTickets} {soldTickets > 1 ? 'tickets' : 'ticket'}
                </span>
                . Once the cancellation is confirmed,{' '}
                <span className="font-bold">
                  {numCustomers} {numCustomers > 1 ? 'customers' : 'customer'}
                </span>{' '}
                who purchased the tickets to this event will be informed by
                email that the event is cancelled. Are you sure you want to
                cancel?
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
              'Cancel event'
            )}{' '}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HostCancellationPolicy
