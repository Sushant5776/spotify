import { currentTrackIdState } from '@/atoms/SongAtom'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import useSpotify from './useSpotify'

const useSongInfo = () => {
  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [songInfo, setSongInfo] = useState<null | object>(null)
  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((response) => response.json())

        setSongInfo(trackInfo)
      }
    }
    fetchSongInfo()
  }, [currentTrackId, spotifyApi])
  return songInfo
}

export default useSongInfo
