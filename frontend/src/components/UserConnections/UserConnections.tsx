import { FC, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllUserConnections } from '../../features/connections/connectionsAction'
import NoConnections from '../NoConnections'
import UserConnection from '../UserConnection'

const UserConnections: FC = () => {
  // Retrieving the loggedIn userId from the localStorage
  const userIdFromStorage = localStorage.getItem('userId')

  // Retrieving elements from the redux store for connections
  const { connections, removeConnectionSuccess } = useSelector(
    (store: any) => store.connections,
  )
  const dispatch = useDispatch()

  // On the page re-render retrieve the list of the user connections based on the dependency array
  useEffect(() => {
    dispatch(
      // @ts-ignore
      getAllUserConnections({ userId: userIdFromStorage }),
    )
  }, [userIdFromStorage, removeConnectionSuccess])

  return (
    <div className="px-[120px] py-[40px]">
      <div className="flex mb-[20px]">
        <div className="flex-1">
          <h1 className="text-[45px] font-bold">My Connections</h1>
        </div>
      </div>

      <hr className="divide-dashed my-[18px]" />

      {/*If the user has connections, map through the list and render the UserConnection component*/}
      {connections?.items?.length ? (
        <>
          {connections?.items?.map((connection: any, idx: any) => (
            <UserConnection key={idx} connection={connection} />
          ))}
        </>
      ) : (
        // If the user has no connections, render the NoConnections component
        <NoConnections />
      )}
    </div>
  )
}

export default UserConnections
