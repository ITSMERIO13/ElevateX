import React from 'react';

const sdgMap = {
  "1": "No Poverty",
  "2": "Zero Hunger",
  "3": "Good Health and Well-being",
  "4": "Quality Education",
  "5": "Gender Equality",
  "6": "Clean Water and Sanitation",
  "7": "Affordable and Clean Energy",
  "8": "Decent Work and Economic Growth",
  "9": "Industry, Innovation and Infrastructure",
  "10": "Reduced Inequality",
  "11": "Sustainable Cities and Communities",
  "12": "Responsible Consumption and Production",
  "13": "Climate Action",
  "14": "Life Below Water",
  "15": "Life on Land",
  "16": "Peace, Justice and Strong Institutions",
  "17": "Partnerships for the Goals",
};

const ProjectCard = ({ project }) => {
  if (!project) return null;

  const {
    title = 'Untitled Project',
    description = 'No description provided.',
    thumbnail = 'https://via.placeholder.com/600x300?text=No+Image',
    sdgs = [],
  } = project;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
    {/* {console.log(thumbnail)} */}
      <img
src={thumbnail === 'http://example.com/image.png' 
  ? 'https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg' 
  : thumbnail}
 
        alt={`${title} thumbnail`}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

        {sdgs.length > 0 && (
          <div className="mt-auto">
            <h3 className="text-xs text-gray-500 font-semibold mb-1">SDGs</h3>
            <div className="flex flex-wrap gap-2">
              {sdgs.map((sdg, index) => {
                const goalNumber = sdg.toString();
                const goalName = sdgMap[goalNumber] || 'Unknown Goal';
                return (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {goalNumber}. {goalName}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
