import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import registerRouter from './authentication/routes/register-route.js';
import loginRouter from './authentication/routes/login-route.js';
import edituserRouter from './admin/routes/edituser-route.js';
import listuserRouter from './admin/routes/listuser-route.js';
import deleteuserRouter from './admin/routes/deleteuser-route.js';
import createteamRouter from './admin/routes/createteam-route.js';
import editteamRouter from './admin/routes/editteam-route.js';
import deleteteamRouter from './admin/routes/deleteteam-route.js';
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
/*Admin Screen Routers */
app.use('/api/pesto/list/user', listuserRouter);
app.use('/api/pesto/edit/user', edituserRouter);
app.use('/api/pesto/delete/user', deleteuserRouter);
app.use('/api/pesto/create/team', createteamRouter);
app.use('/api/pesto/edit/team', editteamRouter);
app.use('/api/pesto/delete/team', deleteteamRouter);
const serverListen = app.listen(process.env.PORT || 5000, function () {
    console.log('Server Started Successfully');
});
