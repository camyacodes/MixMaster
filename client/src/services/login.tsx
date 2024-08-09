// import axios
import axios from 'axios'
const baseUrl = '/api/login'

interface Credentials {
  data: { username: string; password: string }
}

// set login service
const login = async (credentials: Credentials) => {
  const response = await axios.post(baseUrl, credentials.data)
  return response.data
}

export default { login }
