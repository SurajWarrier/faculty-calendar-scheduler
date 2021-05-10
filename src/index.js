const serverRouter = require('./server');
let PORT=3000;
serverRouter.app.listen(PORT,()=>console.log(`Listening to port ${PORT}`));