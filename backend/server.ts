import dotenv from'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import registerRouter from './authentication/routes/register-route'
import loginRouter from './authentication/routes/login-route'
import edituserRouter from './user/routes/edituser-route'
import listuserRouter from './user/routes/listuser-route'
import deleteuserRouter from './user/routes/deleteuser-route'
import createteamRouter from './team/routes/createteam-route'
import editteamRouter from './team/routes/editteam-route'
import listteamRouter from './team/routes/listteam-route'
import deleteteamRouter from './team/routes/deleteteam-route'
import listbatchRouter from './batch/routes/listbatch-route'
import createbatchRouter from './batch/routes/createbatch-route'
import editbatchRouter from './batch/routes/editbatch-route'
import deletebatchRouter from './batch/routes/deletebatch-route'


const app = express();

app.use(express.json())
app.use(cors({origin:'*'}))

const uri = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.DB_HOST+"/"+process.env.DB_NAME
mongoose.connect(uri,{useNewUrlParser: true,useUnifiedTopology: true})
          .then(() => console.log("connected to DB."))
          .catch( error => console.log(error));
          
app.use('/api/pesto/register',registerRouter)
app.use('/api/pesto/login',loginRouter)

//app.use(authMiddleware)

/*Admin Screen Routers */
app.use('/api/pesto/list/user',listuserRouter)
app.use('/api/pesto/edit/user',edituserRouter)
app.use('/api/pesto/delete/user',deleteuserRouter)
app.use('/api/pesto/list/team',listteamRouter)
app.use('/api/pesto/create/team',createteamRouter)
app.use('/api/pesto/edit/team',editteamRouter)
app.use('/api/pesto/delete/team',deleteteamRouter)
app.use('/api/pesto/list/batch',listbatchRouter)
app.use('/api/pesto/create/batch',createbatchRouter)
app.use('/api/pesto/edit/batch',editbatchRouter)
app.use('/api/pesto/delete/batch',deletebatchRouter)

const serverListen = app.listen(process.env.PORT||5000,()=>{
  console.log('Server Started Successfully')
  })
