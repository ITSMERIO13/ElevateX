import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Search, Filter, SlidersHorizontal, Trash2, 
  Edit2, ExternalLink, BookOpen, Video, Wrench, Library, 
  GraduationCap, FileText, Github, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const MentorResourceManager = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [generatingResources, setGeneratingResources] = useState(false);
  
  // Form state for adding/editing resources
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'article',
    url: '',
    topics: '',
    languages: '',
    frameworks: '',
    sdgs: '',
    level: 'intermediate',
    rating: 5
  });

  useEffect(() => {
    const mentorData = JSON.parse(localStorage.getItem("elex-user"));
    if (!mentorData) {
      toast.error("Please login first");
      navigate('/auth');
      return;
    }
    
    if (mentorData.userType !== 'Mentor') {
      toast.error("Only mentors can access this page");
      navigate('/');
      return;
    }
    
    setMentor(mentorData);
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5500/api/resources');
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const generateAIResources = async () => {
    try {
      setGeneratingResources(true);
      
      // Get the first project to use for generation (for demo)
      // In a real app, you might want to select a specific project/team
      const response = await fetch('http://localhost:5500/api/resources/generate/project/123456789012', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate resources');
      }
      
      // Fetch the updated resources after generation
      fetchResources();
      toast.success('AI-generated resources added successfully');
    } catch (error) {
      console.error('Error generating resources:', error);
      toast.error(error.message || 'Failed to generate resources');
    } finally {
      setGeneratingResources(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...resourceForm,
        topics: resourceForm.topics.split(',').map(t => t.trim()).filter(Boolean),
        languages: resourceForm.languages.split(',').map(l => l.trim()).filter(Boolean),
        frameworks: resourceForm.frameworks.split(',').map(f => f.trim()).filter(Boolean),
        sdgs: resourceForm.sdgs.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s))
      };
      
      const response = await fetch('http://localhost:5500/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add resource');
      }
      
      toast.success('Resource added successfully');
      setShowAddModal(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error(error.message || 'Failed to add resource');
    }
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    if (!currentResource) return;
    
    try {
      const formData = {
        ...resourceForm,
        topics: resourceForm.topics.split(',').map(t => t.trim()).filter(Boolean),
        languages: resourceForm.languages.split(',').map(l => l.trim()).filter(Boolean),
        frameworks: resourceForm.frameworks.split(',').map(f => f.trim()).filter(Boolean),
        sdgs: resourceForm.sdgs.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s))
      };
      
      const response = await fetch(`http://localhost:5500/api/resources/${currentResource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update resource');
      }
      
      toast.success('Resource updated successfully');
      setShowEditModal(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error(error.message || 'Failed to update resource');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const response = await fetch(`http://localhost:5500/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete resource');
      }
      
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error(error.message || 'Failed to delete resource');
    }
  };

  const resetForm = () => {
    setResourceForm({
      title: '',
      description: '',
      type: 'article',
      url: '',
      topics: '',
      languages: '',
      frameworks: '',
      sdgs: '',
      level: 'intermediate',
      rating: 5
    });
    setCurrentResource(null);
  };

  const editResource = (resource) => {
    setCurrentResource(resource);
    setResourceForm({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      url: resource.url,
      topics: resource.topics.join(', '),
      languages: resource.languages.join(', '),
      frameworks: resource.frameworks.join(', '),
      sdgs: resource.sdgs.join(', '),
      level: resource.level,
      rating: resource.rating
    });
    setShowEditModal(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'tutorial':
        return <GraduationCap className="h-5 w-5" />;
      case 'documentation':
        return <FileText className="h-5 w-5" />;
      case 'tool':
        return <Wrench className="h-5 w-5" />;
      case 'library':
        return <Library className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    // Apply type filter
    if (activeFilter !== 'all' && resource.type !== activeFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.topics.some(t => t.toLowerCase().includes(query)) ||
        resource.languages.some(l => l.toLowerCase().includes(query)) ||
        resource.frameworks.some(f => f.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-gray-800 rounded mb-6"></div>
            <div className="h-12 w-full bg-gray-800 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Learning Resources</h1>
            <p className="mt-2 text-gray-300">
              AI-powered educational resources for your students
            </p>
          </div>
          
          <button
            onClick={generateAIResources}
            disabled={generatingResources}
            className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md 
              ${generatingResources ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-500'} 
              transition-colors`}
          >
            {generatingResources ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                <span>Generating Resources...</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Generate AI Resources</span>
              </>
            )}
          </button>
        </div>
        
        {/* Search and filter section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                activeFilter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('article')}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                activeFilter === 'article' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Articles</span>
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                activeFilter === 'video' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setActiveFilter('tutorial')}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                activeFilter === 'tutorial' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Tutorials</span>
            </button>
          </div>
        </div>
        
        {/* Resource list */}
        {filteredResources.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <SlidersHorizontal className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {resources.length === 0 
                ? "No AI-generated resources available yet. Click the 'Generate AI Resources' button to create resources based on project requirements." 
                : "No resources match your current filter or search criteria."}
            </p>
            {activeFilter !== 'all' && (
              <button 
                onClick={() => setActiveFilter('all')} 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                Show All Resources
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource._id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-md ${
                        resource.type === 'article' ? 'bg-blue-900/30' :
                        resource.type === 'video' ? 'bg-red-900/30' :
                        resource.type === 'tutorial' ? 'bg-green-900/30' :
                        resource.type === 'documentation' ? 'bg-yellow-900/30' :
                        resource.type === 'tool' ? 'bg-purple-900/30' :
                        'bg-indigo-900/30'
                      }`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <span className="text-sm text-gray-400 capitalize">{resource.type}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => editResource(resource)} 
                        className="p-1.5 hover:bg-gray-700 rounded-md"
                      >
                        <Edit2 className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                      <button 
                        onClick={() => handleDeleteResource(resource._id)} 
                        className="p-1.5 hover:bg-gray-700 rounded-md"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {resource.description}
                  </p>
                  
                  {(resource.languages.length > 0 || resource.frameworks.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {resource.languages.map(lang => (
                        <span key={lang} className="px-2 py-0.5 bg-blue-900/20 text-blue-300 text-xs rounded">
                          {lang}
                        </span>
                      ))}
                      {resource.frameworks.map(framework => (
                        <span key={framework} className="px-2 py-0.5 bg-purple-900/20 text-purple-300 text-xs rounded">
                          {framework}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1.5 mt-4"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="underline">View resource</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Add New Resource</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleAddResource}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      required
                      value={resourceForm.description}
                      onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                      <select
                        value={resourceForm.type}
                        onChange={(e) => setResourceForm({...resourceForm, type: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="documentation">Documentation</option>
                        <option value="tool">Tool</option>
                        <option value="library">Library</option>
                        <option value="github">GitHub</option>
                        <option value="book">Book</option>
                        <option value="course">Course</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                      <select
                        value={resourceForm.level}
                        onChange={(e) => setResourceForm({...resourceForm, level: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                    <input
                      type="url"
                      required
                      value={resourceForm.url}
                      onChange={(e) => setResourceForm({...resourceForm, url: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      value={resourceForm.topics}
                      onChange={(e) => setResourceForm({...resourceForm, topics: e.target.value})}
                      placeholder="e.g. web development, frontend, responsive design"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Programming Languages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={resourceForm.languages}
                        onChange={(e) => setResourceForm({...resourceForm, languages: e.target.value})}
                        placeholder="e.g. javascript, python, java"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Frameworks (comma separated)
                      </label>
                      <input
                        type="text"
                        value={resourceForm.frameworks}
                        onChange={(e) => setResourceForm({...resourceForm, frameworks: e.target.value})}
                        placeholder="e.g. react, vue, angular"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      SDG Numbers (comma separated)
                    </label>
                    <input
                      type="text"
                      value={resourceForm.sdgs}
                      onChange={(e) => setResourceForm({...resourceForm, sdgs: e.target.value})}
                      placeholder="e.g. 1, 3, 5, 7"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter SDG numbers (1-17) that this resource relates to</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={resourceForm.rating}
                      onChange={(e) => setResourceForm({...resourceForm, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                  >
                    Add Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Resource Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Edit Resource</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateResource}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      required
                      value={resourceForm.description}
                      onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                      <select
                        value={resourceForm.type}
                        onChange={(e) => setResourceForm({...resourceForm, type: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="documentation">Documentation</option>
                        <option value="tool">Tool</option>
                        <option value="library">Library</option>
                        <option value="github">GitHub</option>
                        <option value="book">Book</option>
                        <option value="course">Course</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                      <select
                        value={resourceForm.level}
                        onChange={(e) => setResourceForm({...resourceForm, level: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                    <input
                      type="url"
                      required
                      value={resourceForm.url}
                      onChange={(e) => setResourceForm({...resourceForm, url: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      value={resourceForm.topics}
                      onChange={(e) => setResourceForm({...resourceForm, topics: e.target.value})}
                      placeholder="e.g. web development, frontend, responsive design"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Programming Languages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={resourceForm.languages}
                        onChange={(e) => setResourceForm({...resourceForm, languages: e.target.value})}
                        placeholder="e.g. javascript, python, java"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Frameworks (comma separated)
                      </label>
                      <input
                        type="text"
                        value={resourceForm.frameworks}
                        onChange={(e) => setResourceForm({...resourceForm, frameworks: e.target.value})}
                        placeholder="e.g. react, vue, angular"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      SDG Numbers (comma separated)
                    </label>
                    <input
                      type="text"
                      value={resourceForm.sdgs}
                      onChange={(e) => setResourceForm({...resourceForm, sdgs: e.target.value})}
                      placeholder="e.g. 1, 3, 5, 7"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter SDG numbers (1-17) that this resource relates to</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={resourceForm.rating}
                      onChange={(e) => setResourceForm({...resourceForm, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                  >
                    Update Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorResourceManager; 