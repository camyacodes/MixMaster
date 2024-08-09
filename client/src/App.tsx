import './App.css'
import SignUp from './components/SignUpForm'

function App() {
  return (
    <>
      <SignUp handleSubmit={handleSignup} />
    </>
  )
}

export default App
