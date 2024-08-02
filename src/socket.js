import io from 'socket.io-client'

const BaseURL = process.env.REACT_APP_BACKEND;
// console.log(BaseURL)
const socket = io(BaseURL);

export default socket