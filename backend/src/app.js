import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials : true
}))

app.use(express.json({limit : "16kb "}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import sessionRoutes from './routes/session.routes.js'
import topicRoutes from './routes/topic.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'

app.use("/api/v1/sessions", sessionRoutes)
app.use("/api/v1/topics", topicRoutes)
app.use("/api/v1/analytics", analyticsRoutes)
app.get("/", (req, res) => {
    res.send("Welcome to the Study Session Scheduling App API 🚀");
});

export {app}