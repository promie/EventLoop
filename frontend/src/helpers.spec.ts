import {
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
  getInitialsFromName,
  wholeNumberRating,
} from './helpers'

describe('Helper functions', () => {
  describe('#numberWithCommas', () => {
    it('should return the correctly formatted number with a comma separated of 1000 to 1,000', () => {
      // arrange
      const input = 1000
      const expected = '1,000'

      // act
      const fn = numberWithCommas(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return the correctly formatted number with a comma separated of 55000 to 55,000', () => {
      // arrange
      const input = 55000
      const expected = '55,000'

      // act
      const fn = numberWithCommas(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return the correctly formatted number with a comma separated of 150000 to 150,000', () => {
      // arrange
      const input = 150000
      const expected = '150,000'

      // act
      const fn = numberWithCommas(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return the correctly formatted number with a comma separated of 1000000 to 1,000,000', () => {
      // arrange
      const input = 1000000
      const expected = '1,000,000'

      // act
      const fn = numberWithCommas(input)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#dollarValueFormat', () => {
    it('should correct return the dollar formatted value of 5000 to $5,000.00', () => {
      // arrange
      const input = 5000
      const expected = '$5,000.00'

      // act
      const fn = dollarValueFormat(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should correct return the dollar formatted value of 500.50 to $500.50', () => {
      // arrange
      const input = 500.5
      const expected = '$500.50'

      // act
      const fn = dollarValueFormat(input)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#convertAge', () => {
    it('should return "No Age Restriction" if the passed in is 0 as a number', () => {
      // arrange
      const input = 0
      const expected = 'No Age Restriction'

      // act
      const fn = convertAge(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return "No Age Restriction" if the passed in is 0 as a string', () => {
      // arrange
      const input = '0'
      const expected = 'No Age Restriction'

      // act
      const fn = convertAge(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return "18+" if the passed in is 18 as a number', () => {
      // arrange
      const input = 18
      const expected = '18+'

      // act
      const fn = convertAge(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return "22+" if the passed in is 18 as a string', () => {
      // arrange
      const input = '18'
      const expected = '18+'

      // act
      const fn = convertAge(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return "22+" if the passed in is 22 as a number', () => {
      // arrange
      const input = 22
      const expected = '22+'

      // act
      const fn = convertAge(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return "22+" if the passed in is 22 as a string', () => {
      // arrange
      const input = '22'
      const expected = '22+'

      // act
      const fn = convertAge(input)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#formatDateTime', () => {
    it('should correct formats the date time to Thu, 01 Dec 2022 4:00 PM when the following input 2022-12-01T16:00:00 is passed in', () => {
      // arrange
      const input = '2022-12-01T16:00:00'
      const expected = 'Thu, 01 Dec 2022 4:00 PM'

      // act
      const fn = formatDateTime(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should correct formats the date time to Fri, 30 Dec 2022 8:00 AM when the following input 2022-12-30T08:00:00 is passed in', () => {
      // arrange
      const input = '2022-12-30T08:00:00'
      const expected = 'Fri, 30 Dec 2022 8:00 AM'

      // act
      const fn = formatDateTime(input)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#formatDate', () => {
    it('should correct returns the formatted date in a format of DD MMM YYYY and strips out of the time 2022-12-01T16:00:00 => 01 Dec 2022', () => {
      // arrange
      const input = '2022-12-01T16:00:00'
      const expected = '01 Dec 2022'

      // act
      const fn = formatDate(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should correct returns the formatted date in a format of DD MMM YYYY and strips out of the time 2022-12-30T08:00:00 => 30 Dec 2022', () => {
      // arrange
      const input = '2022-12-30T08:00:00'
      const expected = '30 Dec 2022'

      // act
      const fn = formatDate(input)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#getMonthFromDateTime', () => {
    it('should correct returns just the month from the input datetime string 2022-12-01T16:00:00 => DEC', () => {
      // arrange
      const input = '2022-12-01T16:00:00'
      const expected = 'DEC'

      // act
      const fn = getMonthFromDateTime(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should correct returns just the month from the input datetime string 2023-01-01T16:00:00 => JAN', () => {
      // arrange
      const input = '2023-01-01T16:00:00'
      const expected = 'JAN'

      // act
      const fn = getMonthFromDateTime(input)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#getDayOfYearFromDateTime', () => {
    it('should correct returns just the day from the input datetime string 2022-12-15T16:00:00 => 15', () => {
      // arrange
      const input = '2022-12-15T16:00:00'
      const expected = '15'

      // act
      const fn = getDayOfYearFromDateTime(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should correct returns just the day from the input datetime string 2023-01-01T16:00:00 => 1', () => {
      // arrange
      const input = '2023-01-01T16:00:00'
      const expected = '1'

      // act
      const fn = getDayOfYearFromDateTime(input)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#renameKeys', () => {
    it('should rename the keys as specified in the keysMap object', () => {
      // arrange
      const keysMap = {
        telephoneNumber: 'telephone_number',
        ticketPrices: 'ticket_prices',
      }

      const resObj = {
        telephoneNumber: '0411999555',
        ticketPrices: '$500',
      }

      const expected = {
        telephone_number: '0411999555',
        ticket_prices: '$500',
      }

      // act
      const fn = renameKeys(keysMap, resObj)

      expect(fn).toEqual(expected)
    })
  })

  describe('#coordinatesConversionToObj', () => {
    it('should correct converts the gps_coord string to a lat lng object "lat: -33.8771118, lng: 151.2114875" => { lat: -33.8771118, lng: 151.2114875 }', () => {
      // arrange
      const input = 'lat: -33.8771118, lng: 151.2114875'
      const expected = { lat: -33.8771118, lng: 151.2114875 }

      // act
      const fn = coordinatesConversionToObj(input)

      expect(fn).toEqual(expected)
    })
  })

  describe('#getTicketPriceRanges', () => {
    it('should return the minimum and maximum price from the tickets array and format it nicely for the price ranges => $90.00 - $1,000.00', () => {
      // arrange
      const input = [
        { ticket_type: 'VIP', total_number: 100, price: 1000 },
        { ticket_type: 'Gold', total_number: 200, price: 800 },
        { ticket_type: 'Silver', total_number: 300, price: 500 },
        { ticket_type: 'General', total_number: 500, price: 200 },
        { ticket_type: 'Standing', total_number: 150, price: 90 },
      ]

      const expected = '$90.00 - $1,000.00'

      // act
      const fn = getTicketPriceRanges(input)

      expect(fn).toBe(expected)
    })
  })

  describe('#getTicketPriceRangesForPublish', () => {
    it('should return the minimum and maximum price from the tickets array and format it nicely for the price ranges => $40.00 - $1,000.00', () => {
      // arrange
      const input = [
        { ticket_type: 'VIP', total_number: 100, ticketPrice: 5000 },
        { ticket_type: 'Gold', total_number: 200, ticketPrice: 800 },
        { ticket_type: 'Silver', total_number: 300, ticketPrice: 500 },
        { ticket_type: 'General', total_number: 500, ticketPrice: 200 },
        { ticket_type: 'Standing', total_number: 150, ticketPrice: 40 },
      ]

      const expected = '$40.00 - $5,000.00'

      // act
      const fn = getTicketPriceRangesForPublish(input)

      expect(fn).toBe(expected)
    })
  })

  describe('#getInitialsFromName', () => {
    it('should correct gets the initial from the first and last name of logged in user Promie Yutasane => PY', () => {
      // arrange
      const inputFirstName = 'Promie'
      const inputLastName = 'Yutasane'
      const expected = 'PY'

      // act
      const fn = getInitialsFromName(inputFirstName, inputLastName)

      expect(fn).toBe(expected)
    })

    it('should correct gets the initial from the first and last name of logged in user Vu Ho => VH', () => {
      // arrange
      const inputFirstName = 'Vu'
      const inputLastName = 'Ho'
      const expected = 'VH'

      // act
      const fn = getInitialsFromName(inputFirstName, inputLastName)

      expect(fn).toBe(expected)
    })

    it('should correct gets the initial from the first and last name of logged in user Rudra Jikadra => RJ', () => {
      // arrange
      const inputFirstName = 'Rudra'
      const inputLastName = 'Jikadra'
      const expected = 'RJ'

      // act
      const fn = getInitialsFromName(inputFirstName, inputLastName)

      // assert
      expect(fn).toBe(expected)
    })

    it('should correct gets the initial from the first and last name of logged in user Shridhar Prabhuraman => SP', () => {
      // arrange
      const inputFirstName = 'Shridhar'
      const inputLastName = 'Prabhuraman'
      const expected = 'SP'

      // act
      const fn = getInitialsFromName(inputFirstName, inputLastName)

      // assert
      expect(fn).toBe(expected)
    })

    it('should correct gets the initial from the first and last name of logged in user Vibhu Sharma => VS', () => {
      // arrange
      const inputFirstName = 'Vibhu'
      const inputLastName = 'Sharma'
      const expected = 'VS'

      // act
      const fn = getInitialsFromName(inputFirstName, inputLastName)

      // assert
      expect(fn).toBe(expected)
    })
  })

  describe('#wholeNumberRating', () => {
    it('should return the whole number for the rating 3.222222222223 => 3', () => {
      // arrange
      const input = 3.222222222223
      const expected = '3'

      // act
      const fn = wholeNumberRating(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return the whole number for the rating 95.555555 => 96', () => {
      // arrange
      const input = 95.555555
      const expected = '96'

      // act
      const fn = wholeNumberRating(input)

      // assert
      expect(fn).toBe(expected)
    })

    it('should return the whole number for the rating 30.499999 => 30', () => {
      // arrange
      const input = 30.499999
      const expected = '30'

      // act
      const fn = wholeNumberRating(input)

      // assert
      expect(fn).toBe(expected)
    })
  })
})
