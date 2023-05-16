import { FC, useState } from 'react'
import Modal from 'react-modal'
import { FcRating } from 'react-icons/fc'
import { AiOutlineClose } from 'react-icons/ai'
import ReadCustomersReviews from '../ReadCustomersReviews'

interface IProps {
  eventId: any
  eventTitle: any
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
    width: '700px',
  },
  overlay: {
    background: 'rgba(56, 182, 255, 0.4)',
    zIndex: 1000,
  },
}

const ReadReviewsButton: FC<IProps> = ({
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
      <span
        className="tooltip tooltip-top"
        data-tip="Read reviews for this event"
      >
        <FcRating
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
        <div className="mt-2">
          <ReadCustomersReviews
            eventId={eventId}
            eventTitle={eventTitle}
            eventStartDateTime={eventStartDateTime}
          />
        </div>
      </Modal>
    </>
  )
}

export default ReadReviewsButton
