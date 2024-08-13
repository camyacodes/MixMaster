// import axios
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/login'
import { Credentials } from '../types'

// set login service
export const login = async (credentials: Credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}
