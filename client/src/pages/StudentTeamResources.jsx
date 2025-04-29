import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Code, ExternalLink, 
  Star, Tag, Calendar, FileType, Video, BookMarked, 
  Library, Github, GraduationCap, Info, 
  BarChart, Search, Newspaper
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const StudentTeamResources = () => {
  const { teamId } = useParams();
  const [resources, setResources] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
  }, [teamId]);

  useEffect(() => {
    filterResources();
  }, [resources, activeFilter, searchQuery]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5500/api/resources/team/${teamId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      setResources(data.resources || []);
      setMetadata(data.metadata || null);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load recommended resources');
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === activeFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query) ||
        resource.topics.some(topic => topic.toLowerCase().includes(query)) ||
        resource.languages.some(lang => lang.toLowerCase().includes(query)) ||
        resource.frameworks.some(framework => framework.toLowerCase().includes(query))
      );
    }
    
    setFilteredResources(filtered);
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'tutorial':
        return <GraduationCap className="h-5 w-5" />;
      case 'documentation':
        return <FileType className="h-5 w-5" />;
      case 'tool':
        return <FileType className="h-5 w-5" />;
      case 'library':
        return <Library className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'book':
        return <BookMarked className="h-5 w-5" />;
      case 'course':
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-900/20 text-green-300 border-green-900';
      case 'intermediate':
        return 'bg-blue-900/20 text-blue-300 border-blue-900';
      case 'advanced':
        return 'bg-red-900/20 text-red-300 border-red-900';
      default:
        return 'bg-gray-900/20 text-gray-300 border-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-32 bg-gray-800 rounded-md animate-pulse mb-8"></div>
          <div className="h-12 w-96 bg-gray-800 rounded-md animate-pulse mb-6"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Link 
          to={`/team/${teamId}`} 
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Team
        </Link>

        {/* News Banner */}
        <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-800/50 rounded-full p-2">
              <Newspaper className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Personalized Tech News</h3>
              <p className="text-indigo-300 text-sm">
                {metadata?.projectTitle 
                  ? `Get the latest news on ${metadata.projectTitle} technologies like ${metadata?.detectedLanguages?.join(', ') || ''} ${metadata?.detectedFrameworks?.length ? '& ' + metadata.detectedFrameworks.join(', ') : ''}`
                  : "Stay updated with tech news tailored to your project's technologies"}
              </p>
            </div>
          </div>
          <Link 
            to={`/team/${teamId}/news`}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md transition-colors flex items-center gap-2"
          >
            <Newspaper className="h-4 w-4" />
            View News
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Recommended Resources</h1>
            {metadata && (
              <p className="mt-2 text-gray-300">
                For project: <span className="text-indigo-300">{metadata.projectTitle}</span>
              </p>
            )}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white 
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Display detected technologies */}
        {metadata && (metadata.detectedLanguages.length > 0 || metadata.detectedFrameworks.length > 0) && (
          <div className="mb-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-3">Technologies Detected in Your Project</h2>
            <div className="flex flex-wrap gap-2">
              {metadata.detectedLanguages.map(lang => (
                <span key={lang} className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-800 rounded-full text-sm">
                  {lang}
                </span>
              ))}
              {metadata.detectedFrameworks.map(framework => (
                <span key={framework} className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-800 rounded-full text-sm">
                  {framework}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${activeFilter === 'all' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('article')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                      ${activeFilter === 'article' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <BookOpen className="h-4 w-4" />
            Articles
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                      ${activeFilter === 'video' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <Video className="h-4 w-4" />
            Videos
          </button>
          <button
            onClick={() => setActiveFilter('tutorial')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                      ${activeFilter === 'tutorial' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <GraduationCap className="h-4 w-4" />
            Tutorials
          </button>
          <button
            onClick={() => setActiveFilter('tool')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                      ${activeFilter === 'tool' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <FileType className="h-4 w-4" />
            Tools
          </button>
          <button
            onClick={() => setActiveFilter('library')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                      ${activeFilter === 'library' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <Library className="h-4 w-4" />
            Libraries
          </button>
        </div>
        
        {/* Resources grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-lg">
            <Info className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Resources Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {resources.length === 0 
                ? "We don't have any resources matching your project yet." 
                : "No resources match your current filter or search criteria."}
            </p>
            {activeFilter !== 'all' && (
              <button 
                onClick={() => setActiveFilter('all')} 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Show All Resources
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource._id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col hover:border-indigo-600 transition-colors duration-200">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className={`rounded-md p-2 ${
                      resource.type === 'article' ? 'bg-blue-900/30' :
                      resource.type === 'video' ? 'bg-red-900/30' :
                      resource.type === 'tutorial' ? 'bg-green-900/30' :
                      resource.type === 'documentation' ? 'bg-yellow-900/30' :
                      resource.type === 'tool' ? 'bg-purple-900/30' :
                      resource.type === 'library' ? 'bg-pink-900/30' :
                      resource.type === 'github' ? 'bg-gray-700' :
                      'bg-indigo-900/30'
                    }`}>
                      {getResourceTypeIcon(resource.type)}
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(resource.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mt-3 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3 text-sm">
                    {resource.description}
                  </p>
                  
                  {(resource.languages.length > 0 || resource.frameworks.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.languages.map(lang => (
                        <span key={lang} className="px-2 py-1 bg-blue-900/20 text-blue-300 border border-blue-900/50 rounded text-xs">
                          {lang}
                        </span>
                      ))}
                      {resource.frameworks.map(framework => (
                        <span key={framework} className="px-2 py-1 bg-purple-900/20 text-purple-300 border border-purple-900/50 rounded text-xs">
                          {framework}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(parseISO(resource.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className={`px-2 py-1 rounded border ${getLevelColor(resource.level)}`}>
                      {resource.level}
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto border-t border-gray-700">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-3 text-center bg-gray-700 hover:bg-indigo-600 transition-colors text-white font-medium flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Resource
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTeamResources; 