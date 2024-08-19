import { useEffect, useState } from 'react'
import { getUserSetlists } from '../services/setlists'
import { ISetlist } from '../types'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import SetContainer from '../components/SetContainer'

const Setlists = () => {
  const [setlist, setSetlist] = useState<ISetlist | null>(null)

  useEffect(() => {
    getUserSetlists().then((initialSet) => {
      setSetlist(initialSet)
    })
  }, [])

  const HandleDropEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    // console.log(result)
    if (setlist === null) {
      return
    }
    const newSongs = [...setlist.songs]
    newSongs.splice(source.index, 1)

    newSongs.splice(destination.index, 0, setlist.songs[source.index])

    const newSetlist = {
      ...setlist,
      songs: newSongs,
    }
    console.log(newSetlist)
  }
  // console.log(typeof setlist?.id)
  return (
    <DragDropContext onDragEnd={HandleDropEnd}>
      {setlist ? <SetContainer setlist={setlist} /> : <div>Loading...</div>}
    </DragDropContext>
  )
}

export default Setlists
