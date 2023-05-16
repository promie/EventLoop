import { FC } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { normaliseResponseObj } from '../../helpers'
import Event from '../Event'
import { useSelector } from 'react-redux'

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

const RecommendedEvents: FC = () => {
  const { recommendedEvents } = useSelector((store: any) => store.events)

  return (
    <div className="mb-[20px]">
      <h1 className={'text-[24px] text-bold mb-2 font-bold'}>
        Recommended Events
      </h1>
      <Carousel
        responsive={responsive}
        showDots={true}
        swipeable={true}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={100}
        removeArrowOnDeviceType={[
          'superLargeDesktop',
          'desktop',
          'tablet',
          'mobile',
        ]}
      >
        {normaliseResponseObj(recommendedEvents)?.map((d: any) => (
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

export default RecommendedEvents
