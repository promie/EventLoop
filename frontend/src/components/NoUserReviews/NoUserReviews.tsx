import { FC } from 'react'
import { BsStar } from 'react-icons/bs'

const NoUserReviews: FC = () => {
  return (
    <div className="flex items-center justify-center flex-col mt-20">
      <BsStar color={'#f6d860'} size={60} />
      <p className="text-[24px] font-bold">No reviews to show</p>
    </div>
  )
}

export default NoUserReviews
