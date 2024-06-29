import express from 'express';
import userRouter from "./routes/userRoutes.js"
import jurorRouter from "./routes/jurorRoutes.js"
import cors from 'cors';

const app = express();
app.use(cors());
const port = 8080;

app.use("/user", userRouter)
app.use("/juror", jurorRouter)

app.get('/', (req , res ) => {
  res.send('Hello World!') 
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})