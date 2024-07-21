import express from 'express';
import session from 'express-session';
import { config } from 'dotenv';
import { dbConnect } from './config/database';
import passport from './config/passport';
import userRouter from './routes/userRoute';
import stateRouter from './routes/stateRoute';


//create a new instance of an express application
const app = express();

//setting up env file so that we can access the variables
config({
    path: ".env"
})

//connect to database
dbConnect();


//<---------------------------- Middlewares ---------------------------->
app.use(express.json()); // to parse json data
app.use(express.urlencoded({ extended: true })); // to parse urlencoded bodies

// session setup
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
}));

// configure passport
app.use(passport.initialize());
app.use(passport.session());


// route splitting
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/state', stateRouter);

//<--------------------------------------------------------------------->


// test Route
app.get("/", (req, res) => {
    return res.send(`<div style = "background:red;padding:100px;height:60vh">
    <h2>Welcome to my Server</h2>
    <p>Anscer Robotics Backend Assignment</p>
    </div>`)
})

//server to listen all the http requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}!`);
})