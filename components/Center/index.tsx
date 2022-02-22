import { ChevronDownIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '@/atoms/playListAtom'
import useSpotify from 'hooks/useSpotify'
import Songs from '@/components/Songs'
import nProgress from 'nprogress'
import Head from 'next/head'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]
nProgress.configure({ showSpinner: false })
const Center = () => {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState('')
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => setColor(shuffle(colors).pop() as string), [playlistId])

  useEffect(() => {
    nProgress.start()
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data?.body)
        nProgress.done()
      })
      .catch((error) => {
        console.log('Something went wrong: ', error)
        nProgress.done()
      })
  }, [spotifyApi, playlistId])

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
          onClick={signOut}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user?.image as string}
            alt={session?.user?.name as string}
          />
          <h2 className="font-semibold">{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          loading="lazy"
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>Playlist</p>
          <h1 className="text-2xl font-bold md:text-3xl lg:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
