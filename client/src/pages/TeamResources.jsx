import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, Video, Wrench, Library, GraduationCap, 
  FileText, Github, Search, ExternalLink,
  ArrowLeft, SlidersHorizontal, Sparkles, 
  Newspaper, RefreshCw, Globe, Zap, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const TeamResources = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [techNews, setTechNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    fetchResources();
  }, [teamId]);
  
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
      
      // Fetch tech news after getting project details
      if (data.metadata) {
        fetchTechNews(data.metadata);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources for this team');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTechNews = async (metadata) => {
    try {
      setLoadingNews(true);
      
      // Create a search query based on project details
      const techQueryTerms = [];
      
      // Add languages and frameworks to search terms
      if (metadata.detectedLanguages && metadata.detectedLanguages.length > 0) {
        techQueryTerms.push(...metadata.detectedLanguages);
      }
      
      if (metadata.detectedFrameworks && metadata.detectedFrameworks.length > 0) {
        techQueryTerms.push(...metadata.detectedFrameworks);
      }
      
      // If no specific tech was detected, use some defaults
      if (techQueryTerms.length === 0) {
        techQueryTerms.push('software development', 'coding', 'technology');
      }
      
      // Create a news search query using project details
      const searchQuery = `latest ${techQueryTerms.slice(0, 3).join(' ')} news`;
      
      // This would normally use a real news API, but for demo purposes
      // we'll generate some mock news based on the technologies
      const mockNews = generateMockTechNews(techQueryTerms, metadata.projectTitle);
      setTechNews(mockNews);
    } catch (error) {
      console.error('Error fetching tech news:', error);
      // Don't show error toast for news - non-critical feature
    } finally {
      setLoadingNews(false);
    }
  };
  
  const refreshTechNews = () => {
    if (metadata) {
      fetchTechNews(metadata);
      toast.success('Updating tech news...');
    }
  };
  
  // Helper to generate mock news based on project technologies
  const generateMockTechNews = (technologies, projectTitle) => {
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const mockNewsItems = [
      {
        title: `Latest ${technologies[0] || 'Software'} Framework Trends for 2025`,
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        date: new Date(currentDate.getTime() - oneDay * 2).toLocaleDateString(),
        description: `New features and improvements in ${technologies[0] || 'software'} development are revolutionizing how teams build applications. Learn what's trending and how it might impact projects like ${projectTitle || 'yours'}.`
      },
      {
        title: `${technologies[1] || 'Programming'} Conference Announces Virtual Event Series`,
        source: 'Dev.to',
        url: 'https://dev.to',
        date: new Date(currentDate.getTime() - oneDay * 5).toLocaleDateString(),
        description: `The annual ${technologies[1] || 'programming'} conference is going virtual this year with expanded workshops and networking opportunities for developers around the world.`
      },
      {
        title: `Major Security Update for ${technologies[0] || 'Development'} Tools`,
        source: 'ZDNet',
        url: 'https://zdnet.com',
        date: new Date(currentDate.getTime() - oneDay * 1).toLocaleDateString(),
        description: `Important security patches released for popular ${technologies[0] || 'development'} tools. Developers should update immediately to protect their projects.`
      },
      {
        title: `${technologies[2] || 'Tech'} Industry Growth Continues Despite Economic Challenges`,
        source: 'The Verge',
        url: 'https://theverge.com',
        date: new Date(currentDate.getTime() - oneDay * 3).toLocaleDateString(),
        description: `Despite global economic uncertainty, the ${technologies[2] || 'tech'} sector continues to see remarkable growth and investment, with startups focusing on innovation.`
      },
      {
        title: `New ${technologies[0] || 'Software'} Library Simplifies Common Development Tasks`,
        source: 'GitHub Blog',
        url: 'https://github.blog',
        date: currentDate.toLocaleDateString(),
        description: `A newly released open-source library for ${technologies[0] || 'software'} development promises to reduce boilerplate code by up to 40% while improving application performance.`
      }
    ];
    
    return mockNewsItems;
  };
  
  const generateResources = async () => {
    try {
      setGenerating(true);
      toast.loading('Analyzing project and generating relevant resources...');
      
      const response = await fetch(`http://localhost:5500/api/resources/generate/team/${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate resources');
      }
      
      toast.dismiss();
      toast.success('AI has generated relevant resources for your project!');
      
      // Fetch the updated resources
      fetchResources();
    } catch (error) {
      console.error('Error generating resources:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to generate resources');
    } finally {
      setGenerating(false);
    }
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
        resource.title?.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        resource.topics?.some(t => t.toLowerCase().includes(query)) ||
        resource.languages?.some(l => l.toLowerCase().includes(query)) ||
        resource.frameworks?.some(f => f.toLowerCase().includes(query))
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
        <button
          onClick={() => navigate(`/team/${teamId}`)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Team</span>
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Recommended Resources
            </h1>
            <p className="mt-2 text-gray-300">
              For project: {metadata?.projectTitle || 'Your Project'}
            </p>
          </div>
          
          {resources.length === 0 && (
            <button
              onClick={generateResources}
              disabled={generating}
              className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md 
                ${generating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-500'} 
                transition-colors`}
            >
              {generating ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                  <span>Analyzing Project...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Resources</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Tech News Section */}
        <div className="mb-10 bg-gray-800/70 border border-gray-700 rounded-lg overflow-hidden">
          <div className="border-b border-gray-700 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Latest Tech News</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshTechNews}
                disabled={loadingNews}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <RefreshCw className={`h-4 w-4 text-gray-400 ${loadingNews ? 'animate-spin' : ''}`} />
              </button>
              <Link 
                to={`/team/${teamId}/news`} 
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-md transition-colors"
              >
                <span>View All News</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          
          <div className="px-4 divide-y divide-gray-700/50">
            {techNews.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-gray-400">Loading latest tech news...</p>
              </div>
            ) : (
              techNews.map((news, index) => (
                <div key={index} className="py-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-indigo-300 font-medium">
                      {news.title}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{news.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    {news.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {news.source}
                    </span>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                    >
                      <Zap className="h-3 w-3" />
                      <span>Read More</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="bg-gray-800/80 border-t border-gray-700 px-4 py-3">
            <Link 
              to={`/team/${teamId}/news`} 
              className="flex items-center justify-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
            >
              <span>View all news for {metadata?.projectTitle || 'your project'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        
        {/* Search and filter section */}
        {resources.length > 0 && (
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
                onClick={() => setActiveFilter('documentation')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                  activeFilter === 'documentation' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Docs</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Resource list */}
        {resources.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <SlidersHorizontal className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Resources Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We don't have any resources matching your project yet.
            </p>
            <button 
              onClick={generateResources}
              disabled={generating}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md 
                ${generating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-500'}`}
            >
              {generating ? 'Analyzing Project...' : 'Generate AI Resources'}
            </button>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <SlidersHorizontal className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Matching Resources</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              No resources match your current filter or search criteria.
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
                    
                    {resource.rating && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-yellow-400 mr-1">{resource.rating}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {resource.languages && resource.languages.map(lang => (
                      <span key={lang} className="px-2 py-0.5 bg-blue-900/20 text-blue-300 text-xs rounded">
                        {lang}
                      </span>
                    ))}
                    {resource.frameworks && resource.frameworks.map(framework => (
                      <span key={framework} className="px-2 py-0.5 bg-purple-900/20 text-purple-300 text-xs rounded">
                        {framework}
                      </span>
                    ))}
                    {resource.level && (
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        resource.level === 'beginner' ? 'bg-green-900/20 text-green-300' :
                        resource.level === 'intermediate' ? 'bg-yellow-900/20 text-yellow-300' :
                        'bg-red-900/20 text-red-300'
                      }`}>
                        {resource.level}
                      </span>
                    )}
                  </div>
                  
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
        
        {/* Project Technology Analysis */}
        {metadata && metadata.detectedLanguages && metadata.detectedLanguages.length > 0 && (
          <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Project Technology Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metadata.detectedLanguages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Detected Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {metadata.detectedLanguages.map(lang => (
                      <span key={lang} className="px-3 py-1 bg-blue-900/20 text-blue-300 text-sm rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {metadata.detectedFrameworks && metadata.detectedFrameworks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Detected Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {metadata.detectedFrameworks.map(framework => (
                      <span key={framework} className="px-3 py-1 bg-purple-900/20 text-purple-300 text-sm rounded-full">
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {metadata.sdgsMatched && metadata.sdgsMatched.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">SDGs Matched</h4>
                  <div className="flex flex-wrap gap-2">
                    {metadata.sdgsMatched.map(sdg => (
                      <span key={sdg} className="px-3 py-1 bg-green-900/20 text-green-300 text-sm rounded-full">
                        SDG {sdg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {metadata.generatedResources && (
              <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <p className="text-indigo-300 text-sm">
                    These resources were automatically generated by AI based on your project's technology stack and goals.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamResources; 