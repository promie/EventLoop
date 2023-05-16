import { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavbarLayout from './components/NavbarLayout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Tickets from './pages/Tickets'
import ManageEvents from './pages/ManageEvents'
import Connections from './pages/Connections'
import Events from './pages/Events'
import EventView from './pages/EventView'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import UserProfile from './pages/UserProfile'
import ProtectedRoute from './routing/ProtectedRoute'

/*
  Entry point of the app where the routes are being defined which renders each of the components
 */

const App: FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*Wrapped the routes under the NavbarLayout so that they share the common navbar*/}
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<Home />} />

            {/*Authenticated routes where the user need to be logged in to access these components*/}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookings" element={<Tickets />} />
              <Route path="/manage-events" element={<ManageEvents />} />
              <Route path="/connections" element={<Connections />} />
            </Route>

            {/*Routes that can be accessed regardless of users logged in status*/}
            <Route path="/events" element={<Events />} />
            <Route path="/event/:eventId" element={<EventView />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
          </Route>

          {/*The below routes do not share the common navbar*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
