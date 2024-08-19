import Song from './Song'
import { Droppable } from '@hello-pangea/dnd'
import { ISetlist } from '../types'

const SetContainer = ({ setlist }: { setlist: ISetlist }) => {
  return (
    <div style={{ border: '1px solid black' }}>
      <h1>{setlist.name}</h1>
      <Droppable droppableId={setlist.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {setlist.songs.map((song, index) => {
              return <Song key={song._id} song={song} index={index} />
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default SetContainer
