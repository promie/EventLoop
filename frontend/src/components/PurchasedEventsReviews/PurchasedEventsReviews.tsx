import { FC, useEffect } from 'react'
// @ts-ignore
import ReactStars from 'react-rating-stars-component'
import { useDispatch, useSelector } from 'react-redux'
import { formatDateTime, formatDate } from '../../helpers'
import { getReviewsByUserId } from '../../features/reviews/reviewsAction'
import { Link } from 'react-router-dom'
import NoUserReviews from '../NoUserReviews'

const PurchasedEventsReviews: FC = () => {
  const dispatch = useDispatch()

  const userIdFromStorage = localStorage.getItem('userId')
  const { userReviews, userPostReviewComplete } = useSelector(
    (store: any) => store.reviews,
  )

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getReviewsByUserId({ userId: userIdFromStorage }),
    )
  }, [userPostReviewComplete])

  return (
    <>
      {userReviews?.items?.length > 0 ? (
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-[1100px]">Events</th>
              <th className="w-[400px]">Rating</th>
              <th>Comment</th>
            </tr>
          </thead>

          <tbody>
            {userReviews?.items?.map((event: any, idx: number) => (
              <tr key={idx}>
                <td className="flex">
                  <div className="mr-[15px]">
                    <img
                      src={event.photo_url}
                      alt="event"
                      className="w-[80px] h-[80px] object-cover rounded-md"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link
                      to={`/event/${event.event_id}`}
                      className="text-left font-bold cursor-pointer hover:underline"
                    >
                      {event.title}
                    </Link>
                    <p>{formatDateTime(event.start_datetime)}</p>
                  </div>
                </td>
                <td>
                  <ReactStars
                    count={5}
                    size={18}
                    value={event.rating}
                    edit={false}
                    activeColor="#f6d860"
                  />
                </td>
                <td>
                  <div
                    className="w-[400px] whitespace-pre w-max-[400px] break-words"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  >
                    <p className="mb-[2px] mt-[-10px] text-gray-400 text-[12px]">
                      Published on {formatDate(event.date_created)}
                    </p>
                    <div>{event.comment}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoUserReviews />
      )}
    </>
  )
}

export default PurchasedEventsReviews
