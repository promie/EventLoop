import { FC, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { InfinitySpin } from 'react-loader-spinner'
import queryString from 'query-string'
import { categoryOptions } from '../../constants'

const initialState = {
  title: '',
  location: '',
  category: '',
  status: '',
  start_date: '',
}

const EventsSearch: FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [data, setData] = useState<any>({
    ...initialState,
    title: searchParams.get('title') || '',
    category: searchParams.get('category') || '',
  })

  const { isLoaded } = useJsApiLoader({
    // @ts-ignore
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    region: 'au',
    types: ['(cities)'],
  })

  if (!isLoaded) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <InfinitySpin color="#38b6ff" />
      </div>
    )
  }

  const handleOnChange = (e: any) => {
    const { name, value } = e.target

    setData({ ...data, [name]: value })
  }

  const resetValue = () => {
    setData(initialState)
    navigate('/events')
  }

  const handleSearch = () => {
    // Build query params and go to link
    const query = {
      ...(data.title && { title: data.title }),
      ...(data.location && { location: data.location }),
      ...(data.category &&
        data.category !== 'Select category' && { category: data.category }),
      ...(data.status &&
        data.status !== 'Select status' && { status: data.status }),
      ...(data.start_date && { start_date: data.start_date }),
    }

    navigate(`/events?${queryString.stringify(query)}`)
  }

  return (
    <div className="bg-gray-100 h-[250px] flex items-center justify-center">
      <div className="flex">
        <div className="flex-1 w-[850px]">
          <div>
            <label className="block text-gray-700 font-bold">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleOnChange}
              placeholder="Search event by title"
              className={
                'w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
              }
            />
          </div>

          <div className="flex justify-between mt-2">
            <div className="mt-2">
              <label className="block text-gray-700 font-bold">Location</label>
              <Autocomplete>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={data.location}
                  onChange={handleOnChange}
                  onBlur={handleOnChange}
                  placeholder="Search by location"
                  className={
                    'w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                  }
                />
              </Autocomplete>
            </div>

            <div>
              <label className="label">
                <label className="text-gray-700 font-bold">Category</label>
              </label>
              <select
                className="select select-bordered w-full"
                name="category"
                onChange={handleOnChange}
                value={data.category}
              >
                <option>Select category</option>
                {categoryOptions.map(category => (
                  <option value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <label className="text-gray-700 font-bold">Status</label>
              </label>
              <select
                className="select select-bordered w-full"
                name="status"
                onChange={handleOnChange}
                value={data.status}
              >
                <option>Select status</option>
                <option value={'Ticket Available'}>Ticket Available</option>
                <option value={'Sold Out'}>Sold Out</option>
                <option value={'Finished'}>Finished</option>
                <option value={'Postponed'}>Postponed</option>
                <option value={'Cancelled'}>Cancelled</option>
              </select>
            </div>

            <div className="mt-[5.5px]">
              <label className="block text-gray-700 font-bold">Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={data.start_date}
                onChange={handleOnChange}
                placeholder="Search by location"
                className={
                  'w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none uppercase'
                }
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-[30px]">
          <button
            className="w-[150px] btn btn-primary btn-block capitalize ml-2"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="w-[150px] btn neutral btn-block capitalize ml-2"
            onClick={resetValue}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventsSearch
