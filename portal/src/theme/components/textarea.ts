import {
  mode,
  Props,
  getColor,
  StyleObject,
} from "@chakra-ui/theme-tools"
import Input, { InputSizes, InputTheme, InputVariants } from "./input"

// CUSTOM

export interface InputProps {
  focusBorderColor?: string
  errorBorderColor?: string
}

type VariantProps = Props & Required<InputProps>

const getDefaults = (props: VariantProps) => ({
  focusBorderColor:
    props.focusBorderColor || mode("blue.500", "blue.300")(props),
  errorBorderColor: props.errorBorderColor || mode("red.500", "red.300")(props),
})

function getOutlineStyle(props: VariantProps): StyleObject {
  const { theme: t } = props
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props)

  return {
    border: "1px solid",
    borderColor: mode("inherit", "whiteAlpha.50")(props),
    bg: mode("white", "whiteAlpha.100")(props),
    _hover: {
      borderColor: mode("gray.300", "whiteAlpha.200")(props),
    },
    // _disabled: {
    //   opacity: 0.4,
    //   cursor: "not-allowed",
    // },
    _focus: {
      zIndex: 1,
      borderColor: getColor(t, fc),
      boxShadow: `0 0 0 1px ${getColor(t, fc)}`,
    },
    _invalid: {
      borderColor: getColor(t, ec),
      boxShadow: `0 0 0 1px ${getColor(t, ec)}`,
    },
  }
}

//CUSTOM-END

const Textarea: InputTheme = {
  ...Input,
  baseStyle: {
    ...Input.baseStyle,
    paddingY: "8px",
    minHeight: "80px",
    lineHeight: "short",
  },
  variants: {
    outline: getOutlineStyle
  },
}

export const TextareaVariants = InputVariants
export const TextareaSizes = InputSizes

export default Textarea
