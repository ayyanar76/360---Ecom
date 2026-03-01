import dotenv from 'dotenv'
dotenv.config()
import app from './src/app.js'
import { ConnectDb } from './src/config/Db.js'

const PORT = process.env.PORT || 3000
ConnectDb()

app.listen(PORT,()=>{
    console.log(`Server is Running on http://localhost:${PORT}`);
    
})