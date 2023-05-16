import format from 'date-fns/format'

/*
  Please refer to the unit tests in the helpers.spec.ts to see the output of these helper functions
 */

const numberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const dollarValueFormat = (num: number) => {
  return Number(num).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

const convertAge = (age: string | number) => {
  let result = ''
  if (age === '0' || age === 0) {
    result = 'No Age Restriction'
  } else if (age === '18' || age === 18) {
    result = '18+'
  } else {
    result = '22+'
  }
  return result
}

const formatDateTime = (dateTimeString: string) => {
  if (dateTimeString) {
    return `${format(new Date(dateTimeString), 'ccc')}, ${format(
      new Date(dateTimeString),
      'dd MMM yyyy',
    )} ${format(new Date(dateTimeString), 'p')}`
  }
}

const formatDate = (dateTimeString: string) => {
  if (dateTimeString) {
    return `${format(new Date(dateTimeString), 'dd MMM yyyy')}`
  }
}

const getMonthFromDateTime = (dateTimeString: string) => {
  if (dateTimeString) {
    return `${format(new Date(dateTimeString), 'MMM')}`.toUpperCase()
  }
}

const getDayOfYearFromDateTime = (dateTimeString: string) => {
  if (dateTimeString) {
    return `${format(new Date(dateTimeString), 'd')}`
  }
}

const renameKeys = (keysMap: any, obj: any) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {},
  )

const coordinatesConversionToObj = (stringCoords: string) => {
  const coordinatesArr = stringCoords?.split(', ')?.map(str => str?.split(' '))

  if (coordinatesArr?.length) {
    return {
      lat: Number(coordinatesArr[0][1]),
      lng: Number(coordinatesArr[1][1]),
    }
  }
}

const getTicketPriceRanges = (tickets: any) => {
  let price = ''

  const pricesArray = tickets?.map((tix: any) => tix.price) || []

  if (pricesArray && pricesArray?.length === 1) {
    price = dollarValueFormat(pricesArray[0])
  } else {
    const minPrice = Math.min(...pricesArray)
    const maxPrice = Math.max(...pricesArray)

    price = `${dollarValueFormat(minPrice)} - ${dollarValueFormat(maxPrice)}`
  }

  return price
}

const getTicketPriceRangesForPublish = (tickets: any) => {
  let price = ''

  const pricesArray = tickets?.map((tix: any) => tix.ticketPrice) || []

  if (pricesArray && pricesArray?.length === 1) {
    price = dollarValueFormat(pricesArray[0])
  } else {
    const minPrice = Math.min(...pricesArray)
    const maxPrice = Math.max(...pricesArray)

    price = `${dollarValueFormat(minPrice)} - ${dollarValueFormat(maxPrice)}`
  }

  return price
}

const normaliseResponseObj = (response: any) => {
  if (response) {
    return Object.keys(response).reduce(
      (arr, key) => arr.concat(response[key]),
      [],
    )
  }
}

const getInitialsFromName = (firstName: string, lastName: string) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
}

const profileCompletionPercentage = (userInfoObj: any) => {
  const items = {
    first_name: userInfoObj?.first_name || '',
    last_name: userInfoObj?.last_name || '',
    birthday: userInfoObj?.birthday || '',
    gender: userInfoObj?.gender || '',
    photo_url: userInfoObj?.photo_url || '',
    billing_add: userInfoObj?.billing_add || '',
    billing_gps_coord: userInfoObj?.billing_gps_coord || '',
    home_add: userInfoObj?.home_add || '',
    home_gps_coord: userInfoObj?.home_gps_coord || '',
    about_me: userInfoObj?.about_me || '',
    phone: userInfoObj?.phone || '',
    website_url: userInfoObj?.website_url || '',
    interests: userInfoObj?.interests || '',
  }

  const objLen = Object.keys(items).length
  const keys = Object.keys(items)

  const filtered = keys.filter(function (key) {
    // @ts-ignore
    return items[key]
  }).length

  return `${((filtered / objLen) * 100).toFixed(2)}`
}

const wholeNumberRating = (rating: number) => {
  let res: any = 0

  if (rating) {
    res = rating.toFixed(0)
  }

  return res
}

export {
  numberWithCommas,
  dollarValueFormat,
  convertAge,
  formatDateTime,
  formatDate,
  getMonthFromDateTime,
  getDayOfYearFromDateTime,
  renameKeys,
  coordinatesConversionToObj,
  getTicketPriceRanges,
  getTicketPriceRangesForPublish,
  normaliseResponseObj,
  getInitialsFromName,
  profileCompletionPercentage,
  wholeNumberRating,
}
