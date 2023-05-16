import { FC } from 'react'

const Copyright: FC = () => {
  const getFullYear = () => {
    const d = new Date()
    return d.getFullYear()
  }

  return (
    <p className="text-sm text-gray-500 mt-12">
      &copy; {getFullYear()} EventLoop - All Rights Reserved.
    </p>
  )
}

export default Copyright
