import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { renameKeys } from '../../helpers'

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
}

const getAllEvents = createAsyncThunk(
  'event/getAllEvents',
  async ({ query }: any, { rejectWithValue }) => {
    try {
      let baseURL = '/api/v1/events'

      if (query) {
        baseURL += `?${query}`
      }

      const { data } = await axios.get(baseURL, config)

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const getEventById = createAsyncThunk(
  'event/getById',
  async ({ eventId }: any, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/events/${eventId}`, config)

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const getUpcomingEvents = createAsyncThunk(
  'events/upcoming',
  async (args, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/events/upcoming', config)

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const uploadImageS3 = createAsyncThunk(
  'event/upload/s3',
  async ({ file }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const newConfig = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }

      const formData = new FormData()
      formData.append('image_file', file)

      const { data } = await axios.post(
        '/api/v1/s3/upload',
        formData,
        newConfig,
      )

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)
const createNewEvent = createAsyncThunk(
  'events/create',
  async (
    {
      title,
      startDateTime,
      endDateTime,
      address,
      coordinates,
      tags,
      category,
      photoURL,
      ageRestriction,
      description,
      tickets,
    }: any,
    { getState, rejectWithValue },
  ) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      // constructed the payload to be the same as the fields on the backend
      const payload = {
        title,
        description,
        created_by: localStorage.getItem('userId'),
        category,
        tags: tags.map((tag: any) => tag.value).join(', '),
        age_limit: Number(ageRestriction),
        photo_url: photoURL,
        location_add: address,
        gps_coord: `lat: ${coordinates.lat}, lng: ${coordinates.lng}`,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        tickets: tickets.map((ticket: any) =>
          renameKeys(
            {
              ticketType: 'ticket_type',
              maxCount: 'total_number',
              ticketPrice: 'price',
            },
            ticket,
          ),
        ),
        status: 'Ticket Available',
      }

      // // make request to backend
      const { data } = await axios.post('/api/v1/events', payload, config)

      return data
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const hostCancelsEvent = createAsyncThunk(
  'events/hostCancelsEvent',
  async ({ eventId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const payload = {
        status: 'Cancelled',
      }

      const { data } = await axios.patch(
        `/api/v1/events/${eventId}`,
        payload,
        config,
      )

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const hostEditsEvent = createAsyncThunk(
  'events/hostEditsEvent',
  async (
    { eventId, startDateTime, endDateTime, location, coordinates, tags }: any,
    { getState, rejectWithValue },
  ) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const payload = {
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        location_add: location,
        gps_coord: `lat: ${coordinates.lat}, lng: ${coordinates.lng}`,
        tags: tags.map((tag: any) => tag.value).join(', '),
      }

      const { data } = await axios.patch(
        `/api/v1/events/${eventId}`,
        payload,
        config,
      )

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const getListOfEventCustomers = createAsyncThunk(
  'event/getListOfBookingCustomers',
  async ({ eventId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const { data } = await axios.get(
        `/api/v1/events/customers/${eventId}?size=100`,
        config,
      )

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const getRecommendedEventsByUserId = createAsyncThunk(
  'event/getRecommendedEventsByUserId',
  async ({ userId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const { data } = await axios.get(
        `/api/v1/recommendations/${userId}`,
        config,
      )

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

export {
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  createNewEvent,
  uploadImageS3,
  hostCancelsEvent,
  hostEditsEvent,
  getListOfEventCustomers,
  getRecommendedEventsByUserId,
}
