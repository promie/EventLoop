import { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { FcEditImage } from 'react-icons/fc'
import { AiOutlineClose } from 'react-icons/ai'
import EditEventForm from '../EditEventForm'
import { getEventById } from '../../features/events/eventsAction'

interface IProps {
  eventId: any
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '750px',
  },
  overlay: {
    background: 'rgba(56, 182, 255, 0.4)',
    zIndex: 1000,
  },
}

const EditEventButton: FC<IProps> = ({ eventId }) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)
  const [event, setEvent] = useState<any>()
  const dispatch = useDispatch()

  const {
    hostEventUpdateSuccess,
    hostEventCancelSuccess,
    createNewEventSuccess,
  } = useSelector((store: any) => store.events)

  useEffect(() => {
    const getEvent = async () => {
      // @ts-ignore
      const result = await dispatch(getEventById({ eventId }))

      setEvent(result.payload)
    }

    getEvent()
  }, [createNewEventSuccess, hostEventUpdateSuccess, hostEventCancelSuccess])

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <span className="tooltip tooltip-top" data-tip="Edit event details">
        <FcEditImage
          size={30}
          className="cursor-pointer"
          onClick={() => openModal()}
        />
      </span>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create Event Modal"
        shouldCloseOnOverlayClick={false}
      >
        <div
          className="cursor-pointer mt-1 flex justify-end"
          onClick={closeModal}
        >
          <div className="tooltip tooltip-left" data-tip="Close">
            <AiOutlineClose size={28} className="font-bold" />
          </div>
        </div>
        <div className="mt-7">
          <EditEventForm event={event} closeModal={closeModal} />
        </div>
      </Modal>
    </>
  )
}

export default EditEventButton
