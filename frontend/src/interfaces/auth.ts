export interface ILogin {
  email: string
  password: string
}

interface ICoordinates {
  lat: number
  lng: number
}

interface IAddress {
  address: string
  coordinates: ICoordinates
}

export interface IRegister {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: Date
  billingAddress: IAddress
  password: string
}

export interface IStateInitial {
  loading: boolean
  userId: number | string | null
  token: string | null
  error: any
  success: boolean
  pageLoad: boolean
}
