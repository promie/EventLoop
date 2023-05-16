import { FC, useEffect, useState } from 'react'
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaBookReader,
  FaTags,
  FaMapMarkedAlt,
  FaUserAlt,
  FaMoneyCheckAlt,
  FaRegCalendarAlt,
} from 'react-icons/fa'
import { IoIosArrowDropleftCircle } from 'react-icons/io'
import { MdCategory, MdChildCare } from 'react-icons/md'
import { InfinitySpin } from 'react-loader-spinner'
import TicketButton from '../../components/TicketButton'
import { getEventById } from '../../features/events/eventsAction'
import {
  coordinatesConversionToObj,
  formatDateTime,
  getTicketPriceRanges,
  convertAge,
} from '../../helpers'
import { lightTheme } from '../../components/EventsMap/mapStyles'
import Reviews from '../../components/Reviews'
import EventStatusBadge from '../../components/EventStatusBadge'
import Chatbot from '../../components/Chatbot'

/*
  Single event view page which displays the details of the event including the option to purchase tickets and view reviews
 */

const EventView: FC = () => {
  const [event, setEvent] = useState<any>(null)

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Retrieving the values from the redux store for the events and reviews
  const { loading } = useSelector((state: any) => state.events)
  const { userPostReviewComplete } = useSelector((state: any) => state.reviews)

  // Retreiving the logged-in userId from the localStorage
  const userIdFromStorage = localStorage.getItem('userId')

  // @ts-ignore
  const { token } = useSelector(state => state.auth)
  const { eventId } = params

  // On the page re-render when the eventId changes, refetch and do an API call to get the event details by the eventId passed in on the params
  useEffect(() => {
    const getEvent = async () => {
      // @ts-ignore
      const response = await dispatch(getEventById({ eventId }))
      setEvent(response.payload)
    }

    getEvent()
  }, [eventId, userPostReviewComplete])

  const { isLoaded } = useJsApiLoader({
    // @ts-ignore
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    region: 'au',
  })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <InfinitySpin width="200" color="#38b6ff" />
      </div>
    )
  }

  const center = coordinatesConversionToObj(event?.gps_coord) || {
    lat: -33.9173,
    lng: 151.225332432,
  }

  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <>
          <div className="h-[100px] flex items-center p-[20px] mb-[-80px] bg-[#F5F5F5]">
            <IoIosArrowDropleftCircle
              size={50}
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="bg-[#F5F5F5] p-[50px]">
            <div className=" h-[460px] flex justify-center items-center">
              <div className="card lg:card-side bg-base-100 shadow-sm content-center w-[1350px]">
                <figure>
                  <img
                    src={event?.photo_url}
                    alt="Album"
                    className="w-[900px] h-[400px] object-cover"
                  />
                </figure>
                <div className="card-body">
                  <div className="card-title flex">{event?.title}</div>
                  <p>
                    <p className="mb-[8px]">
                      {formatDateTime(event?.start_datetime)}
                    </p>

                    <EventStatusBadge status={event?.status} />
                  </p>

                  <div className="flex items-center">
                    <FaUserAlt />
                    {token ? (
                      <Link
                        to={`/profile/${event?.created_by}`}
                        className="ml-[5px] font-bold hover:underline cursor-pointer"
                      >
                        {event?.owner_name}
                      </Link>
                    ) : (
                      <span className="ml-[5px] font-bold">
                        {event?.owner_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <FaMoneyCheckAlt />
                    {/*If the price to the event is 0.00 display the word FREE instead for readability*/}
                    <span className="ml-[5px] font-bold">
                      {getTicketPriceRanges(event?.tickets) === '$0.00'
                        ? 'FREE'
                        : getTicketPriceRanges(event?.tickets)}
                    </span>
                  </div>

                  {/*Hide this button to the creator of the event as they cannot purchase their own event*/}
                  {Number(event?.created_by) !== Number(userIdFromStorage) && (
                    <div className="card-actions justify-end">
                      <TicketButton event={event} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/*Container for the event information*/}
            <div className="flex justify-center flex-col items-center">
              <div className="w-[1350px] bg-[#fff] flex h-[500px]">
                <div className="w-[900px] p-[25px]">
                  {/*Description section*/}
                  <div>
                    <div className="flex items-center mb-[10px] text-[#38b6ff]">
                      <span>
                        <FaBookReader size={24} />
                      </span>
                      <h1 className="text-[23px] font-bold ml-[8px]">
                        Description
                      </h1>
                    </div>
                    <p>{event?.description}</p>
                  </div>
                  {/* Category & Age Restrictions */}
                  <div className="flex my-[25px] w-[800px] justify-between">
                    {/*Date & Time Section*/}
                    <div className="w-[250px]">
                      <div className="flex items-center mb-[10px] text-[#38b6ff]">
                        <span>
                          <FaRegCalendarAlt size={24} />
                        </span>
                        <h1 className="text-[23px] font-bold ml-[8px]">
                          Date & Time
                        </h1>
                      </div>
                      <p>
                        {formatDateTime(event?.start_datetime)} -{' '}
                        {formatDateTime(event?.end_datetime)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center mb-[10px] text-[#38b6ff]">
                        <span>
                          <MdCategory size={32} />
                        </span>
                        <h1 className="text-[23px] font-bold ml-[8px]">
                          Category
                        </h1>
                      </div>
                      <p>{event?.category}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-[10px] text-[#38b6ff]">
                        <span>
                          <MdChildCare size={32} />
                        </span>
                        <h1 className="text-[23px] font-bold ml-[8px]">
                          Age Restrictions
                        </h1>
                      </div>
                      <p>{convertAge(event?.age_limit)}</p>
                    </div>
                  </div>
                  {/*Tags Section*/}
                  <div className="mt-[25px]">
                    <div className="flex items-center mb-[10px] text-[#38b6ff]">
                      <span>
                        <FaTags size={24} />
                      </span>
                      <h1 className="text-[23px] font-bold ml-[8px]">Tags</h1>
                    </div>

                    {event?.tags
                      ?.split(', ')
                      .map((tag: string, idx: number) => (
                        <div
                          className="badge badge-lg badge-outline mr-[5px]"
                          key={idx}
                        >
                          {tag}
                        </div>
                      ))}
                  </div>{' '}
                </div>
                <div className="p-[25px] w-[450px]">
                  {/*Location Section*/}
                  <div>
                    <div className="flex items-center mb-[10px] text-[#38b6ff]">
                      <span>
                        <FaMapMarkedAlt size={24} />
                      </span>
                      <h1 className="text-[23px] font-bold ml-[8px]">
                        Location
                      </h1>
                    </div>
                    <div className="w-full h-[320px]">
                      <p className="mb-[20px]">{event?.location_add}</p>
                      {/* Google Map Box */}
                      <GoogleMap
                        center={center}
                        zoom={15}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                          styles: lightTheme,
                        }}
                      >
                        <MarkerF position={center} />
                        {/*Display markers or directions*/}
                      </GoogleMap>
                    </div>
                  </div>
                </div>
              </div>

              {/*Customer reviews section*/}
              {/*Only show the reviews if the event is finished*/}
              {event?.status === 'Finished' && (
                <div className="w-[1350px] bg-[#fff]">
                  <hr className="divide-dashed mb-[20px]" />
                  <Reviews
                    eventId={eventId}
                    averageRating={event.average_rating}
                    numberOfRatings={event.nb_of_ratings}
                    ratingDistribution={event.rating_distribution}
                  />
                </div>
              )}
            </div>
          </div>
          <Chatbot />
        </>
      )}
    </>
  )
}

export default EventView
