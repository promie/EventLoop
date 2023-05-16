import { FC, useState } from 'react'
import { useWizard } from 'react-use-wizard'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdDocumentScanner } from 'react-icons/md'
import {
  numberWithCommas,
  dollarValueFormat,
  convertAge,
  formatDateTime,
  getTicketPriceRangesForPublish,
} from '../../helpers'
import { goPreviousSection } from '../../features/events/eventsSlice'
import {
  createNewEvent,
  uploadImageS3,
} from '../../features/events/eventsAction'
import { InfinitySpin } from 'react-loader-spinner'

interface IProps {
  closeModal: any
}

const Publish: FC<IProps> = ({ closeModal }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { eventInformation, detailsInformation, ticketsInformation } =
    useSelector((store: any) => store.events)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { previousStep, activeStep } = useWizard()

  const goPrevious = () => {
    dispatch(goPreviousSection(activeStep))
    previousStep()
  }
  const combinedPayload = {
    ...eventInformation,
    ...detailsInformation,
  }

  const normaliseTags = (tagsArr: any) => {
    return tagsArr.map((tag: any) => tag.value)
  }

  combinedPayload['tickets'] = ticketsInformation
  const imgPreview =
    (combinedPayload['photoURL'] &&
      URL.createObjectURL(combinedPayload['photoURL'])) ||
    ''

  // Destructure combined payload object
  const {
    title,
    startDateTime,
    endDateTime,
    location: { address, coordinates },
    tags,
    description,
    organiser,
    category,
    ageRestriction,
  } = combinedPayload

  const onSubmit = async () => {
    setLoading(true)
    // THE S3 is being called here
    // Passing the combinedPayload['photoURL'] to S3
    const response = await dispatch(
      // @ts-ignore
      uploadImageS3({ file: combinedPayload.photoURL }),
    )

    if (response.type === 'event/upload/s3/fulfilled') {
      // Get the URL
      // pass the url to the photoURL below replacing the Photo URL
      const result = await dispatch(
        // @ts-ignore
        createNewEvent({
          title,
          startDateTime,
          endDateTime,
          address,
          coordinates,
          tags,
          category,
          photoURL: response.payload,
          ageRestriction,
          description,
          tickets: ticketsInformation,
        }),
      )

      const {
        payload: {
          data: { event_id: eventId },
        },
      } = result

      if (eventId) {
        // Redirect the user to the event view page
        closeModal()
        navigate('/manage-events')
        toast.success('New event successfully created.')
        setLoading(false)
      }
    }

    setLoading(false)
  }

  return (
    <>
      <hr className="divide-dashed my-5" />

      <div className="flex items-center font-bold">
        <MdDocumentScanner size={35} />
        <span className="text-xl ml-2">Summary</span>
      </div>

      <div className="text-center mt-[5px]">
        <h1 className="text-[34px] font-bold text-[#38b6ff]">{title}</h1>
      </div>

      <div className="mt-1">
        <img
          src={imgPreview}
          alt="event preview"
          className="w-[850px] h-[140px] object-cover rounded"
        />
      </div>
      <hr className="divide-dashed my-7" />

      <div className="flex">
        {/*LEFT SECTION*/}
        <div className="px-[30px] w-max-[350px] w-[350px]">
          <div>
            <h2 className="block text-gray-700 font-bold">Date & Time</h2>
            <div className="my-1"></div>
            <div>
              {' '}
              <h2 className="text-[15px] italic">Starting:</h2>{' '}
              <p>{formatDateTime(startDateTime || new Date())}</p>
            </div>

            <div>
              <h2 className="text-[15px] italic">Ending:</h2>{' '}
              <p>{formatDateTime(endDateTime || new Date())}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mt-5">
                Location
              </label>
              <div className="my-1"></div>
              <label>{address}</label>
            </div>
          </div>

          <div>
            <h2 className="block text-gray-700 font-bold mt-5 my-1">Tags</h2>
            {normaliseTags(tags).map((tag: string, idx: number) => (
              <div
                className="badge badge-lg badge-outline mr-[5px] my-0.5 flex-wrap"
                key={idx}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/*RIGHT SECTION*/}
        <div className="flex-1 px-[30px]">
          <div>
            <h2 className="block text-gray-700 font-bold">Description</h2>
            <div className="my-1"></div>
            <p>{description}</p>
          </div>
        </div>
      </div>
      <hr className="divide-dashed mt-8 mb-5" />

      {/*THREE COLUMN SECTION*/}
      <div className="flex px-[30px] text-center mt-[30px]">
        <div className="flex-1">
          <h2 className="block text-gray-700 font-bold my-1">Organiser</h2>
          <p>{organiser}</p>
        </div>

        <div className="flex-1">
          <h2 className="block text-gray-700 font-bold my-1">Category</h2>
          <p>{category}</p>
        </div>

        <div className="flex-1">
          <h2 className="block text-gray-700 font-bold my-1">
            Age Restriction
          </h2>
          <p>{convertAge(ageRestriction)}</p>
        </div>
      </div>
      <hr className="divide-dashed my-5" />

      {/*TICKET TABLE SECTION*/}
      <div
        tabIndex={0}
        className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box mt-[15px] cursor-pointer"
      >
        <div className="collapse-title text-lg font-medium">
          Tickets Information (
          {getTicketPriceRangesForPublish(ticketsInformation) === '$0.00'
            ? 'FREE'
            : getTicketPriceRangesForPublish(ticketsInformation)}
          )
        </div>
        <div className="collapse-content">
          <table className="table w-full text-center">
            <thead>
              <tr>
                <th>Ticket Type</th>
                <th>No. of Tickets</th>
                <th>Price (in AUD)</th>
              </tr>
            </thead>

            <tbody className=" h-[50px] overflow-auto">
              {ticketsInformation?.map((ticket: any) => (
                <tr>
                  <td>{ticket.ticketType}</td>
                  <td>{numberWithCommas(ticket.maxCount)}</td>
                  <td>{dollarValueFormat(ticket.ticketPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>{' '}
        </div>
      </div>

      <hr className="divide-dashed my-5" />

      <div className="mt-5 flex justify-between">
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
            onClick={() => {
              onSubmit()
            }}
            className="btn btn-primary btn-block capitalize w-[150px]"
          >
            {loading ? (
              <div className="mt-[-22px] ml-[10px]">
                <InfinitySpin color={'white'} width="200px" />
              </div>
            ) : (
              'Publish'
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default Publish
