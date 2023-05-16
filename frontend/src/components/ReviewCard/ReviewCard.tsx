import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
// @ts-ignore
import ReactStars from 'react-rating-stars-component'
import DefaultProfile from '../../assets/default-profile.png'
import { formatDate } from '../../helpers'

interface IProps {
  customerId: number
  customerName: string
  customerPhotoUrl: string
  rating: string
  comment: number
  createdDate: string
}

const ReviewCard: FC<IProps> = ({
  customerId,
  customerName,
  customerPhotoUrl,
  rating,
  comment,
  createdDate,
}) => {
  // @ts-ignore
  const { token } = useSelector(state => state.auth)

  return (
    <div className="mb-[35px] w-[800px]">
      {/*Profile picture and author name*/}
      <div className="flex items-center">
        <img
          src={customerPhotoUrl || DefaultProfile}
          alt={'default'}
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        {token ? (
          <Link
            to={`/profile/${customerId}`}
            className="ml-[3px] text-[13px] cursor-pointer hover:underline"
          >
            {customerName}
          </Link>
        ) : (
          <p className="ml-[3px] text-[13px]">{customerName}</p>
        )}
      </div>

      {/*rating and review section*/}
      <div>
        <ReactStars
          count={5}
          size={18}
          value={rating}
          edit={false}
          activeColor="#f6d860"
        />
        <p className="text-[14px] text-gray-500">
          Reviewed on {formatDate(createdDate)}
        </p>
        <p className="mt-[15px]">{comment}</p>
      </div>
    </div>
  )
}

export default ReviewCard
