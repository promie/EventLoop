import { FC, useState } from 'react'
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'
import TicketForm from '../TicketForm'

interface IProps {
  event: any
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '1200px',
    height: '780px',
  },
  overlay: {
    background: 'rgba(56, 182, 255, 1)',
    zIndex: 1000,
  },
}

const TicketButton: FC<IProps> = ({ event }) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <button
        className="w-[150px] btn btn-primary btn-block capitalize ml-2"
        onClick={() => openModal()}
        disabled={
          event?.status !== 'Ticket Available' && event?.status !== 'Postponed'
        }
      >
        Tickets
      </button>

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
          <TicketForm event={event} closeModal={closeModal} />
        </div>
      </Modal>
    </>
  )
}

export default TicketButton
