import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import DefaultAvatar from '../../assets/default-profile.png'
import { removeConnection } from '../../features/connections/connectionsAction'
import { toast } from 'react-toastify'
import { InfinitySpin } from 'react-loader-spinner'

interface IProps {
  connection: any
}

/*
  A user connection card component which contains the connections profile picture, name and option to
  navigate to their profile page and to successfully disconnect
 */

const UserConnection: FC<IProps> = ({ connection }) => {
  const dispatch = useDispatch()

  // Set local state for the loading state to display the infinity loader if its in a loading state
  const [loading, setLoading] = useState<boolean>(false)

  // Main function to disconnect of the connection
  const disconnect = async (connectionId: any, connectionName: string) => {
    setLoading(true)
    const response = await dispatch(
      // @ts-ignore
      removeConnection({ connectionId }),
    )

    // If disconnect successfully, display a toast and set the loading state to false
    if (response.type === 'connections/removeConnection/fulfilled') {
      toast.success(`Successfully disconnected with ${connectionName}`)
      setLoading(false)
    }
    setLoading(false)
  }

  return (
    <div className="bg-base-100 shadow-xl flex">
      <div className="p-[25px]">
        <div className="avatar">
          <div className="w-[100px] h-[100px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={connection.member_photo_url || DefaultAvatar}
              className="w-[100px] h-[100px]"
              alt="avatar"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex items-center flex-1">
          <h1 className="text-[26px] font-bold">{connection.member}</h1>
        </div>
        <div className="card-actions justify-end flex items-center p-[15px]">
          <div>
            <Link to={`/profile/${connection.member_id}`}>
              <button className="btn btn-outline btn-primary capitalize">
                View Profile
              </button>
            </Link>

            <button
              className="btn btn-outline btn-primary ml-[10px] capitalize"
              onClick={() => disconnect(connection.id, connection.member)}
            >
              {loading ? (
                <span>
                  <InfinitySpin width="150" color="#38b6ff" />
                </span>
              ) : (
                'Disconnect'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserConnection
