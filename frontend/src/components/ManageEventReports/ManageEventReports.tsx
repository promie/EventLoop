import { FC, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BarChart from '../BarChart'
import PieChart from '../PieChart'
import AreaChart from '../AreaChart'
import { getAnalyticsInfoByUserId } from '../../features/analytics/analyticsAction'

const ManageEventReports: FC = () => {
  const { statistics } = useSelector((store: any) => store.analytics)
  const dispatch = useDispatch()
  const userIdFromStorage = localStorage.getItem('userId')

  useEffect(() => {
    dispatch(
      // @ts-ignore
      getAnalyticsInfoByUserId({ userId: userIdFromStorage }),
    )
  }, [userIdFromStorage])

  return (
    <div className="px-[10px] mt-[30px]">
      <div className="flex items-center justify-center">
        <div style={{ width: '65%', height: '50%' }}>
          <AreaChart statistics={statistics} />
        </div>
      </div>

      <div className="flex mt-[60px]">
        <div className="flex-1">
          <PieChart statistics={statistics} />
        </div>

        <div className="flex-1 px-[15px]">
          <BarChart statistics={statistics} />
        </div>
      </div>
    </div>
  )
}

export default ManageEventReports
