import axios from 'axios'

const api = axios.create({
  //baseURL: 'http://10.0.0.103:3333'
  //baseURL: 'http://192.168.0.12:3333'
  baseURL: 'https://my-json-server.typicode.com/Sistema-Nuvem/plantmanager-mockend'
})

export default api