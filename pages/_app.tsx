// import App from "next/app";
import { cache, css } from '@emotion/css'
import { CacheProvider, Global } from '@emotion/react'
import type { AppProps /*, AppContext */ } from 'next/app'
import { GlobalStyles } from 'twin.macro'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <CacheProvider value={cache}>
    <GlobalStyles />
    <Global
      styles={css`
        #wave-canvas {
          width: 700px;
          height: 700px;
        }
      `}
    />
    <Component {...pageProps} />
  </CacheProvider>
)

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
