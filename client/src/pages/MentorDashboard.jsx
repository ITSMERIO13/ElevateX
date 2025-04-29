import { useState, useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MentorDashboard = () => {
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        // Get mentor data from localStorage
        const mentorData = JSON.parse(localStorage.getItem("elex-user"));
        if (!mentorData || !mentorData._id) {
          throw new Error("Mentor not found in storage");
        }
        
        setMentor(mentorData);
        
        // Fetch teams assigned to this mentor
        const response = await fetch(`http://localhost:5500/api/auth/mentor/assigned-teams/${mentorData._id}`, {
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch assigned teams");
        }
        
        const data = await response.json();
        setAssignedTeams(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        toast.error(error.message);
        setLoading(false);
      }
    };
    
    fetchMentorData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Typography variant="h2" className="text-3xl font-bold mb-6 text-center">
        Mentor Dashboard
      </Typography>
      
      <div className="mb-6">
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img 
                src={mentor?.profilePic || "https://via.placeholder.com/64"} 
                alt={mentor?.firstName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Typography variant="h5">{mentor?.firstName} {mentor?.lastName}</Typography>
              <Typography variant="small" className="text-gray-600">{mentor?.email}</Typography>
              {mentor?.expertise && mentor.expertise.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {mentor.expertise.map((exp, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {exp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" className="text-xl font-semibold">
            Your Assigned Teams
          </Typography>
          
          <Link to="/mentor/resources" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Manage Learning Resources
          </Link>
        </div>
        
        {assignedTeams.length === 0 ? (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <Typography className="mb-4">
              You haven't been assigned to any teams yet.
            </Typography>
            <Typography variant="small" className="text-gray-600">
              The admin will assign you to teams soon.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedTeams.map((team) => (
              <Card key={team._id} className="p-4 shadow-md">
                <Typography variant="h5" className="font-bold mb-2">
                  {team.name}
                </Typography>
                <Typography variant="paragraph" className="text-sm text-gray-600 mb-4">
                  {team.tagline}
                </Typography>
                
                <div className="mb-4">
                  <Typography variant="small" className="font-medium mb-2">
                    Team Owner:
                  </Typography>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img 
                        src={team.owner?.profilePic || "https://via.placeholder.com/32"} 
                        alt={team.owner?.firstName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Typography variant="small">
                      {team.owner?.firstName} {team.owner?.lastName}
                    </Typography>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Typography variant="small" className="font-medium mb-2">
                    Team Members ({team.members?.length}):
                  </Typography>
                  <div className="flex flex-wrap gap-1">
                    {team.members?.slice(0, 5).map((member) => (
                      <div key={member._id} className="w-6 h-6 rounded-full overflow-hidden border border-white">
                        <img 
                          src={member.profilePic || "https://via.placeholder.com/24"} 
                          alt={member.firstName} 
                          className="w-full h-full object-cover"
                          title={`${member.firstName} ${member.lastName}`}
                        />
                      </div>
                    ))}
                    {team.members?.length > 5 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-white">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
                
                <Link to={`/mentor/team/${team._id}`}>
                  <Button 
                    fullWidth
                    color="green"
                    variant="outlined"
                    className="mt-2"
                  >
                    View Team Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard; 