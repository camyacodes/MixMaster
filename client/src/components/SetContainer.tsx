import Song from './Song'
import { Droppable } from '@hello-pangea/dnd'
import { ISetlist } from '../types'

const SetContainer = ({ setlist }: { setlist: ISetlist }) => {
  return (
    <>
      <h1>{setlist.name}</h1>
      <Droppable droppableId={setlist._id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {setlist.songs.map((song) => {
              return <Song key={song._id} song={song} />
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  )
}

export default SetContainer
