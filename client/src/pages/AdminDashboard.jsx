import { useState, useEffect } from "react";
import { Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningMentor, setAssigningMentor] = useState(false);
  const [selectedMentors, setSelectedMentors] = useState({});
  const fetchData = async () => {
    try {
      console.log("Fetching teams data...");
      const teamsResponse = await fetch("http://localhost:5500/api/auth/admin/teams", {
        credentials: "include"
      });
      
      if (!teamsResponse.ok) {
        const errorData = await teamsResponse.json();
        console.error("Server error:", errorData);
        throw new Error(`Failed to fetch teams: ${errorData.error || "Unknown error"}`);
      }
      
      const teamsData = await teamsResponse.json();
      console.log(`Found ${teamsData.length} teams`);
      
      // Fetch mentors
      console.log("Fetching mentors data...");
      const mentorsResponse = await fetch("http://localhost:5500/api/auth/admin/mentors", {
        credentials: "include"
      });
      
      if (!mentorsResponse.ok) {
        throw new Error("Failed to fetch mentors");
      }
      
      const mentorsData = await mentorsResponse.json();
      
      // Initialize selected mentors for each team
      const initialSelected = {};
      teamsData.forEach(team => {
        initialSelected[team._id] = team.mentor ? team.mentor._id : "";
      });
      
      setTeams(teamsData);
      setMentors(mentorsData);
      setSelectedMentors(initialSelected);
      setLoading(false);
    } catch (error) {
      console.error("Error in fetchData:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignMentor = async (teamId) => {
    if (!selectedMentors[teamId]) {
      toast.error("Please select a mentor");
      return;
    }
    
    setAssigningMentor(true);
    
    try {
      const response = await fetch("http://localhost:5500/api/auth/admin/assign-mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          teamId,
          mentorId: selectedMentors[teamId]
        }),
        credentials: "include"
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to assign mentor");
      }
      
      const data = await response.json();
      
      // Update the teams list with the updated team
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team._id === teamId ? data.team : team
        )
      );
      
      toast.success("Mentor assigned successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAssigningMentor(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Typography variant="h2" className="text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </Typography>
      
      <div className="mb-8">
        <Typography variant="h4" className="text-xl font-semibold mb-4">
          Teams Management
        </Typography>
        
        {teams.length === 0 ? (
          <div className="text-center p-6 bg-gray-100 rounded-lg">
            <Typography>No teams found.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team._id} className="p-4 shadow-md">
                <Typography variant="h5" className="font-bold mb-2">
                  {team.name}
                </Typography>
                <Typography variant="paragraph" className="text-sm text-gray-600 mb-2">
                  {team.tagline}
                </Typography>
                
                <div className="mt-4 mb-2">
                  <Typography variant="small" className="font-medium">
                    Team Owner:
                  </Typography>
                  <div className="flex items-center mt-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img 
                        src={team.owner?.profilePic || "https://via.placeholder.com/40"} 
                        alt={team.owner?.firstName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Typography variant="small">
                      {team.owner?.firstName} {team.owner?.lastName}
                    </Typography>
                  </div>
                </div>
                
                <div className="mt-2 mb-4">
                  <Typography variant="small" className="font-medium">
                    Team Members: {team.members?.length}
                  </Typography>
                  <div className="flex flex-wrap mt-1">
                    {team.members?.slice(0, 5).map((member) => (
                      <div key={member._id} className="w-6 h-6 rounded-full overflow-hidden -ml-1 first:ml-0 border border-white">
                        <img 
                          src={member.profilePic || "https://via.placeholder.com/24"} 
                          alt={member.firstName} 
                          className="w-full h-full object-cover"
                          title={`${member.firstName} ${member.lastName}`}
                        />
                      </div>
                    ))}
                    {team.members?.length > 5 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs -ml-1 border border-white">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Typography variant="small" className="font-medium mb-2">
                    Assigned Mentor:
                  </Typography>
                  {team.mentor ? (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={team.mentor.profilePic || "https://via.placeholder.com/32"} 
                          alt={team.mentor.firstName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Typography variant="small" className="font-medium">
                          {team.mentor.firstName} {team.mentor.lastName}
                        </Typography>
                        {team.mentor.expertise && team.mentor.expertise.length > 0 && (
                          <Typography variant="small" className="text-xs text-gray-500">
                            Expertise: {team.mentor.expertise.slice(0, 2).join(', ')}
                            {team.mentor.expertise.length > 2 && '...'}
                          </Typography>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Typography variant="small" className="text-gray-500 italic mb-2">
                      No mentor assigned
                    </Typography>
                  )}
                  
                  <div className="mt-3">
                    <div className="mb-2">
                      <Select
                        label="Select Mentor"
                        value={selectedMentors[team._id] || ""}
                        onChange={(value) => setSelectedMentors({...selectedMentors, [team._id]: value})}
                      >
                        {mentors.map((mentor) => (
                          <Option key={mentor._id} value={mentor._id}>
                            <div className="flex items-center gap-2">
                              <span>{mentor.firstName} {mentor.lastName}</span>
                              {mentor.expertise && mentor.expertise.length > 0 && (
                                <span className="text-xs text-gray-500">
                                  ({mentor.expertise.slice(0, 2).join(', ')})
                                </span>
                              )}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <Button
                      size="sm"
                      color="purple"
                      fullWidth
                      onClick={() => handleAssignMentor(team._id)}
                      disabled={assigningMentor}
                    >
                      {assigningMentor ? "Assigning..." : "Assign Mentor"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 