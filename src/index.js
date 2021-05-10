const server = require('./server.js')
let PORT=3000;
server.listen(PORT,()=>console.log(`Listening to port ${PORT}`))