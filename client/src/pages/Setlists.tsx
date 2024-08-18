import { useEffect, useState } from 'react'
import { getUserSetlists } from '../services/setlists'
import { ISetlist } from '../types'
import { DragDropContext } from '@hello-pangea/dnd'
import SetContainer from '../components/SetContainer'

const Setlists = () => {
  const [setlist, setSetlist] = useState<ISetlist>()

  useEffect(() => {
    getUserSetlists().then((initialSet) => {
      setSetlist(initialSet)
    })
  }, [])
  console.log(setlist?.songs)
  return (
    <DragDropContext
      onDragEnd={() => {
        console.log('drag ended')
      }}
    >
      <SetContainer setlist={setlist ?? {}}></SetContainer>
    </DragDropContext>
  )
}

export default Setlists
