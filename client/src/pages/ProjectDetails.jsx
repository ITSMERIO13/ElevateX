import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OtherContext from '../context/OtherContext';
import CommentsSection from '../components/CommentsSection';
import { ArrowLeft, Github, Users, Award, BookOpen } from 'lucide-react';
import ProjectSkeleton from '../components/ProjectSkeletonDetail';

const sdgNames = {
  1: "No Poverty", 2: "Zero Hunger", 3: "Good Health and Well-being",
  4: "Quality Education", 5: "Gender Equality", 6: "Clean Water and Sanitation",
  7: "Affordable and Clean Energy", 8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure", 10: "Reduced Inequalities",
  11: "Sustainable Cities and Communities", 12: "Responsible Consumption and Production",
  13: "Climate Action", 14: "Life Below Water", 15: "Life on Land",
  16: "Peace, Justice and Strong Institutions", 17: "Partnerships for the Goals"
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { getProjectById, error } = useContext(OtherContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, getProjectById]);

  if (loading) {
    return (
      <ProjectSkeleton /> 
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center p-8 bg-zinc-900 rounded-lg border border-zinc-800 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "Unable to load the requested project."}</p>
          <button
            onClick={() => navigate('/viewproject')}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const { title, description, thumbnail, githubRepo, sdgs, team } = project;

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto p-6">
          <button
            onClick={() => navigate('/viewproject')}
            className="px-4 py-2 bg-transparent border mt-6 border-purple-400 text-purple-400 rounded-md hover:bg-purple-400 hover:text-black transition-all duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Projects
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column */}
          <div className="lg:col-span-2">
            <div className="relative mb-8 rounded-lg overflow-hidden group">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-80 object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6">
                <div className="px-3 py-1 bg-purple-600 text-white text-sm inline-block rounded-md mb-3">
                  Project
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-6">{title}</h1>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen size={20} className="mr-2 text-purple-400" />
                Project Description
              </h2>
              <p className="text-gray-300 leading-relaxed">{description}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Award size={20} className="mr-2 text-purple-400" />
                Sustainable Development Goals
              </h2>
              <div className="flex flex-wrap gap-3">
                {sdgs.map((sdg, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 bg-zinc-800 rounded-md border border-zinc-700 flex items-center gap-2 group hover:border-purple-400 transition-colors duration-300"
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-black text-xs font-bold">
                      {sdg}
                    </span>
                    <span>{sdgNames[sdg] || "Unknown Goal"}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <CommentsSection projectId={id} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 sticky top-6">
              {githubRepo && (
                <a
                  href={githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-8 flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-purple-600 transition-colors duration-300 rounded-md text-center justify-center"
                >
                  <Github size={20} />
                  <span>View GitHub Repository</span>
                </a>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Users size={20} className="mr-2 text-purple-400" />
                  Team Information
                </h2>
                <div className="px-4 py-5 bg-zinc-800 rounded-md border border-zinc-700">
                  <h3 className="font-bold text-lg mb-2">{team.name}</h3>
                  <p className="text-purple-300 italic mb-4">"{team.tagline}"</p>
                  <p className="text-gray-300 text-sm mb-6">{team.description}</p>
                  
                  <div className="border-t border-zinc-700 pt-4 mt-4">
                    <h4 className="text-sm uppercase text-gray-400 mb-2">Team Lead</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-200 text-black flex items-center justify-center font-bold">
                        {team.owner.firstName.charAt(0)}
                      </div>
                      <span>{team.owner.firstName} {team.owner.lastName}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-zinc-700 pt-4 mt-4">
                    <h4 className="text-sm uppercase text-gray-400 mb-2">Mentor</h4>
                    {team.mentor ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-200 text-black flex items-center justify-center font-bold">
                          {team.mentor.firstName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span>{team.mentor.firstName} {team.mentor.lastName}</span>
                          <span className="text-sm text-gray-400">{team.mentor.email}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">To be assigned</p>
                    )}
                  </div>
                  
                  <div className="border-t border-zinc-700 pt-4 mt-4">
                    <h4 className="text-sm uppercase text-gray-400 mb-2">Team Members</h4>
                    <div className="space-y-2">
                      {team.members.map((member) => (
                        <div key={member._id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-200 text-black flex items-center justify-center font-bold">
                            {member.firstName.charAt(0)}
                          </div>
                          <span>{member.firstName} {member.lastName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;