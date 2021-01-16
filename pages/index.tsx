import 'twin.macro'

import Head from 'next/head'

import Wave from '../components/elements/Wave/Wave'

export default function Home(): JSX.Element {
  return (
    <div>
      <Head>
        <title>Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 tw="bg-gray-100 rounded-xl p-8">Wave</h1>

        <Wave />
      </main>
    </div>
  )
}
