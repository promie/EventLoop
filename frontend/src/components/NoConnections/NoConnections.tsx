import { FC } from 'react'
import { GiBreakingChain } from 'react-icons/gi'

/*
  A component that displays when a has no connections on their list.
 */

const NoConnections: FC = () => {
  return (
    <div className="flex items-center justify-center flex-col mt-20">
      <GiBreakingChain color={'#f6d860'} size={80} />
      <p className="text-[24px] font-bold">You don't have any connections</p>
    </div>
  )
}

export default NoConnections
