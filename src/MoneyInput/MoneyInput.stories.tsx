import React from 'react'
import { Meta } from '@storybook/react'
import MoneyInput from './MoneyInput'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/MoneyInput',
  component: MoneyInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof MoneyInput>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {}

export const Template = (args: any) => {
  const [value, setValue] = React.useState(undefined)
  return <MoneyInput {...args} value={value} onChange={setValue} />
}
