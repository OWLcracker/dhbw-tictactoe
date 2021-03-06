const WebSocket = require('ws')
const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

connection.onopen = () => {
    connection.send('QUEUE');
    connection.onmessage = (event) => {
        connection.send('move:yolo');
        console.log(event.data)
    }
}

connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
}