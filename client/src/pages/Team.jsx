import { Github, Users, User } from 'lucide-react';

export default function ProjectDetailsDisplay() {
  // Sample project data
  const project = {
    title: "EcoSense: Smart Waste Management System",
    description: "EcoSense is an IoT-based waste management solution that optimizes collection routes and provides real-time data on waste levels. Using ultrasonic sensors, machine learning algorithms, and a user-friendly dashboard, the system reduces collection costs by 30% while minimizing carbon emissions from garbage trucks. The project includes hardware prototypes, a mobile app for citizens, and an analytics platform for municipalities.",
    thumbnail: "/api/placeholder/1200/400",
    githubUrl: "https://github.com/ecosense-team/smart-waste",
    sdgGoals: [
      { id: 11, name: "Sustainable Cities and Communities", color: "bg-yellow-700" },
      { id: 13, name: "Climate Action", color: "bg-green-700" },
      { id: 9, name: "Industry, Innovation and Infrastructure", color: "bg-orange-500" }
    ],
    teamMembers: [
      { name: "Alex Chen", role: "Hardware Engineer" },
      { name: "Priya Sharma", role: "Software Developer" },
      { name: "Marcus Johnson", role: "Data Scientist" },
      { name: "Sofia Rodriguez", role: "UI/UX Designer" }
    ],
    mentor: { name: "Dr. Emily Waters", department: "Environmental Engineering" }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Thumbnail - Full Width */}
      <div className="w-full h-64 md:h-80 lg:h-96 relative">
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      
      {/* Content Container */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Project Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{project.title}</h1>
        
        {/* SDG Goals */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-400 mb-3">SDG Goals</h2>
          <div className="flex flex-wrap gap-2">
            {project.sdgGoals.map(sdg => (
              <span 
                key={sdg.id} 
                className={`${sdg.color} px-3 py-1 rounded-full text-sm flex items-center`}
              >
                {sdg.name}
              </span>
            ))}
          </div>
        </div>
        
        {/* GitHub Repository */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-400 mb-3">GitHub Repository</h2>
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg px-4 py-2 transition-colors"
          >
            <Github size={18} className="mr-2" />
            {project.githubUrl.replace('https://github.com/', '')}
          </a>
        </div>
        
        {/* Project Description */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-400 mb-3">Project Description</h2>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Team Members */}
          <div className="md:col-span-2 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center mb-4">
              <Users size={20} className="mr-2 text-purple-500" />
              <h2 className="text-lg font-medium">Team Members</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center mr-3">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mentor */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center mb-4">
              <User size={20} className="mr-2 text-purple-500" />
              <h2 className="text-lg font-medium">Project Mentor</h2>
            </div>
            
            <div className="flex items-center p-4 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center mr-3">
                {project.mentor.name.split(' ')[0].charAt(0)}
                {project.mentor.name.split(' ')[1].charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{project.mentor.name}</h3>
                <p className="text-sm text-gray-400">{project.mentor.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}