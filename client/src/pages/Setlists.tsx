import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { useState } from 'react'
import styled from 'styled-components'
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: white;
`
const Title = styled.h3`
  padding: 8px;
  padding-bottom: 0px;
  margin: 0;
`
const TaskList = styled.div`
  padding: 8px;
`

interface TTask {
  id: number
  content: string
}

interface TTaskCollection {
  [key: string]: TTask
}

interface TColumn {
  id: string
  title: string
  taskIds: string[]
}

interface TColumnCollection {
  [key: string]: TColumn
}

interface TData {
  tasks: TTaskCollection
  columns: TColumnCollection
  columnOrder: string[]
}

// interface TResult {
//   destination: {
//     droppableId: string
//     index: number
//   }
//   draggableId: string
//   mode: string
//   reason: string
//   combine: boolean
//   source: {
//     droppableId: string
//     index: number
//   }
//   type: string
// }

const initialData: TData = {
  tasks: {
    'id-1': {
      id: 1,
      content: "Write a brief email to your team about tomorrow's meeting.",
    },
    'id-2': {
      id: 2,
      content: 'Review the latest pull request and provide feedback.',
    },
    'id-3': {
      id: 3,
      content: 'Organize your desk and file away any loose papers.',
    },
    'id-4': {
      id: 4,
      content: 'Update the project roadmap with the latest milestones.',
    },
    'id-5': {
      id: 5,
      content: 'Prepare a presentation slide for the upcoming client demo.',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['id-1', 'id-2', 'id-3', 'id-4', 'id-5'],
    },
  },
  columnOrder: ['column-1'],
}

const Column = ({ column, tasks }: { column: TColumn; tasks: TTask[] }) => {
  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <TaskList ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => {
              return <Task key={task.id} task={task} index={index} />
            })}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  )
}

const Task = ({ task, index }: { task: TTask; index: number }) => {
  return (
    <Draggable draggableId={`id-${task.id}`} index={index}>
      {(provided) => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Handle {...provided.dragHandleProps} />
          {task.content}
        </Container>
      )}
    </Draggable>
  )
}

const Handle = styled.div`
  width: 17px;
  height: 17px;
  marginright: 1px;
  border: 1px solid black;
`

const Setlists = () => {
  const [todos, setTodos] = useState(initialData)

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const column = todos.columns[source.droppableId]
    const newTaskIds = [...column.taskIds]
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)
    // console.log(newTaskIds)
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    }

    const newTodos = {
      ...todos,
      columns: {
        ...todos.columns,
        [newColumn.id]: newColumn,
      },
    }
    setTodos(newTodos)
    console.log(newTodos.columns['column-1'].taskIds)
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {todos.columnOrder.map((colId) => {
        const column = todos.columns[colId]
        const tasks = column.taskIds.map((taskId) => todos.tasks[taskId])

        return <Column key={colId} column={column} tasks={tasks} />
      })}
    </DragDropContext>
  )
}

export default Setlists
