import { createTheme } from '@mui/material'

const SomenergiaTheme = createTheme({
  palette: {
    text: {
      primary: '#4d4d4d',
    },
    primary: {
      main: '#BAC92A',
    },
    secondary: {
      main: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover, &:focus': {
            outline: 'none',
            border: 0,
          },
          fontFamily: 'Roboto, sans-serif',
          borderRadius: 0,
          textTransform: 'none',
          lineHeight: '1.4em',
          border: 0,
        },
      },
    },
  },
})

export default SomenergiaTheme
