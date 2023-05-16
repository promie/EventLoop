import { FC } from 'react'
import { FcInfo } from 'react-icons/fc'

const ConnectionPermissionNotification: FC = () => {
  return (
    <div className="flex p-[20px] items-center bg-orange-50 rounded-sm mt-[15px]">
      <div>
        <FcInfo size={28} />
      </div>
      <p className="flex-1 ml-[15px]">
        Get connected with other users who share the same interest and attending
        the same event. Please make sure your interest is updated. To disable
        this wonderful feature, simply uncheck the{' '}
        <strong>Connection permission</strong> option.
      </p>
    </div>
  )
}

export default ConnectionPermissionNotification
