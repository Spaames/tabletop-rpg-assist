import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

//for dark mode by default
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const theme = extendTheme({ config })

export default theme