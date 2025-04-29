import express from "express";
import {createProject,getAllProjects,getProjectById,updateProject,deleteProject} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", createProject);
router.get("/", getAllProjects);
router.get("/:projectId", getProjectById);
router.put("/update/:projectId", updateProject);
router.delete("/delete/:projectId", deleteProject);

export default router;
