import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CreateEventButton from '../CreateEventButton'
import { ReactComponent as LandingPic } from '../../assets/landing-hero.svg'

const Hero: FC = () => {
  const { token } = useSelector((state: any) => state.auth)

  return (
    <div>
      <div className="flex p-[50px]">
        <div
          className="flex-1 bg-orange-50 rounded"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div className="ml-[100px]">
            <p className="text-[40px] font-bold">
              Stay <span className={'text-[#5DB5F9]'}>Connected</span>
            </p>
            <p>
              Event management system where you are both the host and the user.
            </p>
            <p>Stay in the loop with all our events.</p>

            <div className="flex mt-[45px]">
              <Link to={'/events'}>
                <button className="w-[150px] btn btn-primary btn-block capitalize">
                  Browse Events
                </button>
              </Link>

              {token && <CreateEventButton isHomePage />}
            </div>
          </div>
        </div>

        <div
          className="flex-1"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '-40px',
          }}
        >
          <LandingPic className="w-[440px]" />
        </div>
      </div>
    </div>
  )
}

export default Hero
