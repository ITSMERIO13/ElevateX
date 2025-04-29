import React from 'react';
import { Typography, Card } from "@material-tailwind/react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h1" className="text-4xl font-bold text-center mb-8">
          About ElevateX
        </Typography>
        
        <div className="mb-12">
          <Typography variant="lead" className="text-lg text-gray-700 mb-6">
            ElevateX was created specifically for Fr. Conceicao Rodrigues College of Engineering (FRCRCE) 
            students to connect with each other, form project groups, and collaborate under mentor guidance.
          </Typography>
          
          <Typography className="mb-6">
            This platform serves as a bridge between FRCRCE students and experienced mentors, enabling 
            students to form teams based on shared interests and complementary skills. By facilitating these 
            connections, we aim to enhance the learning experience and project outcomes for all FRCRCE students.
          </Typography>
          
          <Typography className="mb-6">
            Students from FRCRCE can easily create or join teams, collaborate with peers from different 
            departments and years, and receive guidance from industry mentors. This cross-disciplinary 
            approach nurtures innovation and prepares students for real-world collaborative environments.
          </Typography>
          
          <Typography className="font-medium mb-8">
            ElevateX streamlines the process of team formation, project management, and mentor assignment, 
            creating a supportive ecosystem where FRCRCE students can develop both technical expertise and 
            essential soft skills required in today's competitive landscape.
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 shadow-md">
            <Typography variant="h5" className="font-bold mb-3">For Students</Typography>
            <Typography>
              Connect with fellow FRCRCE students, form project teams based on shared interests, and 
              receive guidance from experienced mentors to enhance your skills and portfolio.
            </Typography>
          </Card>
          
          <Card className="p-6 shadow-md">
            <Typography variant="h5" className="font-bold mb-3">For Mentors</Typography>
            <Typography>
              Guide and support FRCRCE students as they work on innovative projects, sharing your expertise 
              while staying connected with fresh perspectives from the next generation of engineers.
            </Typography>
          </Card>
          
          <Card className="p-6 shadow-md">
            <Typography variant="h5" className="font-bold mb-3">For Admins</Typography>
            <Typography>
              Facilitate connections between FRCRCE students and mentors, manage teams and projects, 
              and create an environment that fosters educational growth and innovation.
            </Typography>
          </Card>
        </div>
        
        {/* Company Image */}
        <div className="mt-16 mb-6 text-center">
          <Typography variant="h4" className="font-bold mb-6">Our Vision</Typography>
          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-w-16 aspect-h-9 relative" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Typography className="text-gray-500">
                  FRCRCE Campus Image
                </Typography>
              </div>
            </div>
            <div className="p-6 bg-white">
              <Typography variant="h5" className="font-medium mb-2">
                Empowering FRCRCE Students
              </Typography>
              <Typography className="text-gray-600">
                ElevateX was born from a vision to transform how FRCRCE students collaborate on projects 
                and prepare for their careers. We aim to create a thriving community where students can 
                showcase their talents, learn from mentors, and develop innovative solutions to real-world problems.
                By connecting students across departments and years of study, we foster a rich learning 
                environment that mirrors professional workplaces and encourages interdisciplinary thinking.
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 