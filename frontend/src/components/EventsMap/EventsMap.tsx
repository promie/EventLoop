import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api'
import { InfinitySpin } from 'react-loader-spinner'
import { coordinatesConversionToObj } from '../../helpers'
import { lightTheme } from './mapStyles'
import EventMapInfoWindowContent from '../EventMapInfoWindowContent'

/*
  EventsMap component renders the marker of the different location on Google Map
 */

const EventsMap: FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const { events } = useSelector((store: any) => store.events)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // @ts-ignore
    setSelectedMarker(null)
  }, [searchParams.toString()])

  // Utilising the Google Map API
  const { isLoaded } = useJsApiLoader({
    // @ts-ignore
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    region: 'au',
  })

  // While the Google Maps API is loading show the infinity spinner
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <InfinitySpin width="200" color="#38b6ff" />
      </div>
    )
  }

  const center = {
    lat: -33.8688,
    lng: 151.2093,
  }

  return (
    <div className="bg-blue-50 h-full w-full">
      <GoogleMap
        center={center}
        zoom={11}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: lightTheme,
        }}
      >
        {/*Show the marker on the map based on the locations coordinates*/}
        {events?.items?.map((event: any, idx: number) => (
          <MarkerF
            key={idx}
            position={coordinatesConversionToObj(event?.gps_coord) || center}
            onClick={() => {
              setSelectedMarker(event)
            }}
          />
        ))}

        {/*Show the info window of the event if the user clicks on the marker*/}
        {selectedMarker && (
          <InfoWindowF
            position={coordinatesConversionToObj(selectedMarker?.gps_coord)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
            }}
            onCloseClick={() => setSelectedMarker('')}
          >
            <EventMapInfoWindowContent eventInfo={selectedMarker} />
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  )
}

export default EventsMap
