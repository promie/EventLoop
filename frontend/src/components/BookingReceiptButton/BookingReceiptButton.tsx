import { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { TbReceipt2 } from 'react-icons/tb'
import { AiOutlineClose } from 'react-icons/ai'
import { getBookingReceiptInfoByBookingId } from '../../features/user/userAction'
import ReceiptInfo from '../ReceiptInfo'

interface IProps {
  bookingId: any
  startDateTime: any
  showCancellationPolicy?: any
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

const BookingReceiptButton: FC<IProps> = ({
  bookingId,
  startDateTime,
  showCancellationPolicy = false,
}) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)
  const [receiptInfo, setReceiptInfo] = useState<any>()
  const dispatch = useDispatch()

  const { customerUpcomingBookings } = useSelector((store: any) => store.user)

  useEffect(() => {
    const getReceiptInfo = async () => {
      const data = await dispatch(
        // @ts-ignore
        getBookingReceiptInfoByBookingId({ bookingId }),
      )

      setReceiptInfo(data.payload)
    }

    getReceiptInfo()
  }, [customerUpcomingBookings])

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
        data-tip="View receipt details for this booking"
      >
        <TbReceipt2
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
          <ReceiptInfo
            receiptInfo={receiptInfo}
            startDateTime={startDateTime}
            showCancellationPolicy={showCancellationPolicy}
            closeModal={closeModal}
          />
        </div>
      </Modal>
    </>
  )
}

export default BookingReceiptButton
