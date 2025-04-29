import Project from "../models/project.model.js";
import Team from "../models/Team.model.js";
import Student from "../models/student.model.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, thumbnail, githubRepo, sdgs, teamId, email } = req.body;

    const student = await Student.findOne({ email });
    const team = await Team.findById(teamId);

    if (!student || !team) return res.status(404).json({ message: "Student or team not found" });
    if (String(team.owner) !== String(student._id)) {
      return res.status(403).json({ message: "Only team owner can create project" });
    }

    if (team.project) return res.status(400).json({ message: "Team already has a project" });

    const project = new Project({ title, description, thumbnail, githubRepo, sdgs, team: team._id });
    await project.save();

    team.project = project._id;
    await team.save();

    res.status(201).json({ message: "Project created and linked to team", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("team", "name teamCode");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate({
        path: "team",
        select: "name tagline description owner mentor members", // no teamCode
        populate: [
          {
            path: "owner",
            select: "firstName lastName email"
          },
          {
            path: "mentor",
            select: "firstName lastName email"
          },
          {
            path: "members",
            select: "firstName lastName email"
          },
        ],
      });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    const project = await Project.findById(req.params.projectId);
    if (!student || !project) return res.status(404).json({ message: "Student or project not found" });

    const team = await Team.findById(project.team);
    if (!team || String(team.owner) !== String(student._id)) {
      return res.status(403).json({ message: "Only team owner can update project" });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ message: "Project updated", project: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    const project = await Project.findById(req.params.projectId);
    if (!student || !project) return res.status(404).json({ message: "Student or project not found" });

    const team = await Team.findById(project.team);
    if (!team || String(team.owner) !== String(student._id)) {
      return res.status(403).json({ message: "Only team owner can delete project" });
    }

    team.project = null;
    await team.save();

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted and unlinked from team" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
