import { useEffect, useMemo, useState } from 'react'
import _styles from './MoneyInput.module.css'

const CENT_MULTIPLIER = 100

type MoneyInputProps = {
  value: number
  onChange: (value: number) => void
  onBlur?: (value: number) => void
  locale?: string
  id?: string
  label?: string
  disabled?: boolean
  error?: boolean
  cssModule?: { container: string; input: string }
} & React.HTMLAttributes<HTMLInputElement>

export default function MoneyInput({
  value,
  onChange,
  onBlur,
  onFocus,
  id,
  label,
  locale = 'en',
  disabled = false,
  error = false,
  cssModule = { container: '', input: '' },
  ...restProps
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState('')
  console.log(locale)

  const separator = useMemo(() => getGroupSeparator(locale), [locale])

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNotValidInput(e.target.value) && isNotLeadingDecimalSeparator(e.target.value)) {
      return
    }

    if (e.target.value === '') {
      onChange(0)
      console.log(0)
      setDisplayValue('')
    } else {
      const sanitizedInputValue = replaceLeadingDecimalSeparator(e.target.value)
      const inputInCents = convertToCents(sanitizedInputValue)
      onChange(inputInCents)
      console.log(inputInCents)
      setDisplayValue(sanitizedInputValue)
    }
  }

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const inputInCents = convertToCents(e.target.value)
    if (onBlur) {
      onBlur(inputInCents)
    }
    if (e.target.value === '') {
      onChange(0)
      console.log(0)
      setDisplayValue('')
    } else {
      onChange(inputInCents)
      console.log(inputInCents)
      const formattedInputValue = formatDisplayValue(e.target.value, locale)
      setDisplayValue(formattedInputValue)
    }
  }

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (onFocus) {
      onFocus(e)
    }
    const sanitizedInputValue = e.target.value.replaceAll(separator, '')
    setDisplayValue(sanitizedInputValue)
  }

  useEffect(() => {
    const valueInCents = convertToCents(displayValue)
    if (value !== undefined && value !== valueInCents) {
      const formattedInputValue = formatDisplayValue(String(value / 100), locale)
      setDisplayValue(formattedInputValue)
    }
  }, [value])

  const showLabel = label !== undefined
  const errorState = error ? _styles['input-error'] : ''
  const disabledState = disabled ? _styles['input-disabled'] : ''

  return (
    <div className={`${_styles['money-input-container']} ${cssModule.container}`}>
      {showLabel && (
        <label htmlFor={id} className={_styles['input-label']}>
          {label}
        </label>
      )}
      <div>
        <input
          id={id}
          value={displayValue}
          onChange={handleOnInputChange}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          lang={locale}
          disabled={disabled}
          className={`${errorState} ${disabledState} ${cssModule.input}`}
          {...restProps}
        />
        <span className={_styles['currency-symbol']}>&#8364;</span>
      </div>
    </div>
  )
}

function isNotValidInput(str: string) {
  return !/^\d+[,.]?\d{0,2}$|^$/.test(str)
}

function isNotLeadingDecimalSeparator(str: string) {
  return !/^[,.]/.test(str)
}

const formatDisplayValue = (value: string, localeCode: string) => {
  const sanitizedInputValue = value.replaceAll(',', '.')
  const isDecimal = /[.,]\d{0,2}$/.test(sanitizedInputValue)
  return sanitizedInputValue.length > 0 && parseFloat(sanitizedInputValue) !== 0
    ? Number(sanitizedInputValue).toLocaleString(localeCode, { minimumFractionDigits: isDecimal ? 2 : 0 })
    : ''
}

function replaceLeadingDecimalSeparator(input: string) {
  return input.replace(/^([,.]{1,1})/, '0$1')
}

function convertToCents(value: string) {
  const parsedInputValue = parseFloat(value.replace(',', '.'))
  return CENT_MULTIPLIER * parsedInputValue
}

function getGroupSeparator(locale: string = 'en') {
  const numberWithGroupAndDecimalSeparator = 1000.1
  const groupSeparator = Intl.NumberFormat(locale)
    .formatToParts(numberWithGroupAndDecimalSeparator)
    .find((part) => part.type === 'group')?.value

  return groupSeparator ? groupSeparator : ','
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
