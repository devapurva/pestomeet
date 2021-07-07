import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import registerRouter from './authentication/routes/Register-Route.js';
import loginRouter from './authentication/routes/Login-Route.js';
import editRouter from './admin/routes/Edit-Route.js';
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + "/" + process.env.DB_NAME;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to DB."))
    .catch(error => console.log(error));
app.use('/api/pesto/register', registerRouter);
app.use('/api/pesto/login', loginRouter);
//app.use(authMiddleware)
app.use('/api/pesto/edituser', editRouter);
const serverListen = app.listen(process.env.PORT || 5000, function () {
    console.log('Server Started Successfully');
});
