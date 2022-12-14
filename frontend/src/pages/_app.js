// i18n
import '../locales/i18n'

// highlight
import '../utils/highlight'

// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

// map
import 'mapbox-gl/dist/mapbox-gl.css'

// editor
import 'react-quill/dist/quill.snow.css'

// slick-carousel
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'react-lazy-load-image-component/src/effects/black-and-white.css'

// fullcalendar
import '@fullcalendar/common/main.min.css'
import '@fullcalendar/daygrid/main.min.css'

import PropTypes from 'prop-types'
import cookie from 'cookie'
// next
import Head from 'next/head'
import App from 'next/app'
//
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
// @mui
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
// redux
import { store, persistor } from 'src/redux/store'
import { useDispatch, useSelector } from 'src/redux/store'
// utils
import { getSettings } from 'src/utils/settings'
// contexts
import { SettingsProvider } from 'src/contexts/SettingsContext'
import { CollapseDrawerProvider } from 'src/contexts/CollapseDrawerContext'
// theme
import ThemeProvider from 'src/theme'
// components
import Settings from 'src/components/settings'
import { ChartStyle } from 'src/components/chart'
import RtlLayout from 'src/components/RtlLayout'
import ProgressBar from 'src/components/ProgressBar'
import ThemeColorPresets from 'src/components/ThemeColorPresets'
import NotistackProvider from 'src/components/NotistackProvider'
import ThemeLocalization from 'src/components/ThemeLocalization'
import MotionLazyContainer from 'src/components/animate/MotionLazyContainer'
// import ConfirmCodeDialog from 'src/sections/auth/register/ConfirmCodeDialog'
// hooks

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import { AuthProvider } from 'src/contexts/JWTContext'
import { QueryClient, QueryClientProvider } from 'react-query'
// import { AuthProvider } from 'src/contexts/Auth0Context';
// import { AuthProvider } from 'src/contexts/FirebaseContext';
// import { AuthProvider } from 'src/contexts/AwsCognitoContext'

// ----------------------------------------------------------------------

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  settings: PropTypes.object,
}

export function GlobalDialogs() {
  // const { openCodeConfirmationDialog, setOpenCodeConfirmationDialog } = useAuth()
  // const { subscriptions } = useSelector((state) => state.user)

  return (
    <>
      {/* <ConfirmCodeDialog open={openCodeConfirmationDialog} onClose={() => setOpenCodeConfirmationDialog(false)} /> */}
    </>
  )
}
export default function MyApp(props) {
  const { Component, pageProps, settings } = props

  const getLayout = Component.getLayout ?? ((page) => page)

  const queryClient = new QueryClient({
    // ? APP BY DEFAULT CONFIGURATION (AS ONE TIME FETCHING)
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        refetchOnReconnect: false,
        // refetchOnmount: false,
        // staleTime: twentyFourHoursInMs,
      },
    },
  })

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CollapseDrawerProvider>
                  <SettingsProvider defaultSettings={settings}>
                    <ThemeProvider>
                      <NotistackProvider>
                        <MotionLazyContainer>
                          <ThemeColorPresets>
                            <ThemeLocalization>
                              <RtlLayout>
                                <ChartStyle />
                                <Settings />
                                <ProgressBar />
                                <GlobalDialogs />
                                {getLayout(<Component {...pageProps} />)}
                              </RtlLayout>
                            </ThemeLocalization>
                          </ThemeColorPresets>
                        </MotionLazyContainer>
                      </NotistackProvider>
                    </ThemeProvider>
                  </SettingsProvider>
                </CollapseDrawerProvider>
              </LocalizationProvider>
            </AuthProvider>
          </PersistGate>
        </ReduxProvider>
      </QueryClientProvider>
    </>
  )
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context)

  const cookies = cookie.parse(context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie)

  const settings = getSettings(cookies)

  return {
    ...appProps,
    settings,
  }
}
