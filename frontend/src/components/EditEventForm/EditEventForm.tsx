import { FC, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Geocode from 'react-geocode'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { InfinitySpin } from 'react-loader-spinner'
import EditEventNotification from '../EditEventNotification'
import Select from 'react-select'
import { tags } from '../../constants'
import { formatDateTime } from '../../helpers'
import { hostEditsEvent } from '../../features/events/eventsAction'
import { toast } from 'react-toastify'
import { MdEditCalendar } from 'react-icons/md'

interface IProps {
  event: any
  closeModal: any
}

const EditEventForm: FC<IProps> = ({ event, closeModal }) => {
  const [data, setData] = useState({
    startDateTime: event?.start_datetime,
    endDateTime: event?.end_datetime,
    location: event?.location_add,
    tags: event?.tags?.split(', ').map((tag: any) => {
      return {
        value: tag,
        label: tag,
      }
    }),
  })
  const [disabledSaveButton, setDisabledSaveButton] = useState<boolean>(true)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const [eventLocation, setEventLocation] = useState<string>(
    event?.location_add,
  )
  const [coordinates, setCoordinates] = useState<any>(event?.gps_coord)

  const { isLoaded } = useJsApiLoader({
    // @ts-ignore
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    region: 'au',
  })

  useEffect(() => {
    if (eventLocation) {
      // @ts-ignore
      Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
      Geocode.fromAddress(data.location)
        .then(res => {
          // All the processing is done here
          const results = res.results[0]
          const {
            geometry: { location },
          } = results

          setCoordinates(location)
        })
        .catch(error => {
          setEventLocation('')
        })
    }
  }, [eventLocation])

  // Second useEffect to check if the event data and user data is the same
  useEffect(() => {
    if (
      data.startDateTime !== event.start_datetime ||
      data.endDateTime !== event.end_datetime ||
      data.location !== event.location_add
    ) {
      setDisabledSaveButton(false)
    } else {
      setDisabledSaveButton(true)
    }
  }, [data])

  if (!isLoaded) {
    return <div>Loading.....</div>
  }

  const onChangeHandler = (e: any) => {
    const { name, value } = e.target

    setData({ ...data, [name]: value })
  }

  const onSaveHandler = async () => {
    const payload = {
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      location: data.location,
      tags: data.tags,
      coordinates,
    }

    setSaveLoading(true)

    const response = await dispatch(
      // @ts-ignore
      hostEditsEvent({
        eventId: event.id,
        startDateTime: payload.startDateTime,
        endDateTime: payload.endDateTime,
        location: payload.location,
        coordinates: payload.coordinates,
        tags: payload.tags,
      }),
    )

    if (response?.payload?.status === 'OK') {
      // Close Modal
      closeModal()
      toast.success('The new event details has been updated')

      setSaveLoading(false)
    }
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-[25px] font-bold">{event.title}</h1>
        <p className="mb-[15px] mt-[-5px]">
          {formatDateTime(event.start_datetime)}
        </p>
      </div>
      <hr className="divide-dashed" />

      <EditEventNotification />

      <div className="flex flex-col">
        <div className="flex-1 p-[20px] bg-orange-50">
          <div className="flex-1 mt-2">
            <label className="block text-gray-700 font-bold">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDateTime"
              name="startDateTime"
              value={data.startDateTime}
              className={
                'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none uppercase'
              }
              onChange={onChangeHandler}
            />
          </div>

          <div className="flex-1 mt-4">
            <label className="block text-gray-700 font-bold">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="endDateTime"
              name="endDateTime"
              value={data.endDateTime}
              className={
                'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none uppercase'
              }
              onChange={onChangeHandler}
            />
          </div>

          <div className="flex-1 mt-4">
            <label className="block text-gray-700 font-bold">Location</label>
            <Autocomplete>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter location"
                value={data.location}
                className={
                  'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                }
                onChange={onChangeHandler}
                onBlur={e => {
                  onChangeHandler(e)
                  setEventLocation(e.target.value)
                }}
              />
            </Autocomplete>
          </div>

          <div className="flex-1 mt-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Tags</label>
              <Select
                options={tags}
                isMulti
                name="tags"
                value={data.tags}
                onChange={choice =>
                  setData({
                    ...data,
                    tags: choice,
                  })
                }
              />
            </div>
          </div>
        </div>

        <hr className="divide-dashed my-[15px]" />

        <div className="flex">
          <div className="flex w-[480px]">
            <div className="w-[50px] flex justify-center pt-[15px]">
              <MdEditCalendar size={34} />
            </div>
            <div className="flex-1 p-[15px]">
              <h1 className="font-bold">Note</h1>
              <p>
                By making this update, the customers who have purchased ticket
                will be all notified by email that the event has been changed.
                Are you sure you want to make the edit?
              </p>
            </div>
          </div>
          <div className="w-[200px] flex items-center justify-center">
            <button
              className="w-[150px] btn btn-outline btn-block capitalize ml-2"
              onClick={onSaveHandler}
              disabled={disabledSaveButton}
            >
              {saveLoading ? (
                <span className="mt-[-10px] ml-[-25px]">
                  <InfinitySpin width="150" color="#38b6ff" />
                </span>
              ) : (
                'Save'
              )}{' '}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditEventForm
