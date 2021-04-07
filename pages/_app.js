import { createGlobalStyle, ThemeProvider } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body, html, #__next {
    margin: 0;
    padding: 0;
    font-size: 20px;
  }

  body {
    box-sizing: border-box;
  }

  #__next {
    max-height: 100%;
    background-color: #eee;
  }

  @media only screen and (max-width: 400px) {
    #__next {
      font-size: 5vw;
    }
  }
`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
