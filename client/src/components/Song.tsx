import { Draggable } from '@hello-pangea/dnd'
import { ISong } from '../types'

const Song = ({ song, index }: { song: ISong; index: number }) => {
  return (
    <Draggable draggableId={song._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            border: '1px solid black',
          }}
        >
          {song.name}
        </div>
      )}
    </Draggable>
  )
}

export default Song
