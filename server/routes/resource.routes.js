import express from "express";
import { 
  createResource, 
  getResources, 
  getResourceById, 
  updateResource, 
  deleteResource,
  getResourcesForTeam,
  generateAIResources
} from "../controllers/resource.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/", getResources);
router.get("/:resourceId", getResourceById);
router.get("/team/:teamId", getResourcesForTeam);

// AI generation route
router.post("/generate/team/:teamId", generateAIResources);
router.post("/generate/project/:projectId", generateAIResources);

// Protected routes (auth required)
router.post("/", authenticateToken, createResource);
router.put("/:resourceId", authenticateToken, updateResource);
router.delete("/:resourceId", authenticateToken, deleteResource);

export default router; 