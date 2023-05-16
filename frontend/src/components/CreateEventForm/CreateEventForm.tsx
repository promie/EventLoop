import { FC } from 'react'
import { Wizard } from 'react-use-wizard'
import { useSelector } from 'react-redux'
import EventInformation from '../EventInformation'
import Details from '../Details'
import Tickets from '../Tickets'
import Publish from '../Publish'

interface IProps {
  closeModal: any
}

const CreateEventForm: FC<IProps> = ({ closeModal }) => {
  const { createEventActiveStep } = useSelector((store: any) => store.events)

  return (
    <>
      <div className="text-center">
        <ul className="steps">
          <li
            className={
              createEventActiveStep <= 3 ? 'step step-primary' : 'step'
            }
          >
            Event Information
          </li>
          <li
            className={
              createEventActiveStep > 0 && createEventActiveStep <= 3
                ? 'step step-primary'
                : 'step'
            }
          >
            Details
          </li>
          <li
            className={
              createEventActiveStep > 1 && createEventActiveStep <= 3
                ? 'step step-primary'
                : 'step'
            }
          >
            Tickets
          </li>
          <li
            className={
              createEventActiveStep > 2 && createEventActiveStep <= 3
                ? 'step step-primary'
                : 'step'
            }
          >
            Publish
          </li>
        </ul>
      </div>

      <Wizard>
        <EventInformation />
        <Details />
        <Tickets />
        <Publish closeModal={closeModal} />
      </Wizard>
    </>
  )
}

export default CreateEventForm
