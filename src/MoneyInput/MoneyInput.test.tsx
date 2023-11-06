import { describe, it, test, expect } from 'vitest'
import {
  convertToCents,
  formatDisplayValue,
  getGroupSeparator,
  isInputInvalid,
  isNotLeadingDecimalSeparator,
  replaceLeadingDecimalSeparator,
} from './utils'

describe.skip('<MoneyInput />', () => {
  it('should add leading zero, when first character is decimal separator')
  it('should not allow more than two decimal digits')
  it('should ammend to two decimals, when necessary')
  it('should not allow non-allowed characters')
  it('should call onChange with value in Cents, when input value is changed')
  it('should log value in Cents, when input value is changed')
  it('should call onBlur with value in Cents, when input value is changed')
  it('should log value in Cents, when usrs clicks outside the input')

  describe('English locale', () => {
    it('shoud properly format input value when user clicks outside the input field')
    it('should correct input decimals according to English locale')
    it('should remove group separators when in focus')
  })

  describe('German locale', () => {
    it('shoud properly format input value when user clicks outside the input field')
    it('should correct input decimals according to German locale')
    it('should remove group separators when in focus')
  })
})

describe('isNotValidInput', () => {
  test.each([
    ['987', false],
    ['1', false],
    ['654.23', false],
    ['954,13', false],
    ['99s', true],
    ['1234/', true],
  ])('%s should return %s', (input: string, expected: boolean) => {
    const result = isInputInvalid(input)
    expect(result).toBe(expected)
  })
})

describe('isNotLeadingDecimalSeparator', () => {
  it('should return false when the input does start with a comma or dot', () => {
    const result = isNotLeadingDecimalSeparator(',')
    expect(result).toEqual(false)
  })
  it('should return true when the input does not start with a comma or dot', () => {
    const result = isNotLeadingDecimalSeparator('1,1')
    expect(result).toEqual(true)
  })
})

describe('formatDisplayValue', () => {
  it('should format the input according to English locale', () => {
    const formattedValue = formatDisplayValue('123456,45', 'en')
    expect(formattedValue).toEqual('123,456.45')
  })
  it('should format the input according to German locale', () => {
    const formattedValue = formatDisplayValue('123456.45', 'de')
    expect(formattedValue).toEqual('123.456,45')
  })
  it('should add a trailing zero, when input has only one decimal', () => {
    const formattedValue = formatDisplayValue('123456.4', 'en')
    expect(formattedValue).toEqual('123,456.40')
  })
})

describe('replaceLeadingDecimalSeparator', () => {
  it('should ammend leading decimal separator with a 0', () => {
    const result = replaceLeadingDecimalSeparator(',')
    expect(result).toEqual('0,')
  })
  it('should not change input, when it starts with a decimal', () => {
    const result = replaceLeadingDecimalSeparator('0,')
    expect(result).toEqual('0,')
  })
})

describe('convertToCents', () => {
  it('should convert input string (Euro) to integer (Cents)', () => {
    const result = convertToCents('123,45')
    expect(result).toEqual(12345)
  })

  it('should handle floating-point precision issues by rounding the result', () => {
    const result = convertToCents('0.56')
    expect(result).toEqual(56)
  })
})

describe('getGroupSeparator', () => {
  test.each([
    ['German', 'de', '.'],
    ['English', 'en', ','],
    ['undefined', 'invalid', ','],
  ])('should return appropriate group separator for %s locale', (_string: string, locale: string, expected: string) => {
    const result = getGroupSeparator(locale)
    expect(result).toEqual(expected)
  })
})
