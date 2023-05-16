import { FC } from 'react'
import NoReviewsImage from '../../assets/no-reviews.png'

const NoReviews: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-[55px]">
      <img src={NoReviewsImage} alt="No reviews image" className="w-[120px]" />
      <p className="text-[16px] font-bold">
        There is currently no review for this event.
      </p>
    </div>
  )
}

export default NoReviews
