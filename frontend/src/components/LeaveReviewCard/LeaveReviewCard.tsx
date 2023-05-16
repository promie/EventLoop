import { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DefaultProfile from '../../assets/default-profile.png'
// @ts-ignore
import ReactStars from 'react-rating-stars-component'
import { InfinitySpin } from 'react-loader-spinner'
import { leaveReviewForEvent } from '../../features/reviews/reviewsAction'
import InvalidNotification from '../InvalidNotification'
import { toast } from 'react-toastify'

interface IProps {
  eventId: number
  closeModal: any
}

const initialState = {
  rating: 0,
  comment: '',
}

const LeaveReviewCard: FC<IProps> = ({ eventId, closeModal }) => {
  const [data, setData] = useState<any>(initialState)
  const [formValid, setFormValid] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [showNotificationMessage, setShowNotificationMessage] =
    useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const { userInfo } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const userIdFromStorage = localStorage.getItem('userId')

  useEffect(() => {
    if (data.rating === 0 || data.comment === '') {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [data])

  const onChangeHandler = (e: any) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const ratingChanged = (newRating: number) => {
    setData({ ...data, rating: newRating })
  }

  const submitReview = async () => {
    setLoading(true)

    const response = await dispatch(
      // @ts-ignore
      leaveReviewForEvent({
        userId: userIdFromStorage,
        eventId,
        rating: data.rating,
        comment: data.comment,
      }),
    )

    if (response.type === 'reviews/leaveReviewForEvent/rejected') {
      // Set Error Message show the error
      setNotificationMessage(response.payload)
      setShowNotificationMessage(true)
    } else {
      // HIDE ERROR MESSAGE
      setNotificationMessage('')
      setShowNotificationMessage(false)

      // CLOSE MODAL
      closeModal()

      // SHOW SUCCESS TOAST
      toast.success('Your review has been successfully submitted!')
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <div className="px-[10px]">
      {/*Profile picture and author name*/}
      <div className="flex items-center">
        <img
          src={userInfo.photo_url || DefaultProfile}
          alt={'default'}
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <p className="ml-[3px] text-[16px] cursor-pointer hover:underline font-bold">
          {userInfo.first_name} {userInfo.last_name}
        </p>
      </div>
      <hr className="divide-dashed my-2" />

      {showNotificationMessage && (
        <InvalidNotification
          header={'Review cannot be submitted'}
          content={notificationMessage}
        />
      )}

      <div className="mt-[10px]">
        <label className="text-[14px] font-bold">Rating:</label>
        <div>
          <ReactStars
            count={5}
            size={40}
            edit={true}
            name="rating"
            onChange={ratingChanged}
            activeColor="#f6d860"
          />
        </div>
      </div>

      <div className="mt-[10px] flex flex-col">
        <label className="text-[14px] font-bold">Comment:</label>
        <textarea
          id="comment"
          name="comment"
          value={data.comment}
          onChange={onChangeHandler}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none h-[70x]"
        />{' '}
      </div>

      <div className="flex justify-end mt-[15px] mb-[10px]">
        <button
          className="w-[150px] btn btn-primary btn-block capitalize ml-[10px]"
          type="submit"
          disabled={!formValid}
          onClick={submitReview}
        >
          {loading ? (
            <div className="mt-[-22px]">
              <InfinitySpin color={'white'} />
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </div>
  )
}

export default LeaveReviewCard
