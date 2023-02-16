import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {DM_Sans} from '@next/font/google'
import Layout from "../components/layout";
const dm = DM_Sans({ weight:['400'],subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
    <main className={dm.className}>
      <Component {...pageProps} />
    </main>
    </Layout>
    ) 
  }