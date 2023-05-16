import { createSlice } from '@reduxjs/toolkit'
import {
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  createNewEvent,
  hostCancelsEvent,
  hostEditsEvent,
  getListOfEventCustomers,
  getRecommendedEventsByUserId,
} from './eventsAction'

const initialEventInfoState = {
  title: '',
  organiser: '',
  description: '',
  category: '',
  ageRestriction: -1,
  tags: [],
  photoURL: null,
}

const initialDetailsInfoState = {
  location: {
    address: '',
    coordinates: {
      lat: -33.9173,
      lng: 151.225332432,
    },
    startDateTime: '',
    endDateTime: '',
  },
}

// GLOBAL STATE SHARED ACROSS COMPONENTS
const initialState: any = {
  events: [],
  upcomingEvents: [],
  eventCustomers: [],
  recommendedEvents: [],
  loading: false,
  error: null,
  success: false,
  createEventActiveStep: 0,
  eventInformation: initialEventInfoState,
  detailsInformation: initialDetailsInfoState,
  ticketsInformation: [],
  hostEventUpdateSuccess: false,
  hostEventCancelSuccess: false,
  createNewEventSuccess: false,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    goNextSection: (state, action) => {
      const { payload: activeStep } = action

      state.createEventActiveStep = activeStep + 1
    },
    goPreviousSection: (state, action) => {
      const { payload: activeStep } = action

      state.createEventActiveStep = activeStep - 1
    },
    saveEventInformation: (state, action) => {
      state.eventInformation = action.payload
    },
    saveDetailsInformation: (state, action) => {
      state.detailsInformation = action.payload
    },
    saveTicketsInformation: (state, action) => {
      state.ticketsInformation = action.payload
    },
    resetEventCreationForm: state => {
      state.createEventActiveStep = 0
      state.eventInformation = initialEventInfoState
      state.detailsInformation = initialDetailsInfoState
      state.ticketsInformation = []
    },
  },
  extraReducers: builder => {
    // Get All Events
    builder.addCase(getAllEvents.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getAllEvents.fulfilled, (state, { payload }) => {
      state.loading = false
      state.events = payload
      state.success = true
    })

    builder.addCase(getAllEvents.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
      state.events = []
    })

    // Get Event Info By ID
    builder.addCase(getEventById.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getEventById.fulfilled, (state, { payload }) => {
      state.loading = false
      state.success = true
    })

    builder.addCase(getEventById.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Get upcoming events
    builder.addCase(getUpcomingEvents.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getUpcomingEvents.fulfilled, (state, { payload }) => {
      state.loading = false
      state.success = true
      state.upcomingEvents = payload
    })

    builder.addCase(getUpcomingEvents.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Create new event
    builder.addCase(createNewEvent.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(createNewEvent.fulfilled, (state, { payload }) => {
      state.loading = false
      state.createNewEventSuccess = !state.createNewEventSuccess
      state.success = true
    })

    builder.addCase(createNewEvent.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Host cancels event
    builder.addCase(hostCancelsEvent.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(hostCancelsEvent.fulfilled, (state, { payload }) => {
      state.loading = false
      state.hostEventCancelSuccess = !state.hostEventCancelSuccess
      state.success = true
    })

    builder.addCase(hostCancelsEvent.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Host edits event
    builder.addCase(hostEditsEvent.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(hostEditsEvent.fulfilled, (state, { payload }) => {
      state.loading = false
      state.hostEventUpdateSuccess = !state.hostEventUpdateSuccess
      state.success = true
    })

    builder.addCase(hostEditsEvent.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Getting list of event customers
    builder.addCase(getListOfEventCustomers.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getListOfEventCustomers.fulfilled, (state, { payload }) => {
      state.loading = false
      state.eventCustomers = payload
      state.success = true
    })

    builder.addCase(getListOfEventCustomers.rejected, (state, { payload }) => {
      state.loading = false
      state.eventCustomers = []
      state.error = payload
    })

    // Getting a list of recommended events by userId
    builder.addCase(getRecommendedEventsByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getRecommendedEventsByUserId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.recommendedEvents = payload
        state.success = true
      },
    )

    builder.addCase(
      getRecommendedEventsByUserId.rejected,
      (state, { payload }) => {
        state.loading = false
        state.recommendedEvents = []
        state.error = payload
      },
    )
  },
})

export const {
  goNextSection,
  goPreviousSection,
  saveEventInformation,
  saveDetailsInformation,
  saveTicketsInformation,
  resetEventCreationForm,
} = eventsSlice.actions
export default eventsSlice.reducer
