import { FC, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getReviewsByEventId } from '../../features/reviews/reviewsAction'
import ReviewCard from '../ReviewCard'
import NoReviews from '../NoReviews'
import { formatDateTime } from '../../helpers'

interface IProps {
  eventId: any
  eventTitle: any
  eventStartDateTime: any
}

const ReadCustomersReviews: FC<IProps> = ({
  eventId,
  eventTitle,
  eventStartDateTime,
}) => {
  const { reviews, error } = useSelector((state: any) => state.reviews)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getReviewsByEventId({ eventId: eventId }),
    )
  }, [])

  return (
    <div>
      <div className="text-center">
        <h1 className="text-[25px] font-bold">{eventTitle}</h1>
        <p className="mb-[15px] mt-[-5px]">
          {formatDateTime(eventStartDateTime)}
        </p>
      </div>
      <hr className="divide-dashed" />

      <div className="mt-[10px] px-[15px]">
        {!error &&
          reviews?.items?.map((review: any, idx: number) => (
            <ReviewCard
              key={idx}
              customerId={review.customer_id}
              customerName={review.customer}
              customerPhotoUrl={review.customer_photo_url}
              rating={review.rating}
              comment={review.comment}
              createdDate={review.date_created}
            />
          ))}

        {error && <NoReviews />}
      </div>
    </div>
  )
}

export default ReadCustomersReviews
