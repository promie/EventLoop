import { FC, useState, useEffect } from 'react'
import { useWizard } from 'react-use-wizard'
import {
  useJsApiLoader,
  Autocomplete,
  GoogleMap,
  MarkerF,
} from '@react-google-maps/api'
import Geocode from 'react-geocode'
import { useDispatch, useSelector } from 'react-redux'
import { GrMapLocation } from 'react-icons/gr'
import { FaRegCalendarAlt, FaInfoCircle } from 'react-icons/fa'
import {
  goNextSection,
  goPreviousSection,
  saveDetailsInformation,
} from '../../features/events/eventsSlice'
import { Required } from '../EventInformation/EventInformation'
import { lightTheme } from '../EventsMap/mapStyles'

const Details: FC = () => {
  const { detailsInformation } = useSelector((store: any) => store.events)

  const [data, setData] = useState<any>({
    location: detailsInformation.location.address,
    startDateTime: detailsInformation.startDateTime,
    endDateTime: detailsInformation.endDateTime,
  })
  const [eventLocation, setEventLocation] = useState<string>(
    detailsInformation.location.address || '',
  )
  const [coordinates, setCoordinates] = useState<any>(
    detailsInformation.location.coordinates,
  )
  const [startDateTimePassValidation, setStartDateTimePassValidation] =
    useState<boolean>(true)
  const [endDateTimePassValidation, setEndDateTimePassValidation] =
    useState<boolean>(true)
  const [displayStartDateTimeError, setDisplayStartDateTimeError] =
    useState<boolean>(false)
  const [displayEndDateTimeError, setDisplayEndDateTimeError] =
    useState<boolean>(false)

  const dispatch = useDispatch()
  const { previousStep, nextStep, activeStep } = useWizard()

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

  if (!isLoaded) {
    return <div>Loading.....</div>
  }

  const onChangeHandler = (e: any) => {
    const { name, value } = e.target

    if (name === 'startDateTime') {
      const today = new Date()

      today.setHours(0, 0, 0, 0)

      if (new Date(value) < today) {
        setStartDateTimePassValidation(false)
        setDisplayStartDateTimeError(true)
      } else {
        setStartDateTimePassValidation(true)
        setDisplayStartDateTimeError(false)
      }
    }

    if (name === 'endDateTime') {
      const eventStartDateTime = new Date(data.startDateTime)

      if (new Date(value) < eventStartDateTime) {
        setEndDateTimePassValidation(false)
        setDisplayEndDateTimeError(true)
      } else {
        setEndDateTimePassValidation(true)
        setDisplayEndDateTimeError(false)
      }
    }

    setData({ ...data, [name]: value })
  }

  const goNext = () => {
    const payload = {
      location: {
        address: data.location,
        coordinates,
      },
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      coordinates,
    }

    dispatch(saveDetailsInformation(payload))
    dispatch(goNextSection(activeStep))
    nextStep()
  }

  const goPrevious = () => {
    dispatch(goPreviousSection(activeStep))
    previousStep()
  }

  return (
    <div>
      <hr className="divide-dashed my-5" />

      <div className="px-[20px]">
        <div>
          <div className="flex items-center font-bold">
            <GrMapLocation size={35} />
            <span className="text-xl ml-2">Event Location</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-bold">
            Location <Required>*</Required>
          </label>
          <Autocomplete>
            <input
              type="text"
              id="location"
              name="location"
              value={data.location}
              placeholder="Enter location"
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

          <div className="w-full h-[250px] mt-[10px]">
            {eventLocation ? (
              <GoogleMap
                center={coordinates}
                zoom={15}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  styles: lightTheme,
                }}
              >
                {eventLocation && <MarkerF position={coordinates} />}
              </GoogleMap>
            ) : (
              <div className="bg-gray-100 h-full flex items-center justify-center rounded-md">
                <div className="flex items-center">
                  <FaInfoCircle size={20} />
                  <span className="ml-[5px] text-[18px]">
                    Event location not yet set
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center font-bold">
            <FaRegCalendarAlt size={35} />
            <span className="text-xl ml-2">Event Date & Time</span>
          </div>
        </div>

        <div className="flex space-x-2.5 mt-5">
          <div className="flex-1">
            <label className="block text-gray-700 font-bold">
              Start Date & Time <Required>*</Required>
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

            {displayStartDateTimeError && (
              <div className="text-red-500">
                * Event date cannot be be in the past
              </div>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-bold">
              End Date & Time <Required>*</Required>
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
            {displayEndDateTimeError && (
              <div className="text-red-500">
                * Event end date cannot be before event start date
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="divide-dashed my-5 mt-[50px]" />

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
            disabled={
              data.location === '' ||
              data.startDateTime === undefined ||
              data.endDateTime === undefined ||
              data.startDateTime === '' ||
              data.endDateTime === '' ||
              !startDateTimePassValidation ||
              !endDateTimePassValidation
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Details
