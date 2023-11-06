const CENT_MULTIPLIER = 100

export function isInputInvalid(str: string) {
  return !/^\d+[,.]?\d{0,2}$|^$/.test(str)
}

export function isNotLeadingDecimalSeparator(str: string) {
  return !/^[,.]/.test(str)
}

export const formatDisplayValue = (value: string, localeCode: string) => {
  const sanitizedInputValue = value.replaceAll(',', '.')
  const isDecimal = /[.,]\d{0,2}$/.test(sanitizedInputValue)
  return sanitizedInputValue.length > 0 && parseFloat(sanitizedInputValue) !== 0
    ? Number(sanitizedInputValue).toLocaleString(localeCode, { minimumFractionDigits: isDecimal ? 2 : 0 })
    : ''
}

export function replaceLeadingDecimalSeparator(input: string) {
  return input.replace(/^([,.]{1,1})/, '0$1')
}

export function convertToCents(value: string) {
  const parsedInputValue = parseFloat(value.replace(',', '.'))
  return Math.round(CENT_MULTIPLIER * parsedInputValue)
}

export function getGroupSeparator(locale: string = 'en') {
  const numberWithGroupAndDecimalSeparator = 1000.1
  const groupSeparator = Intl.NumberFormat(locale)
    .formatToParts(numberWithGroupAndDecimalSeparator)
    .find((part) => part.type === 'group')?.value

  return groupSeparator ? groupSeparator : ','
}
