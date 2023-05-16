import { FC } from 'react'
import { useSelector } from 'react-redux'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import Event from '../Event'
import './upcomingevents.css'
import { normaliseResponseObj } from '../../helpers'

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

const UpcomingEvents: FC = () => {
  const { upcomingEvents } = useSelector((store: any) => store.events)

  return (
    <div className="mb-[35px]">
      <h1 className={'text-[24px] text-bold mb-2 font-bold'}>
        Upcoming Events
      </h1>
      <Carousel
        responsive={responsive}
        showDots={true}
        swipeable={true}
        keyBoardControl={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        customTransition="all .5"
        transitionDuration={100}
        removeArrowOnDeviceType={[
          'superLargeDesktop',
          'desktop',
          'tablet',
          'mobile',
        ]}
      >
        {normaliseResponseObj(upcomingEvents)?.map((d: any) => (
          <Event
            key={d.id}
            id={d.id}
            title={d.title}
            status={d.status}
            startDate={d.start_datetime}
            photoURL={d.photo_url}
            organiser={d.owner_name}
          />
        ))}
      </Carousel>
    </div>
  )
}

export default UpcomingEvents
