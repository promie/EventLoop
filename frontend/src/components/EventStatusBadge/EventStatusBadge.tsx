import { FC } from 'react'
import cx from 'classnames'

interface IProps {
  status: string
  rounded?: boolean
}

const EventStatusBadge: FC<IProps> = ({ status, rounded = true }) => {
  const badgeStyle = cx(
    'p-[4px] px-[18px] font-bold',
    [status === 'Ticket Available' && 'bg-green-200'],
    [status === 'Sold Out' && 'bg-orange-200'],
    [status === 'Finished' && 'bg-gray-200'],
    [status === 'Postponed' && 'bg-blue-200'],
    [status === 'Cancelled' && 'bg-red-200'],
    [rounded && 'rounded-lg'],
  )

  return <span className={badgeStyle}>{status}</span>
}

export default EventStatusBadge
