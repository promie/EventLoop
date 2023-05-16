import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { BsCheckCircle, BsCheckCircleFill } from 'react-icons/bs'
import ProfileAccountForm from '../ProfileAccountForm'
import ProfileAddressForm from '../ProfileAddressForm'
import ProfileLoginSecurityForm from '../ProfileLoginSecurityForm'
import ProfileSocialInterests from '../ProfileSocialInterests'

const Tabs: FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  // @ts-ignore
  const { userInfo } = useSelector(state => state.user)

  const AccountLabel = (
    <div>
      {userInfo?.gender && userInfo?.photo_url ? (
        <div className="flex items-center">
          <BsCheckCircleFill color="green" />{' '}
          <span className="ml-[5px]">Account</span>
        </div>
      ) : (
        <div className="flex items-center">
          <BsCheckCircle /> <span className="ml-[5px]">Account</span>
        </div>
      )}
    </div>
  )

  const AddressLabel = (
    <div>
      {userInfo?.billing_add &&
      userInfo?.billing_gps_coord &&
      userInfo?.home_add &&
      userInfo?.home_gps_coord ? (
        <div className="flex items-center">
          <BsCheckCircleFill color="green" />{' '}
          <span className="ml-[5px]">Address</span>
        </div>
      ) : (
        <div className="flex items-center">
          <BsCheckCircle /> <span className="ml-[5px]">Address</span>
        </div>
      )}
    </div>
  )

  const SocialInterestLabel = (
    <div>
      {userInfo?.about_me &&
      userInfo?.phone &&
      userInfo?.website_url &&
      userInfo?.interests ? (
        <div className="flex items-center">
          <BsCheckCircleFill color="green" />{' '}
          <span className="ml-[5px]">Social & Interests</span>
        </div>
      ) : (
        <div className="flex items-center">
          <BsCheckCircle /> <span className="ml-[5px]">Social & Interests</span>
        </div>
      )}
    </div>
  )

  const tabsData = [
    {
      label: AccountLabel,
      content: <ProfileAccountForm />,
    },
    {
      label: AddressLabel,
      content: <ProfileAddressForm />,
    },
    {
      label: SocialInterestLabel,
      content: <ProfileSocialInterests />,
    },
    {
      label: 'Login & Security',
      content: <ProfileLoginSecurityForm />,
    },
  ]

  return (
    <div>
      <div className="flex space-x-3 border-b">
        {/* Loop through tab data and render button for each. */}
        {tabsData.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={`py-2 px-2 border-b-4 transition-colors duration-300 font-bold ${
                idx === activeTabIndex
                  ? 'border-[#38b6ff]'
                  : 'border-transparent hover:border-gray-200'
              }`}
              // Change the active tab on click.
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {/* Show active tab content. */}
      <div className="py-4">
        <p>{tabsData[activeTabIndex].content}</p>
      </div>
    </div>
  )
}

export default Tabs
