import { ISong } from '../types'

const Song = ({ song }: { song: ISong }) => {
  return <div>{song.name}</div>
}

export default Song
