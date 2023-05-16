import { FC, useState, useEffect } from 'react'
import Select from 'react-select'
import { useWizard } from 'react-use-wizard'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import {
  goNextSection,
  saveEventInformation,
} from '../../features/events/eventsSlice'
import ImageDropzone from '../ImageDropzone'
import { tags, categoryOptions } from '../../constants'

export const Required = styled.span`
  color: red;
`

const EventInformation: FC = () => {
  const { eventInformation } = useSelector((store: any) => store.events)
  // @ts-ignore
  const { userInfo } = useSelector(state => state.user)

  const hostName =
    (userInfo && `${userInfo.first_name} ${userInfo.last_name}`) || ''

  const [data, setData] = useState<any>({
    ...eventInformation,
    organiser: hostName,
  })
  const [photoURL, setPhotoURL] = useState(eventInformation?.photoURL || '')
  const [passValidation, setPassValidation] = useState<boolean>(false)

  const dispatch = useDispatch()
  const { nextStep, activeStep } = useWizard()

  const allFormsValid = () => {
    const combinedData = { ...data, photoURL }
    return Object.values(combinedData).every(value => value !== '')
  }

  useEffect(() => {
    // Check validation to ensure that all of the fields have value against them
    if (allFormsValid()) {
      setPassValidation(true)
    } else {
      setPassValidation(false)
    }
  }, [data, photoURL])

  const handleOnChange = (e: any) => {
    const { name, value } = e.target

    // Update the value by changing the state
    setData({ ...data, [name]: value })
  }

  const goNext = () => {
    // Combine the data object and the image object together and save it to localStorage????
    const result = { ...data, photoURL }

    // Save the result by dispatching to the global state so that it is accessible from other components
    dispatch(saveEventInformation(result))

    // Go to the next section
    dispatch(goNextSection(activeStep))
    nextStep()
  }

  return (
    <div>
      <hr className="divide-dashed my-5" />

      <div className="px-[20px]">
        <div>
          <div className="flex items-center font-bold">
            <AiOutlineInfoCircle size={35} />
            <span className="text-xl ml-2">Event Info</span>
          </div>

          <div className="flex space-x-2.5 mt-5">
            <div className="flex-1">
              <label className="block text-gray-700 font-bold">
                Title <Required>*</Required>
              </label>
              <input
                type="text"
                id="eventTitle"
                name="title"
                value={data.title}
                onChange={handleOnChange}
                placeholder="Enter event title"
                className={
                  'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                }
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-bold">
                Organiser <Required>*</Required>
              </label>
              <input
                type="text"
                id="organiser"
                name="organiser"
                value={data.organiser}
                onChange={handleOnChange}
                defaultValue={data.organiser}
                placeholder="Enter organiser"
                className={
                  'input w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                }
                disabled
              />
            </div>
          </div>

          <div className="flex space-x-2.5 mt-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-bold">
                Description <Required>*</Required>
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleOnChange}
                placeholder="Enter event title"
                className={
                  'w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none h-[160px]'
                }
              />
            </div>

            <div className="flex-1">
              <div>
                <label className="label">
                  <label className="block text-gray-700 font-bold">
                    Category <Required>*</Required>
                  </label>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="category"
                  value={data.category}
                  onChange={handleOnChange}
                >
                  <option>Select category</option>
                  {categoryOptions.map(category => (
                    <option>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="label">
                  <label className="block text-gray-700 font-bold">
                    Age Restriction <Required>*</Required>
                  </label>
                </label>
                {/*TODO Set the values to as 0, 18, 22*/}
                <select
                  className="select select-bordered w-full"
                  name="ageRestriction"
                  value={data.ageRestriction}
                  onChange={handleOnChange}
                >
                  <option>Select age restriction</option>
                  <option value={0}>None</option>
                  <option value={18}>18+</option>
                  <option value={22}>22+</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-bold">Tags</label>
            <Select
              options={tags}
              isMulti
              name="tags"
              value={data.tags}
              onChange={choice =>
                setData({
                  ...data,
                  tags: choice,
                })
              }
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-bold">
              Photo Upload <Required>*</Required>
            </label>
            <ImageDropzone value={photoURL} setImage={setPhotoURL} />
          </div>
        </div>

        <hr className="divide-dashed my-5" />

        <div className="mt-[10px] flex justify-end space-x-3.5">
          <button
            onClick={() => goNext()}
            className="btn btn-primary btn-block capitalize w-[150px]"
            disabled={!passValidation}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventInformation
