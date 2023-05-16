import { FC } from 'react'
import { Link } from 'react-router-dom'
import ELLogo from '../../assets/EventLoop_transparent.png'

const Logo: FC = () => {
  return (
    <Link to={'/'}>
      <img
        src={ELLogo}
        alt="Event Loop Logo"
        className="w-[250px] cursor-pointer pt-[10px]"
      />
    </Link>
  )
}

export default Logo
