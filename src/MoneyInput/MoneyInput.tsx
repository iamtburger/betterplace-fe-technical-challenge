import { useEffect, useMemo, useState } from 'react'
import _styles from './MoneyInput.module.css'

// TODO: Clean up
const CENT_MULTIPLIER = 100
const localeMap = {
  en: {
    decimal: '.',
    separator: ',',
    code: 'en',
  },
  de: {
    decimal: ',',
    separator: '.',
    code: 'de',
  },
}

// TODO: fix types
type MoneyInputProps = {
  value: number
  onChange: (value: string | number) => void
  onBlur?: (value: string | number) => void
  onFocus?: (value: string | number) => void
  locale: string
  id: string
  label: string
} & React.HTMLAttributes<HTMLInputElement>

// [x] When the user is typing it should display the actual value
// [x] Max 2 digits -> if user tries to type more, cut it
// [x] If user enters only one digit, add a 0 to the end
// [x] If the user uses eitehr . , format it to the correct decimal
// [x] If the user starts with a decimal separator, add a 0 to the beginning
// [x] If the user tries to enter something other than the allowed characters, return

export default function MoneyInput({
  value,
  onChange,
  onBlur,
  onFocus,
  id,
  label,
  locale = 'de',
  ...restProps
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState('')

  const separator = useMemo(() => (localeMap as any)[locale].separator, [locale])

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNotValidInput(e.target.value) || maxDecimalReached(e.target.value)) {
      return
    }

    const sanitizedInputValue = replaceLeadingDecimalSeparator(e.target.value)

    // TODO: clean up
    const parsedInputValue = parseFloat(sanitizedInputValue.replace(',', '.'))
    if (e.target.value === '') {
      onChange(0)
      console.log(0)
    }

    const inputInCents = CENT_MULTIPLIER * parsedInputValue
    onChange(inputInCents)
    console.log(inputInCents)

    setDisplayValue(sanitizedInputValue)
  }

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e.target.value)
    }

    const formattedInputValue = formatDisplayValue(e.target.value, locale)
    setDisplayValue(formattedInputValue)
  }

  const handleOnFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(e.target.value)
    }
    const sanitizedInputValue = e.target.value.replaceAll(separator, '')
    setDisplayValue(sanitizedInputValue)
  }

  useEffect(() => {
    if (value !== undefined) {
      const formattedInputValue = formatDisplayValue(String(value), locale)
      setDisplayValue(formattedInputValue)
    }
  }, [])

  const showLabel = label !== undefined

  // TODO: pass down classNames to container and / or input
  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <div className="">
        <input
          id={id}
          value={displayValue}
          onChange={handleOnInputChange}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          lang={locale}
          {...restProps}
        />
      </div>
    </div>
  )
}

function isNotValidInput(str: string) {
  return !/^[\d,.]+$/.test(str) && str !== ''
}

function maxDecimalReached(str: string) {
  const decimalPart = str.split(/[,.]/)
  return (decimalPart[1]?.length ?? 0) > 2 || decimalPart.length > 2
}

const formatDisplayValue = (value: string, localeCode: string) => {
  const sanitizedInputValue = value.replaceAll(',', '.')
  const decimals = sanitizedInputValue.split('.')
  const shouldAmendDecimals = (decimals[1]?.length ?? 0) === 1
  return sanitizedInputValue.length > 0
    ? Number(sanitizedInputValue).toLocaleString(localeCode, { minimumFractionDigits: shouldAmendDecimals ? 2 : 0 })
    : ''
}

function replaceLeadingDecimalSeparator(input: string) {
  return input.replace(/^([,.]{1,1})/, '0$1')
}

// The user can input a decimal number (in Euro).
// On change the component will convert the value to integer (in Cents) and emit new value by running the appropriate handler and log the new value in console.
// On blur the component will convert the value to integer (in Cents) and emit new value by running the appropriate handler and log the new value in console.
// Whenever a new value is provided (integer, in Cents) through the value prop, the value of the input field will be updated with the new decimal number (in Euro).
// The component looks similar to the design in the screenshot below.
// Bonus: The component is documented in Storybook.
// Bonus: The component's interface besides the changes stemming from the functionality described above is identical to the interface of the HTML input element.

// Suppose that the component gets a locale passed as a prop (e.g. en or de), that you can use to format the string.
// You may use the tokens provided in tokens.css to style the component.
// The code should be placed in the src/MoneyInput directory, there is some boilerplate code there created for your convenience.
