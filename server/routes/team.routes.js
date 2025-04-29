import express from "express";
import Student from "../models/student.model.js";
import Team from "../models/Team.model.js";

const router = express.Router();

const generateTeamCode = () => Math.random().toString(36).slice(2, 10).toUpperCase();

router.post("/create", async (req, res) => {
  try {
    const { name, email, tagline, description } = req.body;

    const owner = await Student.findOne({ email });
    if (!owner) return res.status(404).json({ message: "Student not found" });
    if (owner.team) return res.status(400).json({ message: "Already in a team" });

    const teamCode = generateTeamCode();
    const team = new Team({
      name,
      teamCode,
      tagline,
      description,
      owner: owner._id,
      members: [owner._id]
    });

    await team.save();
    owner.team = team._id;
    await owner.save();

    res.status(201).json({ message: "Team created", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:teamId", async (req, res) => {
    try {
      const team = await Team.findById(req.params.teamId)
        .populate("owner", "firstName lastName name email profilePic")
        .populate("members", "firstName lastName name email profilePic")
        .populate("joinRequests", "firstName lastName name email profilePic")
        .populate("project");
  
      if (!team) return res.status(404).json({ message: "Team not found" });
  
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
router.post("/request", async (req, res) => {
  try {
    const { email, teamId } = req.body;

    const student = await Student.findOne({ email });
    const team = await Team.findById(teamId);

    if (!student || !team) return res.status(404).json({ message: "Student or team not found" });
    if (student.team) return res.status(400).json({ message: "Already in a team" });
    if (team.joinRequests.includes(student._id)) return res.status(400).json({ message: "Request already sent" });

    team.joinRequests.push(student._id);
    student.teamRequests.push(teamId);

    await team.save();
    await student.save();

    res.status(200).json({ message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/manage-request", async (req, res) => {
  try {
    const { teamId, email, accept } = req.body;

    const team = await Team.findById(teamId);
    const student = await Student.findOne({ email });

    if (!team || !student) return res.status(404).json({ message: "Team or student not found" });
    if (!team.joinRequests.includes(student._id)) return res.status(400).json({ message: "No join request found" });

    team.joinRequests = team.joinRequests.filter(id => id.toString() !== student._id.toString());
    student.teamRequests = student.teamRequests.filter(id => id.toString() !== teamId);

    if (accept) {
      team.members.push(student._id);
      student.team = teamId;
    }

    await team.save();
    await student.save();

    res.status(200).json({ message: accept ? "Request accepted" : "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/join-code", async (req, res) => {
    try {
      const { email, teamCode } = req.body;
  
      const student = await Student.findOne({ email });
      const team = await Team.findOne({ teamCode });
  
      if (!student || !team) {
        return res.status(404).json({ message: "Invalid team code or student" });
      }
  
      if (student.team) {
        return res.status(400).json({ message: "Student is already in a team" });
      }
  
      team.members.push(student._id);
      student.team = team._id;
  
      await team.save();
      await student.save();
  
      res.status(200).json({ message: "Joined team successfully", team });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.post("/remove-member", async (req, res) => {
    try {
      const { teamId, email } = req.body;
  
      const team = await Team.findById(teamId);
      const student = await Student.findOne({ email });
  
      if (!team || !student) {
        return res.status(404).json({ message: "Team or student not found" });
      }
  
      if (!team.members.includes(student._id)) {
        return res.status(400).json({ message: "Student is not in this team" });
      }
  
      team.members = team.members.filter(id => id.toString() !== student._id.toString());
      student.team = null;
  
      await team.save();
      await student.save();
  
      res.status(200).json({ message: "Member removed from team" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.post("/leave", async (req, res) => {
    try {
      const { email, teamId } = req.body;
  
      const student = await Student.findOne({ email });
      const team = await Team.findById(teamId);
  
      if (!student || !team) {
        return res.status(404).json({ message: "Student or team not found" });
      }
  
      if (String(team.owner) === String(student._id)) {
        return res.status(400).json({ message: "Owner cannot leave the team" });
      }
  
      if (!team.members.includes(student._id)) {
        return res.status(400).json({ message: "Student is not in this team" });
      }
  
      team.members = team.members.filter(id => id.toString() !== student._id.toString());
      student.team = null;
  
      await team.save();
      await student.save();
  
      res.status(200).json({ message: "Left the team" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
      
  router.delete("/delete", async (req, res) => {
    try {
      const { email, teamId } = req.body;
  
      const owner = await Student.findOne({ email });
      const team = await Team.findById(teamId);
  
      if (!owner || !team) return res.status(404).json({ message: "Team or owner not found" });
  
      if (String(team.owner) !== String(owner._id)) {
        return res.status(403).json({ message: "Only the team owner can delete the team" });
      }
  
      await Student.updateMany(
        { _id: { $in: team.members } },
        { $set: { team: null } }
      );
  
      // Delete the team
      await team.deleteOne();
  
      res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

router.post("/edit", async (req, res) => {
  try {
    const { teamId, name, tagline, description } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (name) team.name = name;
    if (tagline) team.tagline = tagline;
    if (description) team.description = description;

    await team.save();
    res.status(200).json({ message: "Team updated", team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("owner", "firstName lastName name email profilePic")
      .populate("members", "firstName lastName name email profilePic")
      .populate("joinRequests", "firstName lastName name email profilePic")
      .populate("mentor", "firstName lastName name email profilePic")

    const formattedTeams = teams.map((team) => ({
      _id: team._id,
      name: team.name,
      tagline: team.tagline,
      description: team.description,
      owner: team.owner,
      members: team.members,
      joinRequests: team.joinRequests,
      mentor: team.mentor,
    }));

    res.status(200).json(formattedTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/check", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required in the body" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.team) {
      return res.status(200).json({ found: false });
    }

    const team = await Team.findById(student.team)
      .populate("owner", "firstName lastName name email profilePic")
      .populate("members", "firstName lastName name email profilePic")
      .populate("joinRequests", "firstName lastName name email profilePic")
      .populate("mentor", "firstName lastName name email profilePic")
      .populate("project");

    res.status(200).json({
      success: true,
      team: {
        _id: team._id,
        name: team.name,
        tagline: team.tagline,
        description: team.description,
        owner: team.owner,
        members: team.members,
        joinRequests: team.joinRequests,
        mentor: team.mentor,
        project: team.project
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
