import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getGroupSeparator,
  isInputInvalid,
  isNotLeadingDecimalSeparator,
  replaceLeadingDecimalSeparator,
  convertToCents,
  formatDisplayValue,
} from './utils'
import _styles from './MoneyInput.module.css'

type MoneyInputProps = {
  value: number
  onChange: (value: number) => void
  onBlur?: (value: number) => void
  locale?: string
  id?: string
  label?: string
  disabled?: boolean
  error?: boolean
  cssModule?: { container?: string; input?: string; label?: string }
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
  cssModule = { container: '', input: '', label: '' },
  ...restProps
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState('')

  const separator = useMemo(() => getGroupSeparator(locale), [locale])

  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isInputInvalid(e.target.value) && isNotLeadingDecimalSeparator(e.target.value)) {
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
    },
    [onChange, setDisplayValue]
  )

  const handleOnBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
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
    },
    [onChange, setDisplayValue, onBlur]
  )

  const handleOnFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      if (onFocus) {
        onFocus(e)
      }
      const sanitizedInputValue = e.target.value.replaceAll(separator, '')
      setDisplayValue(sanitizedInputValue)
    },
    [onFocus, setDisplayValue]
  )

  useEffect(() => {
    const valueInCents = convertToCents(displayValue)
    if (value !== undefined && value !== valueInCents) {
      const formattedInputValue = formatDisplayValue(String(value / 100), locale)
      console.log(value)
      setDisplayValue(formattedInputValue)
    }
  }, [value])

  const showLabel = label !== undefined
  const errorState = error ? _styles['input-error'] : ''
  const disabledState = disabled ? _styles['input-disabled'] : ''

  return (
    <div className={`${_styles['money-input-container']} ${cssModule.container}`}>
      {showLabel && (
        <label htmlFor={id} className={`${_styles['input-label']} ${cssModule.label}`}>
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
