import { FC, useState } from 'react'
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'
import Purchasers from '../Purchasers'

interface IProps {
  soldTickets: number
  totalTickets: number
  eventId: number
  eventTitle: string
  eventStartDateTime: any
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
    maxHeight: '90%',
  },
  overlay: {
    background: 'rgba(56, 182, 255, 0.4)',
    zIndex: 1000,
  },
}

const EventSoldDetails: FC<IProps> = ({
  soldTickets,
  totalTickets,
  eventId,
  eventTitle,
  eventStartDateTime,
}) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      {soldTickets > 0 && (
        <p
          className="cursor-pointer hover:underline tooltip tooltip-top"
          data-tip="View list of purchases by customers"
          onClick={() => openModal()}
        >
          {soldTickets}/{totalTickets}
        </p>
      )}

      {soldTickets === 0 && (
        <p
          className="tooltip tooltip-top"
          data-tip="No purchasers for this event"
        >
          {soldTickets}/{totalTickets}
        </p>
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
        <div className="mt-2">
          <Purchasers
            eventId={eventId}
            eventTitle={eventTitle}
            eventStartDateTime={eventStartDateTime}
          />
        </div>
      </Modal>
    </>
  )
}

export default EventSoldDetails
