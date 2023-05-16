import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import Copyright from '../../components/Copyright'
import EmailRegisterForm from '../../components/EmailRegisterForm'
import AccountExistNotification from '../../components/AccountExistNotification'
import RegisterForm from '../../components/RegisterForm'
import Logo from '../../components/Logo'

/*
  Register Form component
 */

const Register: FC = () => {
  const [accountExist, setAccountExist] = useState<boolean>(false)
  const [registeredEmailAddress, setRegisteredEmailAddress] =
    useState<string>('')
  const [displaySignUpForm, setDisplaySignUpForm] = useState<boolean>(false)

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-blue-600 hidden lg:block w-full wd:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://images.unsplash.com/photo-1638132704795-6bb223151bf7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
          className="object-cover h-screen"
          alt="login event"
        />
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl font-bold ml-[-15px]">
            <Logo />
          </h1>
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Create your account
          </h1>

          {/*Show the AccountExistNotification if the account already exists*/}
          {accountExist && !displaySignUpForm && (
            <AccountExistNotification
              registeredEmailAddress={registeredEmailAddress}
            />
          )}

          {/*Pre-check to see whether the email already exists otherwise we will redirect the user back to login instead*/}
          {!displaySignUpForm && (
            <EmailRegisterForm
              setAccountExist={setAccountExist}
              setRegisteredEmailAddress={setRegisteredEmailAddress}
              setDisplaySignUpForm={setDisplaySignUpForm}
            />
          )}

          {/*Display the register forms if the user enters the email address that has not been associated*/}
          {displaySignUpForm && !accountExist && registeredEmailAddress && (
            <RegisterForm registeredEmailAddress={registeredEmailAddress} />
          )}

          <hr className="my-6 border-gray-300 w-full" />

          <p className="mt-8">
            Already have an account?{' '}
            <Link to={'/login'} className="text-[#38b6ff] font-semibold">
              Login
            </Link>
          </p>

          <Copyright />
        </div>
      </div>
    </section>
  )
}

export default Register
