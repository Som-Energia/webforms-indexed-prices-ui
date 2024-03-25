import { createTheme } from '@mui/material'

const SomenergiaTheme = createTheme({
  palette: {
    text: {
        primary: '#4d4d4d',
      },
    primary: {
      main: '#BAC92A',
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
          '@media (min-width: 600px)': {
            width: '150px',
            padding: '0.4em 0em 0.4em 0em',
          },
        },
      },
    },
  },
})

export default SomenergiaTheme
