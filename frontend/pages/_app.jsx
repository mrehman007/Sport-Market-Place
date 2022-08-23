import '../styles/global.css';
import NextNProgress from 'nextjs-progressbar';
import Nav from '../components/Nav';
import Script from 'next/script';

import { colors } from '../styles/colors';
import Footer from '../components/Footer';
import { GlobalProvider, AuthProvider, ContractProvider } from '../context';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <ContractProvider>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} closeOnClick />
          <Nav />
          <NextNProgress
            color={colors.primary}
            startPosition={0.3}
            stopDelayMs={300}
            height={3}
            showOnShallow={true}
            options={{ easing: 'ease', speed: 300, showSpinner: false }}
          />
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
            />
          </Head>
          <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
            crossOrigin="anonymous"
          />
          {/* <InfoDiv /> */}
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </ContractProvider>
    </GlobalProvider>
  );
}
