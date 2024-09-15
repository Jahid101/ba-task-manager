import "@/styles/globals.css";
import Head from "next/head";
import CustomLoader from "@/components/loader/loader";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";


export default function App({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Head>
        <title>Tasks Management</title>
      </Head>
      <Provider store={store}>
        <PersistGate loading={<CustomLoader />} persistor={persistor}>
          <Component {...pageProps} />
          <Toaster />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}
