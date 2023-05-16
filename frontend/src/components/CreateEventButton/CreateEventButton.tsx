import { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
import Modal from 'react-modal'
import CreateEventForm from '../CreateEventForm'
import { resetEventCreationForm } from '../../features/events/eventsSlice'

interface IProps {
  isHomePage?: boolean
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '900px',
    maxHeight: '90%',
  },
  overlay: {
    background: 'rgba(56, 182, 255, 1)',
    zIndex: 1000,
  },
}

const CreateEventButton: FC<IProps> = ({ isHomePage = false }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)

  const { pathname } = location

  const openModal = () => {
    dispatch(resetEventCreationForm())
    setIsOpen(true)
  }

  const closeModal = () => {
    dispatch(resetEventCreationForm())
    setIsOpen(false)
  }

  return (
    <>
      {/*Hide the event button when on the home page as it already appears on the main view*/}
      {pathname !== '/' && !pathname.includes('/manage-events') && (
        <div onClick={() => openModal()}>Create Event</div>
      )}

      {/*Button to only show on the home page*/}
      {isHomePage && (
        <button
          className="w-[150px] btn btn-primary btn-block capitalize ml-2"
          onClick={() => openModal()}
        >
          Create Event
        </button>
      )}

      {/*Button to only show on the home page*/}
      {pathname.includes('/manage-events') && (
        <button
          className="w-[150px] btn btn-primary btn-block capitalize ml-2"
          onClick={() => openModal()}
        >
          Create Event
        </button>
      )}

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
          <CreateEventForm closeModal={closeModal} />
        </div>
      </Modal>
    </>
  )
}

export default CreateEventButton
