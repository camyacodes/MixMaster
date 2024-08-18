import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/setlists'

const userId = '66c133af9bcc144bdc6181da'

export const getUserSetlists = async () => {
  const setlists = await axios.get(`${baseUrl}/user/${userId}`)
  return setlists.data.setlists[0]
}
