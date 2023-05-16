import { FC } from 'react'
import { MdEmail } from 'react-icons/md'
import Logo from '../../assets/EventLoop_transparent.png'

/*
  Footer component that contains the logo, copyright and social media (non-linkable) of EventLoop
 */

const Footer: FC = () => {
  // A function to get the current year so that the value is not hard-coded and this automatically gets updated based on the current year
  const getFullYear = () => {
    const d = new Date()
    return d.getFullYear()
  }

  return (
    <footer className="footer items-center p-4 bg-[#fff] text-neutral-content border-t-[0.5px] border-b-[0.5px] border-[#38b6ff]">
      <div className="items-center grid-flow-col">
        <img src={Logo} alt={'event loop brand'} className="w-[170px]" />
        <p>Copyright © {getFullYear()} - All right reserved</p>
      </div>
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <p className="text-bold">Stay in the loop.</p>

        <MdEmail size={25} />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current"
        >
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
        </svg>
      </div>
    </footer>
  )
}

export default Footer
