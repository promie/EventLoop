import { FC } from 'react'
// @ts-ignore
import ReactStars from 'react-stars'
import LeaveReviewButton from '../LeaveReviewButton'
import { useSelector } from 'react-redux'
import { wholeNumberRating } from '../../helpers'

interface IProps {
  averageRating: number
  numberOfRatings: number
  ratingDistribution: any
  eventId: number
}

/*
  A component that gives calculates the average ratings for the reviews
 */

const ReviewsSummary: FC<IProps> = ({
  averageRating,
  numberOfRatings,
  ratingDistribution,
  eventId,
}) => {
  const { token } = useSelector((state: any) => state.auth)

  const fiveStar = ratingDistribution ? ratingDistribution[5] : 0
  const fourStar = ratingDistribution ? ratingDistribution[4] : 0
  const threeStar = ratingDistribution ? ratingDistribution[3] : 0
  const twoStar = ratingDistribution ? ratingDistribution[2] : 0
  const oneStar = ratingDistribution ? ratingDistribution[1] : 0

  return (
    <>
      <h1 className="text-[24px] font-bold">Customer Reviews</h1>
      <div className="flex items-center">
        <ReactStars
          count={5}
          size={24}
          value={averageRating}
          edit={false}
          isHalf={true}
          activeColor="#f6d860"
        />
        <span className="ml-[15px] font-bold">
          {(averageRating || 0).toFixed(2)} out of 5
        </span>
      </div>

      {numberOfRatings > 1 && (
        <p className="text-[13px] text-gray-500">
          Based on total of {numberOfRatings}{' '}
          {numberOfRatings > 1 ? 'reviews' : 'review'}
        </p>
      )}

      <div className="flex mt-[15px]">
        <h3>5 star</h3>
        <div className="relative pt-1 w-[150px] mt-[5px] ml-[10px]">
          <div className="flex items-center justify-between"></div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${fiveStar}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#f6d860]"
            ></div>
          </div>
        </div>
        <p className="ml-[10px]">{`${wholeNumberRating(fiveStar)}%`}</p>{' '}
      </div>

      <div className="flex">
        <h3>4 star</h3>
        <div className="relative pt-1 w-[150px] mt-[5px] ml-[10px]">
          <div className="flex items-center justify-between"></div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${fourStar}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#f6d860]"
            ></div>
          </div>
        </div>
        <p className="ml-[10px]">{`${wholeNumberRating(fourStar)}%`}</p>{' '}
      </div>

      <div className="flex">
        <h3>3 star</h3>
        <div className="relative pt-1 w-[150px] mt-[5px] ml-[10px]">
          <div className="flex items-center justify-between"></div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${threeStar}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#f6d860]"
            ></div>
          </div>
        </div>
        <p className="ml-[10px]">{`${wholeNumberRating(threeStar)}%`}</p>{' '}
      </div>

      <div className="flex">
        <h3>2 star</h3>
        <div className="relative pt-1 w-[150px] mt-[5px] ml-[10px]">
          <div className="flex items-center justify-between"></div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${wholeNumberRating(twoStar)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#f6d860]"
            ></div>
          </div>
        </div>
        <p className="ml-[10px]">{`${wholeNumberRating(twoStar)}%`}</p>{' '}
      </div>

      <div className="flex">
        <h3>1 star</h3>
        <div className="relative pt-1 w-[150px] mt-[5px] ml-[10px]">
          <div className="flex items-center justify-between"></div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${wholeNumberRating(oneStar)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#f6d860]"
            ></div>
          </div>
        </div>
        <p className="ml-[10px]">{`${wholeNumberRating(oneStar)}%`}</p>
      </div>

      {token && (
        <div className="ml-[20px]">
          <LeaveReviewButton eventId={eventId} />
        </div>
      )}
    </>
  )
}

export default ReviewsSummary
