import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import connectDB from './mongoDBconnect.js';
import studentRoutes from './routes/student.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import teamRoutes from './routes/team.routes.js';
import projectRoutes from './routes/project.routes.js';
import commentRoutes from './routes/comment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import cors from 'cors';


const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello Working!!!!!!")
}) 

app.use('/api/auth/student',studentRoutes)
app.use('/api/auth/mentor',mentorRoutes)
app.use('/api/auth/admin',adminRoutes)
app.use('/api/team',teamRoutes)
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/resources', resourceRoutes);

app.listen(port,()=>{
    connectDB()
    console.log(`server is running on port ${port}`);
})