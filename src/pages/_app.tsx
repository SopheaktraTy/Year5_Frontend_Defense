// src/pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head"; // ✅ Import Head
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Monostore</title> {/* ✅ Set your tab title here */}
        <link rel="icon" href="/logo/Logo No Text.svg" /> {/* ✅ Replace with your own if needed */}
        {/* Optional extras */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
