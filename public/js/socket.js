<script src="/socket.io/socket.io.js"></script>
var socket = io.connect('http://127.0.0.1:3001')
function sendmessage(cmd, obj) {
    socket.emit(cmd, obj)
}