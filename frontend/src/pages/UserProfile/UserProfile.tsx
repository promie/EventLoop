import { FC, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GiBookCover } from 'react-icons/gi'
import { toast } from 'react-toastify'
import { InfinitySpin } from 'react-loader-spinner'
import { MdCategory, MdOutlineSocialDistance } from 'react-icons/md'
import Banner from '../../assets/banner.jpeg'
import DefaultAvatar from '../../assets/default-profile.png'
import ProfileNotConfigured from '../../components/ProfileNotConfigured'
import { getConnectionProfileDetailsByUserId } from '../../features/user/userAction'
import { createUserConnections } from '../../features/connections/connectionsAction'

/*
  Connections profile page
 */

const UserProfile: FC = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const params = useParams()
  const dispatch = useDispatch()

  // @ts-ignore
  const { connectionInfo } = useSelector((state: any) => state.user)
  const { connectionSuccess } = useSelector((state: any) => state.connections)
  const userIdFromStorage = localStorage.getItem('userId')

  const { userId } = params

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getConnectionProfileDetailsByUserId({
        userId,
        ownerId: userIdFromStorage,
      }),
    )
  }, [userId, userIdFromStorage, connectionSuccess])

  // Main function to add the connections
  const addToConnections = async () => {
    setLoading(true)
    const response = await dispatch(
      // @ts-ignore
      createUserConnections({ ownerId: userIdFromStorage, memberId: userId }),
    )

    // Once the connection is initialiated successfully show the toast and set the loading state back to false
    if (response.type === 'connections/createUserConnections/fulfilled') {
      // @ts-ignore
      toast.success(
        `You have successfully added ${connectionInfo.first_name} ${connectionInfo.last_name} to your connections.`,
      )
      setLoading(false)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="h-[340px]">
        <img
          src={Banner}
          alt="nature"
          className="h-[180px] w-full object-cover absolute"
        />
        <div className="relative pt-[80px] pl-[120px] flex">
          <div className="avatar w-[230px]">
            <div className="w-[200px] rounded-full ring ring-[#fff] ring-offset-base-100 ring-offset-2">
              <img
                src={connectionInfo?.photo_url || DefaultAvatar}
                alt="avatar preview"
              />
            </div>
          </div>
          <div className="mt-[108px] flex w-full ml-[10px]">
            <div className="flex-1">
              <h1 className="font-bold text-[30px]">
                {connectionInfo.first_name} {connectionInfo.last_name}
              </h1>
              <a
                href={`mailto:${connectionInfo.email}`}
                className="hover:underline cursor-pointer"
              >
                {connectionInfo.email}
              </a>
            </div>

            <div className="p-[20px]">
              {Number(userId) !== Number(userIdFromStorage) && (
                <button
                  className="btn gap-2 btn-primary capitalize"
                  disabled={connectionInfo.is_connected}
                  onClick={addToConnections}
                >
                  {loading ? (
                    <div className="mt-[-22px] ml-[10px]">
                      <InfinitySpin color={'white'} width="160px" />
                    </div>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                        />
                      </svg>
                      Add to Connections
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 flex h-[450px]">
        {/*Left hand side of the profile panel */}
        <div className="w-[30px] bg-[#38b6ff]">
          <div className="flex items-center justify-center"></div>
        </div>
        {/*Only show the information of the user if their profile is filled out*/}
        {/*properly: About Me, Interests and Social Media are filled out properly*/}
        <div className="px-[100px] py-[50px] w-full">
          {connectionInfo.about_me &&
          connectionInfo.about_me !== 'None' &&
          connectionInfo.interests &&
          connectionInfo.interests !== 'None' &&
          connectionInfo.website_url &&
          connectionInfo.website_url !== 'None' ? (
            <>
              {connectionInfo.about_me && (
                <div>
                  <div className="flex items-center">
                    <span>
                      <GiBookCover size={26} />
                    </span>
                    <h1 className="font-bold ml-[10px] text-[18px]">
                      About me
                    </h1>
                  </div>
                  <p>{connectionInfo.about_me}</p>
                </div>
              )}

              {connectionInfo.interests && (
                <div className="mt-[60px]">
                  <div className="flex items-center">
                    <span>
                      <MdCategory size={26} />
                    </span>
                    <h1 className="font-bold ml-[10px] text-[18px]">
                      Interests
                    </h1>
                  </div>
                  <p>{connectionInfo.interests}</p>
                </div>
              )}

              {connectionInfo.website_url && (
                <div className="mt-[60px]">
                  <div className="flex items-center">
                    <span>
                      <MdOutlineSocialDistance size={26} />
                    </span>
                    <h1 className="font-bold ml-[10px] text-[18px]">
                      Social Media
                    </h1>
                  </div>
                  <a
                    href={`${connectionInfo.website_url}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {connectionInfo.website_url}
                  </a>
                </div>
              )}
            </>
          ) : (
            // In the case where the user have not configured his or her profile
            <ProfileNotConfigured />
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
