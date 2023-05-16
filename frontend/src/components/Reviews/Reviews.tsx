import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReviewsSummary from '../ReviewsSummary'
import ReviewCard from '../ReviewCard'
import NoReviews from '../NoReviews'
import { getReviewsByEventId } from '../../features/reviews/reviewsAction'

interface IProps {
  eventId: any
  averageRating: number
  numberOfRatings: number
  ratingDistribution: any
}

/*
  Reviews section that display on the event page and the user's manage-events page.
 */

const Reviews: FC<IProps> = ({
  eventId,
  averageRating,
  numberOfRatings,
  ratingDistribution,
}) => {
  const { reviews, error } = useSelector((state: any) => state.reviews)
  const { userPostReviewComplete } = useSelector((state: any) => state.reviews)

  const dispatch = useDispatch()

  // Page re-render once the user completes his review, it will re-fetch the list of reviews for that event and renders on the page
  useEffect(() => {
    dispatch(
      // @ts-ignore
      getReviewsByEventId({ eventId: eventId }),
    )
  }, [userPostReviewComplete])

  return (
    <div className="flex mb-[30px]">
      <div className="w-[380px] px-[15px]">
        {/*A component that shows the average ratings of the reviews*/}
        <ReviewsSummary
          averageRating={averageRating}
          numberOfRatings={numberOfRatings}
          ratingDistribution={ratingDistribution}
          eventId={eventId}
        />
      </div>

      <div className="flex-1">
        {!error && reviews?.items?.length > 0 && (
          <div>
            {/*Only render this ReviewCard component if the event has reviews*/}
            {reviews?.items?.map((review: any) => (
              <ReviewCard
                customerId={review.customer_id}
                customerName={review.customer}
                customerPhotoUrl={review.customer_photo_url}
                rating={review.rating}
                comment={review.comment}
                createdDate={review.date_created}
              />
            ))}
          </div>
        )}

        {/*If a finished event has no reviews, then render the NoReviews component*/}
        {error && <NoReviews />}
      </div>
    </div>
  )
}

export default Reviews
