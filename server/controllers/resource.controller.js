import Resource from "../models/Resource.model.js";
import Project from "../models/project.model.js";
import Team from "../models/Team.model.js";
import Mentor from "../models/mentor.model.js";

// Create a new resource
export const createResource = async (req, res) => {
  try {
    const { 
      title, description, type, url, topics, 
      languages, frameworks, sdgs, level, rating 
    } = req.body;
    
    // Get mentor ID from request (assuming authentication middleware sets this)
    const mentorId = req.userId; 
    
    // Validate mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(403).json({ error: "Only mentors can add resources" });
    }
    
    // Create new resource
    const newResource = new Resource({
      title,
      description,
      type,
      url,
      topics: topics || [],
      languages: languages || [],
      frameworks: frameworks || [],
      sdgs: sdgs || [],
      level: level || 'intermediate',
      addedBy: mentorId,
      rating: rating || 5
    });
    
    await newResource.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Resource created successfully", 
      resource: newResource 
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
};

// Generate AI resources automatically
export const generateAIResources = async (req, res) => {
  try {
    const { projectId, teamId } = req.params;
    
    // Seed data for AI-generated resources based on project topic
    let project;
    let team;
    
    if (projectId) {
      project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
    } else if (teamId) {
      team = await Team.findById(teamId).populate("project");
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      if (!team.project) {
        return res.status(404).json({ error: "Team has no project" });
      }
      project = team.project;
    } else {
      return res.status(400).json({ error: "Either projectId or teamId must be provided" });
    }
    
    // Extract keywords from project title and description
    const title = project.title || "";
    const description = project.description || "";
    const sdgs = project.sdgs || [];
    
    const keywords = [...extractKeywords(title), ...extractKeywords(description)];
    
    // Determine likely programming languages and frameworks
    const detectedTechnologies = detectTechnologies(title + " " + description);
    
    // Create static AI-generated resources based on the detected technologies
    const resources = [];
    
    // Add general resources
    const generalResources = getGeneralResources(keywords, sdgs);
    resources.push(...generalResources);
    
    // Add language-specific resources
    if (detectedTechnologies.languages.length > 0) {
      const languageResources = getLanguageResources(detectedTechnologies.languages);
      resources.push(...languageResources);
    }
    
    // Add framework-specific resources
    if (detectedTechnologies.frameworks.length > 0) {
      const frameworkResources = getFrameworkResources(detectedTechnologies.frameworks);
      resources.push(...frameworkResources);
    }
    
    // Save all generated resources
    const savedResources = [];
    for (const resource of resources) {
      const existingResource = await Resource.findOne({ url: resource.url });
      if (!existingResource) {
        const newResource = new Resource({
          ...resource,
          // Use system user or first mentor as the creator
          addedBy: req.userId || "6450121212121212121212" // Replace with a valid ID of a system user
        });
        
        const saved = await newResource.save();
        savedResources.push(saved);
      }
    }
    
    res.status(201).json({
      success: true,
      message: `${savedResources.length} AI resources generated successfully`,
      resources: savedResources
    });
  } catch (error) {
    console.error("Error generating AI resources:", error);
    res.status(500).json({ error: "Failed to generate AI resources" });
  }
};

// Helper function to extract keywords from text
function extractKeywords(text) {
  if (!text) return [];
  
  // Remove common stop words and split into words
  const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by"];
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  
  return words.filter(word => 
    word.length > 3 && !stopWords.includes(word)
  );
}

// Helper function to detect likely technologies
function detectTechnologies(text) {
  const lowercaseText = text.toLowerCase();
  
  // Common programming languages
  const languages = [
    "javascript", "python", "java", "c#", "c++", "typescript", "php", "ruby", 
    "swift", "kotlin", "go", "rust", "scala", "dart", "r"
  ];
  
  // Common frameworks and libraries
  const frameworks = [
    "react", "angular", "vue", "svelte", "node", "express", "django", "flask",
    "spring", "laravel", "ruby on rails", "next.js", "nuxt", "flutter", 
    "android", "ios", "tensorflow", "pytorch", "scikit-learn", "pandas"
  ];
  
  const detectedLanguages = languages.filter(lang => lowercaseText.includes(lang));
  const detectedFrameworks = frameworks.filter(framework => lowercaseText.includes(framework));
  
  return {
    languages: detectedLanguages.length > 0 ? detectedLanguages : ["javascript", "python"],
    frameworks: detectedFrameworks.length > 0 ? detectedFrameworks : []
  };
}

// Helper function for general resources
function getGeneralResources(keywords, sdgs) {
  const resources = [
    {
      title: "GitHub - The Complete Guide",
      description: "Learn everything you need to know about Git and GitHub for effective collaboration and version control in software development.",
      type: "tutorial",
      url: "https://docs.github.com/en/get-started/quickstart",
      topics: ["version control", "collaboration", "git"],
      languages: [],
      frameworks: [],
      sdgs: [],
      level: "beginner",
      rating: 5
    },
    {
      title: "Visual Studio Code - Editor Setup and Productivity Tips",
      description: "Make the most of VS Code with extensions, shortcuts, and configurations to boost your development workflow.",
      type: "article",
      url: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks",
      topics: ["tools", "productivity", "editor"],
      languages: [],
      frameworks: [],
      sdgs: [],
      level: "beginner",
      rating: 5
    },
    {
      title: "The Pragmatic Programmer: Your Journey to Mastery",
      description: "Essential reading for all developers focused on practical advice and best practices for writing maintainable, high-quality code.",
      type: "book",
      url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      topics: ["best practices", "software engineering", "career"],
      languages: [],
      frameworks: [],
      sdgs: [],
      level: "intermediate",
      rating: 5
    }
  ];
  
  // Add SDG-specific resources
  if (sdgs.includes(1) || sdgs.includes(2)) {
    resources.push({
      title: "Technology Solutions for Zero Hunger",
      description: "Explore how technology is being used to address SDG 2: Zero Hunger through agricultural innovations, supply chain improvements, and more.",
      type: "article",
      url: "https://sdgs.un.org/goals/goal2",
      topics: ["sustainability", "agriculture", "food security"],
      languages: [],
      frameworks: [],
      sdgs: [1, 2],
      level: "intermediate",
      rating: 4
    });
  }
  
  if (sdgs.includes(3)) {
    resources.push({
      title: "Digital Health Innovations for Global Health",
      description: "Learn about healthcare technologies and digital solutions addressing SDG 3: Good Health and Well-being globally.",
      type: "article",
      url: "https://sdgs.un.org/goals/goal3",
      topics: ["healthcare", "digital health", "telemedicine"],
      languages: [],
      frameworks: [],
      sdgs: [3],
      level: "intermediate",
      rating: 4
    });
  }
  
  if (sdgs.includes(4)) {
    resources.push({
      title: "EdTech Resources for Quality Education",
      description: "Discover educational technologies that support SDG 4: Quality Education through accessible, engaging learning platforms.",
      type: "article",
      url: "https://sdgs.un.org/goals/goal4",
      topics: ["education", "edtech", "e-learning"],
      languages: [],
      frameworks: [],
      sdgs: [4],
      level: "intermediate",
      rating: 4
    });
  }
  
  return resources;
}

// Helper function for language-specific resources
function getLanguageResources(languages) {
  const resources = [];
  
  if (languages.includes("javascript")) {
    resources.push(
      {
        title: "MDN JavaScript Guide",
        description: "Comprehensive JavaScript reference and tutorials from Mozilla Developer Network.",
        type: "documentation",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        topics: ["web development", "frontend"],
        languages: ["javascript"],
        frameworks: [],
        sdgs: [],
        level: "beginner",
        rating: 5
      },
      {
        title: "JavaScript - The Good Parts",
        description: "Classic book focusing on the best features of JavaScript while avoiding its pitfalls.",
        type: "book",
        url: "https://www.oreilly.com/library/view/javascript-the-good/9780596517748/",
        topics: ["web development", "best practices"],
        languages: ["javascript"],
        frameworks: [],
        sdgs: [],
        level: "intermediate",
        rating: 5
      }
    );
  }
  
  if (languages.includes("python")) {
    resources.push(
      {
        title: "Python Official Documentation",
        description: "Comprehensive guides, tutorials, and library references for Python programming.",
        type: "documentation",
        url: "https://docs.python.org/3/",
        topics: ["programming", "data science"],
        languages: ["python"],
        frameworks: [],
        sdgs: [],
        level: "beginner",
        rating: 5
      },
      {
        title: "Automate the Boring Stuff with Python",
        description: "Practical programming for beginners using Python to automate everyday tasks.",
        type: "book",
        url: "https://automatetheboringstuff.com/",
        topics: ["automation", "productivity"],
        languages: ["python"],
        frameworks: [],
        sdgs: [],
        level: "beginner",
        rating: 5
      }
    );
  }
  
  if (languages.includes("java")) {
    resources.push(
      {
        title: "Oracle Java Tutorial",
        description: "Official tutorials for Java programming covering all aspects of the language and platform.",
        type: "documentation",
        url: "https://docs.oracle.com/javase/tutorial/",
        topics: ["enterprise", "mobile"],
        languages: ["java"],
        frameworks: [],
        sdgs: [],
        level: "beginner",
        rating: 4
      }
    );
  }
  
  return resources;
}

// Helper function for framework-specific resources
function getFrameworkResources(frameworks) {
  const resources = [];
  
  if (frameworks.includes("react")) {
    resources.push(
      {
        title: "React Official Documentation",
        description: "Learn React from its official documentation with interactive examples and comprehensive guides.",
        type: "documentation",
        url: "https://react.dev/",
        topics: ["web development", "frontend", "UI"],
        languages: ["javascript"],
        frameworks: ["react"],
        sdgs: [],
        level: "beginner",
        rating: 5
      },
      {
        title: "React Patterns and Best Practices",
        description: "Advanced techniques and patterns for building scalable React applications.",
        type: "article",
        url: "https://reactpatterns.com/",
        topics: ["web development", "architecture"],
        languages: ["javascript"],
        frameworks: ["react"],
        sdgs: [],
        level: "intermediate",
        rating: 4
      }
    );
  }
  
  if (frameworks.includes("node") || frameworks.includes("express")) {
    resources.push(
      {
        title: "Node.js Documentation",
        description: "Official documentation for Node.js runtime and APIs.",
        type: "documentation",
        url: "https://nodejs.org/en/docs/",
        topics: ["backend", "server", "api"],
        languages: ["javascript"],
        frameworks: ["node"],
        sdgs: [],
        level: "beginner",
        rating: 5
      }
    );
  }
  
  if (frameworks.includes("django") || frameworks.includes("flask")) {
    resources.push(
      {
        title: "Django for Beginners",
        description: "Comprehensive guide to building web applications with Django and Python.",
        type: "tutorial",
        url: "https://djangoforbeginners.com/",
        topics: ["web development", "backend"],
        languages: ["python"],
        frameworks: ["django"],
        sdgs: [],
        level: "beginner",
        rating: 4
      }
    );
  }
  
  return resources;
}

// Get all resources with optional filtering
export const getResources = async (req, res) => {
  try {
    // Extract filter parameters
    const { type, topic, language, framework, sdg, level } = req.query;
    
    // Build filter object based on provided parameters
    const filter = {};
    
    if (type) filter.type = type;
    if (level) filter.level = level;
    if (topic) filter.topics = { $in: [topic] };
    if (language) filter.languages = { $in: [language] };
    if (framework) filter.frameworks = { $in: [framework] };
    if (sdg) filter.sdgs = { $in: [parseInt(sdg)] };
    
    // Find resources matching filters
    const resources = await Resource.find(filter)
      .populate("addedBy", "firstName lastName")
      .sort({ createdAt: -1 });
    
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

// Get a specific resource by ID
export const getResourceById = async (req, res) => {
  try {
    const { resourceId } = req.params;
    
    const resource = await Resource.findById(resourceId)
      .populate("addedBy", "firstName lastName");
    
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    
    res.status(200).json(resource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
};

// Update a resource
export const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const mentorId = req.userId;
    
    // Check if resource exists and belongs to the mentor
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    
    if (resource.addedBy.toString() !== mentorId) {
      return res.status(403).json({ error: "Not authorized to update this resource" });
    }
    
    // Update the resource
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      req.body,
      { new: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: "Resource updated successfully", 
      resource: updatedResource 
    });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const mentorId = req.userId;
    
    // Check if resource exists and belongs to the mentor
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    
    if (resource.addedBy.toString() !== mentorId) {
      return res.status(403).json({ error: "Not authorized to delete this resource" });
    }
    
    await Resource.findByIdAndDelete(resourceId);
    
    res.status(200).json({ 
      success: true, 
      message: "Resource deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};

// Get resources for a specific team's project
export const getResourcesForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Find the team and its project
    const team = await Team.findById(teamId).populate("project");
    
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    
    if (!team.project) {
      return res.status(404).json({ error: "Team has no project" });
    }
    
    const project = team.project;
    
    // Get project attributes for matching
    const projectSDGs = project.sdgs || [];
    
    // Find GitHub repo to extract languages from description or other metadata
    const projectDescription = project.description || "";
    const projectTitle = project.title || "";
    
    // Extract potential technologies from project description and title
    const combinedText = `${projectTitle} ${projectDescription}`.toLowerCase();
    
    // Define common programming languages and frameworks to check for
    const languageKeywords = [
      'javascript', 'python', 'java', 'c#', 'c++', 'go', 'ruby', 'rust',
      'php', 'typescript', 'swift', 'kotlin', 'dart', 'html', 'css'
    ];
    
    const frameworkKeywords = [
      'react', 'angular', 'vue', 'svelte', 'node', 'express', 'django',
      'flask', 'spring', 'rails', 'laravel', 'bootstrap', 'tailwind',
      'next.js', 'gatsby', 'flutter', 'react native', 'tensorflow'
    ];
    
    // Find potential languages used in the project
    const detectedLanguages = languageKeywords.filter(lang => 
      combinedText.includes(lang)
    );
    
    // Find potential frameworks used in the project
    const detectedFrameworks = frameworkKeywords.filter(framework => 
      combinedText.includes(framework)
    );
    
    // Prepare query to find relevant resources
    const query = {
      $or: [
        // Match by SDGs
        { sdgs: { $in: projectSDGs } },
        
        // Match by detected languages
        ...(detectedLanguages.length > 0 ? [{ languages: { $in: detectedLanguages } }] : []),
        
        // Match by detected frameworks
        ...(detectedFrameworks.length > 0 ? [{ frameworks: { $in: detectedFrameworks } }] : [])
      ]
    };
    
    // If no filters were detected, don't restrict the query too much
    if (query.$or.length === 0) {
      delete query.$or;
    }
    
    // Find matching resources
    const resources = await Resource.find(query)
      .populate("addedBy", "firstName lastName")
      .sort({ rating: -1 })
      .limit(20);
    
    // If no resources found, generate some
    if (resources.length === 0) {
      // Generate resources automatically
      const mentors = await Mentor.find().limit(1);
      const mentorId = mentors.length > 0 ? mentors[0]._id : null;
      
      if (mentorId) {
        const detectedTech = {
          languages: detectedLanguages.length > 0 ? detectedLanguages : ["javascript"],
          frameworks: detectedFrameworks
        };
        
        // Create resources based on project info
        const aiResources = [
          ...getGeneralResources([], projectSDGs),
          ...getLanguageResources(detectedTech.languages),
          ...getFrameworkResources(detectedTech.frameworks)
        ];
        
        // Save resources to database
        const savedResources = [];
        for (const resource of aiResources) {
          const newResource = new Resource({
            ...resource,
            addedBy: mentorId
          });
          
          await newResource.save();
          savedResources.push(newResource);
        }
        
        // Populate addedBy field
        const populatedResources = await Resource.find({ _id: { $in: savedResources.map(r => r._id) } })
          .populate("addedBy", "firstName lastName")
          .sort({ rating: -1 });
        
        // Structure the response with organized resources
        const response = {
          resources: populatedResources,
          metadata: {
            teamId: team._id,
            projectId: project._id,
            projectTitle: project.title,
            detectedLanguages,
            detectedFrameworks,
            sdgsMatched: projectSDGs,
            generatedResources: true
          }
        };
        
        return res.status(200).json(response);
      }
    }
    
    // Structure the response with organized resources
    const response = {
      resources,
      metadata: {
        teamId: team._id,
        projectId: project._id,
        projectTitle: project.title,
        detectedLanguages,
        detectedFrameworks,
        sdgsMatched: projectSDGs
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching resources for team:", error);
    res.status(500).json({ error: "Failed to fetch resources for team" });
  }
};

export default {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesForTeam,
  generateAIResources
}; 