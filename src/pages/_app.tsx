import { UserPermissionEvent, UserScope } from '@alienbackoffice/back-front';
import { CacheProvider, EmotionCache } from '@emotion/react';
import '@fullcalendar/common/main.css';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LicenseInfo } from '@mui/x-license-pro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'chart.js/auto';
import { getCookie } from 'cookies-next';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import {
   saveBackButton,
   saveBackHistory,
   selectAuthCOmpleteInit,
   selectAuthCoreIdRealTime,
   selectAuthStartCoreMessages,
} from 'redux/authSlice';
import { fetchLicenseKey } from 'services';
import { handleRouteChangeAuth, redirectToLogin } from 'services/helper';
import { hasDetailsPermission } from 'services/permissionHandler';
import { ENV } from 'types';
import { v4 as uuidv4 } from 'uuid';
import '../Assets/Scss/index.scss';
import Loader from '../components/Loader';
import { AuthProvider } from '../contexts/JWTContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import useTheme from '../hooks/useTheme';
import '../i18n';
import { persistor, store } from '../redux/store';
import createTheme from '../theme';
import createEmotionCache from '../utils/createEmotionCache';
import '../vendor/jvectormap.css';
import '../vendor/perfect-scrollbar.css';

// Set the license key for MUI X components

// Create an Emotion cache for client-side rendering
const clientSideEmotionCache = createEmotionCache();

// Define a type for a layout function that takes a ReactNode and returns a ReactNode
type GetLayout = (page: ReactNode) => ReactNode;

// Define a type for a Next.js page that includes optional getLayout function
type Page<P = {}, IP = P> = NextPage<P, IP> & {
   getLayout?: GetLayout;
};

// Define props for the main App component
type MyAppProps<P = {}> = AppProps<P> & {
   emotionCache?: EmotionCache;
   Component: Page<P>;
};

function App({
   Component,
   emotionCache = clientSideEmotionCache,
   pageProps,
}: MyAppProps) {
   // Get the current theme
   let lisence = '';

   // fetchLicenseKey().then((res) => {
   //    if (res) LicenseInfo.setLicenseKey(res)
   // })
   LicenseInfo.setLicenseKey(
      process.env.NEXT_PUBLIC_LICENSE_KEY ||
         '2c03a1d8ea90792cc3f77ace2a4e817cTz03NzYyMCxFPTE3MzAxMDUxODkwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
   );
   const { theme } = useTheme();

   // Initialize a QueryClient for React Query
   const [queryClient] = React.useState(() => new QueryClient());

   // Define a function to get the layout of the page
   const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

   // Get the access token from cookies
   const accessToken = getCookie('access_token');

   // Get the router instance
   const router = useRouter();

   // State to track whether to ignore route changes
   const [ignore, setIgnore] = React.useState(false);
   const boClient = store.getState().socket.boClient;
   const coreId = useSelector(selectAuthCoreIdRealTime);
   const startGameCoreMessage = useSelector(selectAuthStartCoreMessages);
   const user = store.getState().auth.user;
   // Use effect to handle route changes and authentication
   useEffect(() => {
      if (!ignore) {
         handleRouteChangeAuth();
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GAME_CORE_LIST_REQ
            ) &&
            [UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope)
         ) {
            boClient?.gameCore.getGameCoreList(
               { find: {}, sort: {} },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GAME_CORE_LIST_REQ,
                  },
               }
            );
         }
         setIgnore(true);
      }
   });

   useEffect(() => {
      if (coreId) {
         if (router.pathname === '/real-time') {
            boClient?.gameCore?.startGameCoreRealtime(
               {
                  coreId: coreId,
               },
               {
                  uuid: uuidv4(),
               }
            );
         } else if (startGameCoreMessage) {
            boClient?.gameCore?.stopGameCoreRealtime(
               {
                  coreId: coreId,
               },
               {
                  uuid: uuidv4(),
               }
            );
         }
      }
   }, [router.pathname, coreId]);

   // Use effect to handle initial authentication
   useEffect(() => {
      if (!accessToken) {
         redirectToLogin();
      }
   }, [accessToken, router]);

   // Use effect to subscribe to route change events
   useEffect(() => {
      // Get the back button state and history from Redux
      const BackButton = store.getState().auth.backButton;
      const history = store.getState().auth.backHistory;
      // Function to add to the back history
      const addBackHistory = (url: string) => {
         const routeWithoutParams = url.split('?')[0];
         const historyWithoutParams =
            history?.length > 0 ? history[0].split('?')[0] : '';
         if (BackButton) {
            store.dispatch(saveBackButton(false));
         } else {
            if (historyWithoutParams === routeWithoutParams) {
               // if (store.getState().auth.backHistory.length > 1) {
               //    store.getState().auth.backHistory.splice(0, 1)
               // }
               // store.dispatch(saveBackHistory(url))
            } else {
               store.dispatch(saveBackHistory(url));
            }
         }
      };

      // Subscribe to route change start events
      router.events.on('routeChangeStart', addBackHistory);

      // Unsubscribe on component destroy in useEffect return function
      return () => {
         router.events.off('routeChangeComplete', addBackHistory);
      };
   }, []);

   // Get the complete initialization status from Redux
   const completeInit = useSelector(selectAuthCOmpleteInit);
   // State to track loading status
   const [isLoading, setLoading] = useState(true);

   // Use effect to handle the completion of initialization
   useEffect(() => {
      if (completeInit) {
         setTimeout(() => {
            setLoading(false);
         }, 1000);
      }
   }, [completeInit]);
   const server = store.getState().auth.server;
   return (
      <CacheProvider value={emotionCache}>
         <HelmetProvider>
            <Helmet defaultTitle="iMoon" />
            <Head>
               <title>
                  iMoon
                  {server === ENV.DEV
                     ? ' - dev'
                     : server === ENV.PROD
                     ? ''
                     : server === ENV.STAGE
                     ? ' - Stage'
                     : server === ENV.TEST
                     ? ' - Test'
                     : ''}
               </title>
               <meta
                  name="viewport"
                  content={
                     'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
                  }
                  key="desc"
               />
            </Head>
            <Provider store={store}>
               <PersistGate loading={false} persistor={persistor}>
                  {/* @ts-ignore */}
                  <QueryClientProvider client={queryClient}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MuiThemeProvider theme={createTheme(theme)}>
                           <AuthProvider>
                              {isLoading ? (
                                 <Loader />
                              ) : (
                                 getLayout(<Component {...pageProps} />)
                              )}
                           </AuthProvider>
                        </MuiThemeProvider>
                     </LocalizationProvider>
                  </QueryClientProvider>
               </PersistGate>
            </Provider>
         </HelmetProvider>
      </CacheProvider>
   );
}

// Create a function that wraps the App component with a theme provider
const withThemeProvider = (Component: any) => {
   const AppWithThemeProvider = (props: JSX.IntrinsicAttributes) => {
      return (
         <ThemeProvider>
            <Provider store={store}>
               <ToastContainer />
               <Component {...props} />
            </Provider>
         </ThemeProvider>
      );
   };
   AppWithThemeProvider.displayName = 'AppWithThemeProvider';
   return AppWithThemeProvider;
};

export default withThemeProvider(App);
