import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Setlists from './pages/Setlists.tsx'
import SignUp from './pages/SignUp.tsx'

const router = createBrowserRouter([
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/setlists',
    element: <Setlists />,
  },
  {
    path: '/',
    element: <Home />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
