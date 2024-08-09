import axios from 'axios'
const baseUrl = '/api/users'

interface NewUser {
  data: {
    name: string
    username: string
    email: string
    password: string
  }
}

const signup = async (newUser: NewUser) => {
  const response = await axios.post(baseUrl, newUser.data)
  return response.data
}

export default { signup }
