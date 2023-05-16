import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'

const ProtectedRoute: FC = () => {
  // @ts-ignore
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  // On the page re-render, check if the user is logged by effective check
  // the token from the auth store in redux state management
  useEffect(() => {
    // If the user does not have a token, re-direct them to login
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  // return child route elements
  return <Outlet />
}

export default ProtectedRoute
