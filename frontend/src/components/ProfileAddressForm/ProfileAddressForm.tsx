import { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { InfinitySpin } from 'react-loader-spinner'
import { updateProfileAddress } from '../../features/user/userAction'

const ProfileAddressForm: FC = () => {
  // @ts-ignore
  const { userInfo } = useSelector(state => state.user)
  const userIdFromStorage = localStorage.getItem('userId')

  const [data, setData] = useState<any>({
    billingAddress: userInfo?.billing_add,
    coordinates: userInfo?.billing_gps_coord,
    homeAddress: userInfo?.home_add,
  })
  const [sameAsBillingAddress, setSameAsBillingAddress] = useState<boolean>(
    userInfo?.billing_add === userInfo?.home_add,
  )
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { isLoaded } = useJsApiLoader({
    // @ts-ignore
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    region: 'au',
  })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <InfinitySpin width="200" color="#38b6ff" />
      </div>
    )
  }

  const handleOnChange = (e: any) => {
    const { name, value } = e.target

    setData({ ...data, [name]: value })
  }

  const handleChangeChk = (chkValue: any) => {
    setSameAsBillingAddress(chkValue.target.checked)

    if (chkValue.target.checked === true) {
      setData({ ...data, homeAddress: data.billingAddress })
    } else {
      setData({ ...data, homeAddress: '' })
    }
  }

  const onSave = async () => {
    setLoading(true)

    const response = await dispatch(
      // @ts-ignore
      updateProfileAddress({
        userId: userIdFromStorage,
        billingAddress: data.billingAddress,
        coordinates: data.coordinates,
        homeAddress: data.homeAddress,
      }),
    )

    if (response.type === 'user/updateProfileAddress/fulfilled') {
      toast.success('User details successfully updated')
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <>
      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Billing Address
          </label>
        </div>

        <div className="w-full">
          <Autocomplete>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              value={data.billingAddress}
              onChange={handleOnChange}
              onBlur={handleOnChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </Autocomplete>
        </div>
      </div>

      <div className="flex my-1">
        <div className="flex items-center mt-[20px]">
          <label className="block text-gray-700 font-bold w-[300px] flex items-center">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              id="sameAsBillingAddres"
              name="sameAsBillingAddress"
              checked={sameAsBillingAddress}
              onChange={event => {
                handleChangeChk(event)
              }}
            />
            <span className="label-text ml-[4px]">Same as billing address</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer label"></label>
        </div>
      </div>

      <div className="flex my-1">
        <div className="flex items-center">
          <label className="block text-gray-700 font-bold w-[300px]">
            Home Address
          </label>
        </div>

        <div className="w-full">
          <Autocomplete>
            <input
              type="text"
              id="homeAddress"
              name="homeAddress"
              value={data.homeAddress}
              onChange={handleOnChange}
              onBlur={handleOnChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </Autocomplete>
        </div>
      </div>

      {/*Save button here*/}
      <hr className="divide-dashed my-[45px]" />

      <div className="flex justify-end mt-[-10px]">
        <button
          className="w-[150px] btn btn-primary btn-block capitalize"
          onClick={onSave}
        >
          {loading ? (
            <div className="mt-[-22px] ml-[10px]">
              <InfinitySpin color={'white'} width="200px" />
            </div>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </>
  )
}

export default ProfileAddressForm
