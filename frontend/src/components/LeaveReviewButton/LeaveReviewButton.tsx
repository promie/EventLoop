import { FC, useState } from 'react'
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'
import ReviewIcon from '../../assets/review.png'
import LeaveReviewCard from '../LeaveReviewCard'

interface IProps {
  eventId: number
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '550px',
  },
  overlay: {
    background: 'rgba(56, 182, 255, 0.4)',
    zIndex: 1000,
  },
}

const LeaveReviewButton: FC<IProps> = ({ eventId }) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <span>
        <img
          src={ReviewIcon}
          alt="review icon"
          className="w-[190px] cursor-pointer"
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
          <LeaveReviewCard eventId={eventId} closeModal={closeModal} />
        </div>
      </Modal>
    </>
  )
}

export default LeaveReviewButton
