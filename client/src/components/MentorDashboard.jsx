import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Tooltip, IconButton } from "@material-tailwind/react";
import { ArrowLeft, AlertTriangle, Users, BarChart3, GitPullRequestArrow, GitCommit, Bug, Github } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function MentorDashboard() {
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState(null);
  const [repositoryStats, setRepositoryStats] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const mentorData = JSON.parse(localStorage.getItem("elex-cred"));
        if (!mentorData) {
          toast.error("Please login first");
          return;
        }
        setMentor(mentorData);

        const response = await fetch(
          `http://localhost:5500/api/auth/mentor/assigned-teams/${mentorData._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned teams");
        }

        const data = await response.json();
        setAssignedTeams(data);
        
        // Mock GitHub repository stats for each team
        const mockStats = {};
        data.forEach(team => {
          if (team.project && team.project.githubRepo) {
            mockStats[team._id] = {
              commits: Math.floor(Math.random() * 150) + 20,
              openIssues: Math.floor(Math.random() * 10) + 1,
              pullRequests: Math.floor(Math.random() * 8),
              contributors: team.members.length + 1, // +1 for owner
              lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
            };
          }
        });
        setRepositoryStats(mockStats);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mentor dashboard data:", error);
        toast.error(error.message || "Failed to load mentor data");
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  const toggleExpandTeam = (teamId) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <Typography className="font-bold text-xl mb-2">Authentication Required</Typography>
        <Typography className="text-gray-400 mb-4">Please login to access your dashboard</Typography>
        <Link to="/login" className="text-indigo-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link to="/" className="flex items-center text-indigo-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-7xl mx-auto mt-8">
        {/* Mentor Profile */}
        <Card className="bg-gray-800 border border-gray-700 shadow-lg overflow-hidden">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 rounded-none p-6 pb-0"
          >
            <Typography variant="h5" color="white" className="font-medium mb-2">
              Mentor Profile
            </Typography>
          </CardHeader>
          <CardBody className="px-6 pt-4">
            <div className="flex items-center mb-4">
              <img
                src={mentor.profilePic}
                alt={`${mentor.firstName} ${mentor.lastName}`}
                className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-indigo-500"
              />
              <div>
                <Typography variant="h6" color="white">
                  {mentor.firstName} {mentor.lastName}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  {mentor.email}
                </Typography>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="gray" className="font-medium mb-1">
                Expertise
              </Typography>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="gray" className="font-medium mb-1">
                Experience
              </Typography>
              <Typography variant="small" color="white">
                {mentor.experience} years
              </Typography>
            </div>

            <div>
              <Typography variant="small" color="gray" className="font-medium mb-1">
                Bio
              </Typography>
              <Typography variant="small" color="white">
                {mentor.bio}
              </Typography>
            </div>
          </CardBody>
        </Card>

        {/* Assigned Teams */}
        <div className="xl:col-span-3">
          <Typography variant="h4" color="white" className="mb-6">
            Assigned Teams ({assignedTeams.length})
          </Typography>

          {assignedTeams.length === 0 ? (
            <Card className="bg-gray-800 border border-gray-700 p-8 text-center">
              <Typography variant="h6" color="white" className="mb-2">
                No Teams Assigned Yet
              </Typography>
              <Typography color="gray" className="font-normal">
                You will see your assigned teams here once an admin assigns them to you.
              </Typography>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assignedTeams.map((team) => (
                <Card key={team._id} className="bg-gray-800 border border-gray-700 overflow-hidden">
                  <CardHeader
                    floated={false}
                    shadow={false}
                    color="transparent"
                    className="m-0 p-6 pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <Typography variant="h5" color="white">
                        {team.name}
                      </Typography>
                      <span className="bg-indigo-900 text-indigo-200 px-2 py-1 rounded text-xs">
                        {team.teamCode}
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pt-4">
                    {team.tagline && (
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-normal italic mb-4"
                      >
                        "{team.tagline}"
                      </Typography>
                    )}

                    <div className="mb-4">
                      <Typography variant="small" color="gray" className="font-medium mb-1">
                        Team Owner
                      </Typography>
                      <div className="flex items-center">
                        <img
                          src={team.owner.profilePic}
                          alt={`${team.owner.firstName} ${team.owner.lastName}`}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <Typography variant="small" color="white">
                          {team.owner.firstName} {team.owner.lastName}{" "}
                          <span className="text-gray-500">({team.owner.email})</span>
                        </Typography>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <Typography variant="small" color="gray" className="font-medium">
                          Team Members ({team.members.length})
                        </Typography>
                        <Button
                          size="sm"
                          variant="text"
                          onClick={() => toggleExpandTeam(team._id)}
                          className="p-0 text-indigo-500"
                        >
                          {expandedTeam === team._id ? "Hide" : "Show All"}
                        </Button>
                      </div>
                      {expandedTeam === team._id ? (
                        <div className="space-y-2 mt-2">
                          {team.members.map((member) => (
                            <div key={member._id} className="flex items-center">
                              <img
                                src={member.profilePic}
                                alt={`${member.firstName} ${member.lastName}`}
                                className="w-6 h-6 rounded-full object-cover mr-2"
                              />
                              <Typography variant="small" color="white">
                                {member.firstName} {member.lastName}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex -space-x-2 overflow-hidden">
                          {team.members.slice(0, 3).map((member) => (
                            <Tooltip key={member._id} content={`${member.firstName} ${member.lastName}`}>
                              <img
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800"
                                src={member.profilePic}
                                alt={`${member.firstName} ${member.lastName}`}
                              />
                            </Tooltip>
                          ))}
                          {team.members.length > 3 && (
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-xs text-white ring-2 ring-gray-800">
                              +{team.members.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* GitHub Repository Section */}
                    {repositoryStats[team._id] && (
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <Typography variant="small" color="gray" className="font-medium mb-3 flex items-center">
                          <Github className="h-4 w-4 mr-1" /> 
                          GitHub Activity
                        </Typography>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <GitCommit className="h-4 w-4 text-green-400 mr-2" />
                                <Typography variant="small" color="gray">Commits</Typography>
                              </div>
                              <Typography variant="h6" color="white">{repositoryStats[team._id].commits}</Typography>
                            </div>
                          </div>
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Bug className="h-4 w-4 text-red-400 mr-2" />
                                <Typography variant="small" color="gray">Issues</Typography>
                              </div>
                              <Typography variant="h6" color="white">{repositoryStats[team._id].openIssues}</Typography>
                            </div>
                          </div>
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <GitPullRequestArrow className="h-4 w-4 text-purple-400 mr-2" />
                                <Typography variant="small" color="gray">PRs</Typography>
                              </div>
                              <Typography variant="h6" color="white">{repositoryStats[team._id].pullRequests}</Typography>
                            </div>
                          </div>
                          <div className="bg-gray-900 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 text-blue-400 mr-2" />
                                <Typography variant="small" color="gray">Contributors</Typography>
                              </div>
                              <Typography variant="h6" color="white">{repositoryStats[team._id].contributors}</Typography>
                            </div>
                          </div>
                        </div>
                        <Typography variant="small" color="gray" className="mt-2 text-right">
                          Last updated: {repositoryStats[team._id].lastUpdated}
                        </Typography>
                      </div>
                    )}
                  </CardBody>
                  <CardFooter className="pt-0 px-6 pb-6">
                    <div className="flex gap-3 flex-wrap">
                      <Link to={`/mentor/team/${team._id}`}>
                        <Button size="sm" color="indigo" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          View Team Details
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 