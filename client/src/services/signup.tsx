import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users'
import { NewUser } from '../types'

export const signup = async (newUser: NewUser) => {
  const response = await axios.post(baseUrl, newUser)
  return response.data
}
