import { FC } from 'react'
import { SiMinutemailer } from 'react-icons/si'

interface IProps {
  email: any
  setShowForgotPassword: any
  setShowForgotPasswordConfirmation: any
}

const ForgotPasswordConfirmation: FC<IProps> = ({
  email,
  setShowForgotPassword,
  setShowForgotPasswordConfirmation,
}) => {
  const backToLogin = () => {
    setShowForgotPasswordConfirmation(false)
    setShowForgotPassword(false)
  }

  return (
    <div>
      <div className="mb-[25px]">
        <div className="text-center flex flex-col justify-center">
          <h1 className="text-xl md:text-3xl font-bold leading-tight mt-12">
            Nearly done!
          </h1>
          <div className="flex justify-center">
            <SiMinutemailer size={80} />
          </div>
        </div>

        <div className="mt-[5px]">
          <p>
            We've sent an email to <span className="font-bold">{email}</span>.
          </p>
          <p>Please follow the link in the email to reset your password.</p>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block capitalize px-4 py-3"
        onClick={() => backToLogin()}
      >
        Back to login
      </button>

      <p className="mt-[25px] text-[14px]">
        Try checking your spam or junk folder. If you're still having trouble,
        please contact us.
      </p>
    </div>
  )
}

export default ForgotPasswordConfirmation
