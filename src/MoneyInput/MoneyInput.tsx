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
  locale = 'de',
  disabled = false,
  error = false,
  cssModule = { container: '', input: '' },
  ...restProps
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState('')

  const separator = useMemo(() => (localeMap as any)[locale].separator, [locale])

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNotValidInput(e.target.value) || maxDecimalReached(e.target.value)) {
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
    const sanitizedInputValue = parseFloat(displayValue.replaceAll(',', '.')) * 100
    if (value !== undefined && value !== sanitizedInputValue) {
      const formattedInputValue = formatDisplayValue(String(value), locale)
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
  return sanitizedInputValue.length > 0 && parseFloat(sanitizedInputValue) !== 0
    ? Number(sanitizedInputValue).toLocaleString(localeCode, { minimumFractionDigits: shouldAmendDecimals ? 2 : 0 })
    : ''
}

function replaceLeadingDecimalSeparator(input: string) {
  return input.replace(/^([,.]{1,1})/, '0$1')
}

function convertToCents(value: string) {
  const parsedInputValue = parseFloat(value.replace(',', '.'))
  return CENT_MULTIPLIER * parsedInputValue
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
