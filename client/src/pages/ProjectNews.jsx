import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Newspaper, RefreshCw, Globe, Zap, ArrowLeft,
  BookOpen, AlertCircle, FileText, Filter, SlidersHorizontal, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectNews = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!teamId) return;
    fetchProjectData();
  }, [teamId]);
  
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      // Get project metadata
      const response = await fetch(`http://localhost:5500/api/resources/team/${teamId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      
      const data = await response.json();
      setMetadata(data.metadata || null);
      
      // Fetch news after getting project details
      if (data.metadata) {
        generateProjectNews(data.metadata);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('Failed to load project news');
    } finally {
      setLoading(false);
    }
  };
  
  const generateProjectNews = (metadata) => {
    // Get technologies from project
    const technologies = [
      ...(metadata.detectedLanguages || []),
      ...(metadata.detectedFrameworks || [])
    ];
    
    // If no technologies detected, use some defaults
    if (technologies.length === 0) {
      technologies.push('software development', 'coding', 'technology');
    }
    
    // Generate mock news based on project details
    const generatedNews = generateMockNews(technologies, metadata.projectTitle);
    setNews(generatedNews);
  };
  
  const refreshNews = () => {
    if (metadata) {
      generateProjectNews(metadata);
      toast.success('News feed updated!');
    }
  };
  
  // Filter news based on category and search query
  const filteredNews = news.filter(item => {
    // Filter by category
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Helper to generate mock news
  const generateMockNews = (technologies, projectTitle) => {
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Generate different categories of news
    return [
      // Technology updates
      {
        id: 1,
        title: `Latest ${technologies[0] || 'Tech'} Framework Updates Released`,
        description: `Major improvements and new features for ${technologies[0] || 'software'} development frameworks that will impact projects like ${projectTitle || 'yours'}. The update includes performance optimizations, security patches, and new developer tools.`,
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        date: new Date(currentDate.getTime() - oneDay * 2).toLocaleDateString(),
        category: 'updates',
        important: true
      },
      {
        id: 2,
        title: `${technologies[0] || 'Development'} Version 2.0 Announced with AI Integration`,
        description: `The latest version introduces AI-powered code completion, automated testing, and performance optimization tools that could reduce development time by up to 40%.`,
        source: 'The Verge',
        url: 'https://theverge.com',
        date: new Date(currentDate.getTime() - oneDay * 3).toLocaleDateString(),
        category: 'updates',
        important: false
      },
      
      // Conferences and events
      {
        id: 3,
        title: `${technologies[1] || 'Programming'} Global Conference 2025 Announced`,
        description: `Annual ${technologies[1] || 'developer'} conference announces dates and early registration for the biggest event of the year. Featured speakers from top tech companies will discuss latest trends and advancements.`,
        source: 'Dev.to',
        url: 'https://dev.to',
        date: new Date(currentDate.getTime() - oneDay * 5).toLocaleDateString(),
        category: 'events',
        important: false
      },
      {
        id: 4,
        title: `Local ${technologies[0] || 'Tech'} Hackathon Looking for Participants`,
        description: `Join the upcoming hackathon centered around ${technologies[0] || 'technology'} innovations. Great opportunity for networking and showcasing your skills on projects similar to ${projectTitle || 'yours'}.`,
        source: 'Meetup',
        url: 'https://meetup.com',
        date: new Date(currentDate.getTime() - oneDay * 1).toLocaleDateString(),
        category: 'events',
        important: false
      },
      
      // Security
      {
        id: 5,
        title: `Critical Security Vulnerability Found in ${technologies[0] || 'Software'} Libraries`,
        description: `Security researchers have discovered a high-severity vulnerability affecting ${technologies[0] || 'software'} libraries. Developers are urged to update immediately to patched versions to protect their applications.`,
        source: 'ZDNet',
        url: 'https://zdnet.com',
        date: currentDate.toLocaleDateString(),
        category: 'security',
        important: true
      },
      {
        id: 6,
        title: `Best Security Practices for ${technologies[1] || 'Web'} Applications in 2025`,
        description: `Comprehensive guide on implementing robust security measures for modern ${technologies[1] || 'web'} applications. Includes practical examples and code snippets to enhance your application's security posture.`,
        source: 'Security Weekly',
        url: 'https://securityweekly.com',
        date: new Date(currentDate.getTime() - oneDay * 4).toLocaleDateString(),
        category: 'security',
        important: false
      },
      
      // Industry trends
      {
        id: 7,
        title: `${technologies[0] || 'Tech'} Industry Growth Projections for 2025-2026`,
        description: `Market analysis reveals continued growth in the ${technologies[0] || 'tech'} sector despite economic challenges. Demand for specialized developers remains high with increasing salaries across the industry.`,
        source: 'Forbes Tech',
        url: 'https://forbes.com/tech',
        date: new Date(currentDate.getTime() - oneDay * 6).toLocaleDateString(),
        category: 'trends',
        important: false
      },
      {
        id: 8,
        title: `How ${technologies[1] || 'Technology'} is Revolutionizing Industry Solutions`,
        description: `Case studies on how ${technologies[1] || 'technology'} implementations are transforming traditional business processes and creating new opportunities across multiple sectors.`,
        source: 'HackerNoon',
        url: 'https://hackernoon.com',
        date: new Date(currentDate.getTime() - oneDay * 7).toLocaleDateString(),
        category: 'trends',
        important: false
      },
      
      // Learning resources
      {
        id: 9,
        title: `New ${technologies[0] || 'Programming'} Tutorial Series for Advanced Developers`,
        description: `Comprehensive video series covering advanced ${technologies[0] || 'programming'} techniques, architectural patterns, and best practices for building scalable applications.`,
        source: 'FreeCodeCamp',
        url: 'https://freecodecamp.org',
        date: new Date(currentDate.getTime() - oneDay * 2).toLocaleDateString(),
        category: 'learning',
        important: false
      },
      {
        id: 10,
        title: `University Partners with Industry to Offer ${technologies[1] || 'Tech'} Certification`,
        description: `New certification program combines academic rigor with practical industry knowledge for ${technologies[1] || 'technology'} professionals looking to advance their careers.`,
        source: 'EdTech Magazine',
        url: 'https://edtechmagazine.com',
        date: new Date(currentDate.getTime() - oneDay * 9).toLocaleDateString(),
        category: 'learning',
        important: false
      },
      
      // Job market
      {
        id: 11,
        title: `${technologies[0] || 'Developer'} Job Market Outlook for Recent Graduates`,
        description: `Analysis of current job market trends for entry-level ${technologies[0] || 'developer'} positions, including salary expectations, in-demand skills, and interview preparation advice.`,
        source: 'Stack Overflow Blog',
        url: 'https://stackoverflow.blog',
        date: new Date(currentDate.getTime() - oneDay * 3).toLocaleDateString(),
        category: 'jobs',
        important: false
      },
      {
        id: 12,
        title: `Tech Companies Hiring ${technologies[1] || 'Software'} Specialists Remotely`,
        description: `Comprehensive list of companies offering remote positions for ${technologies[1] || 'software'} specialists, including information about their work culture and benefits.`,
        source: 'Remote OK',
        url: 'https://remoteok.com',
        date: new Date(currentDate.getTime() - oneDay * 8).toLocaleDateString(),
        category: 'jobs',
        important: false
      },
      
      // Open source
      {
        id: 13,
        title: `Popular ${technologies[0] || 'Open Source'} Project Seeks Contributors`,
        description: `Major ${technologies[0] || 'open source'} project is looking for contributors to help with development, documentation, and testing. Great opportunity for developers to gain experience and visibility.`,
        source: 'GitHub Blog',
        url: 'https://github.blog',
        date: currentDate.toLocaleDateString(),
        category: 'opensource',
        important: false
      },
      {
        id: 14,
        title: `New ${technologies[1] || 'Software'} Library Released as Open Source`,
        description: `A newly developed ${technologies[1] || 'software'} library has been released as open source. The library promises to simplify common development tasks and improve application performance.`,
        source: 'Open Source Weekly',
        url: 'https://opensourceweekly.org',
        date: new Date(currentDate.getTime() - oneDay * 5).toLocaleDateString(),
        category: 'opensource',
        important: false
      },
      
      // AI integration
      {
        id: 15,
        title: `AI-Powered Tools for ${technologies[0] || 'Software'} Development in 2025`,
        description: `Breakthrough AI technologies are transforming how ${technologies[0] || 'software'} is developed, tested, and maintained. Learn about the latest tools that can enhance developer productivity.`,
        source: 'MIT Technology Review',
        url: 'https://technologyreview.com',
        date: new Date(currentDate.getTime() - oneDay * 4).toLocaleDateString(),
        category: 'ai',
        important: false
      }
    ];
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-gray-800 rounded mb-6"></div>
            <div className="h-12 w-full bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`/team/${teamId}/resources`)}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Resources</span>
          </button>
          
          <button
            onClick={refreshNews}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh News</span>
          </button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Newspaper className="h-7 w-7 text-indigo-400" />
            Project News Hub
          </h1>
          <p className="text-gray-400">
            Stay updated with the latest news and trends related to {metadata?.projectTitle || 'your project'} technologies.
          </p>
        </div>
        
        {/* Search and filter bar */}
        <div className="mb-8 bg-gray-800/70 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300 text-sm whitespace-nowrap">Filter by:</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                activeCategory === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All News
            </button>
            <button
              onClick={() => setActiveCategory('updates')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
                activeCategory === 'updates' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Updates</span>
            </button>
            <button
              onClick={() => setActiveCategory('security')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
                activeCategory === 'security' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveCategory('events')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
                activeCategory === 'events' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Events</span>
            </button>
            <button
              onClick={() => setActiveCategory('trends')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
                activeCategory === 'trends' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Trends</span>
            </button>
            <button
              onClick={() => setActiveCategory('learning')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
                activeCategory === 'learning' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Learning</span>
            </button>
            <button
              onClick={() => setActiveCategory('jobs')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
                activeCategory === 'jobs' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Jobs</span>
            </button>
            <button
              onClick={() => setActiveCategory('opensource')}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
                activeCategory === 'opensource' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Open Source</span>
            </button>
          </div>
        </div>
        
        {/* News listings */}
        {filteredNews.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <SlidersHorizontal className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No News Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              No news articles match your current search criteria.
            </p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }} 
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Important news at the top */}
            {filteredNews.filter(item => item.important).length > 0 && (
              <div className="bg-indigo-900/20 border border-indigo-800/50 rounded-lg overflow-hidden mb-6">
                <div className="bg-indigo-900/40 px-4 py-2 border-b border-indigo-800/50">
                  <h2 className="text-indigo-300 font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Important Updates
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {filteredNews.filter(item => item.important).map(news => (
                    <div key={news.id} className="bg-gray-800/70 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">
                          {news.title}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{news.date}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        {news.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
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
                          <span>Read Full Article</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Regular news items */}
            {filteredNews.filter(item => !item.important).map(news => (
              <div 
                key={news.id} 
                className={`bg-gray-800 border ${
                  news.category === 'security' ? 'border-red-700/30' :
                  news.category === 'updates' ? 'border-blue-700/30' :
                  news.category === 'events' ? 'border-green-700/30' :
                  news.category === 'trends' ? 'border-purple-700/30' :
                  news.category === 'learning' ? 'border-yellow-700/30' :
                  news.category === 'jobs' ? 'border-emerald-700/30' :
                  news.category === 'opensource' ? 'border-orange-700/30' :
                  news.category === 'ai' ? 'border-cyan-700/30' :
                  'border-gray-700'
                } rounded-lg p-5`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md self-start ${
                      news.category === 'security' ? 'bg-red-900/20 text-red-400' : 
                      news.category === 'updates' ? 'bg-blue-900/20 text-blue-400' :
                      news.category === 'events' ? 'bg-green-900/20 text-green-400' :
                      news.category === 'trends' ? 'bg-purple-900/20 text-purple-400' :
                      news.category === 'learning' ? 'bg-yellow-900/20 text-yellow-400' :
                      news.category === 'jobs' ? 'bg-emerald-900/20 text-emerald-400' :
                      news.category === 'opensource' ? 'bg-orange-900/20 text-orange-400' :
                      news.category === 'ai' ? 'bg-cyan-900/20 text-cyan-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {news.category === 'security' && <AlertCircle className="h-5 w-5" />}
                      {news.category === 'updates' && <FileText className="h-5 w-5" />}
                      {news.category === 'events' && <BookOpen className="h-5 w-5" />}
                      {news.category === 'trends' && <Filter className="h-5 w-5" />}
                      {news.category === 'learning' && <BookOpen className="h-5 w-5" />}
                      {news.category === 'jobs' && <BookOpen className="h-5 w-5" />}
                      {news.category === 'opensource' && <BookOpen className="h-5 w-5" />}
                      {news.category === 'ai' && <BookOpen className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 mb-3">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {news.source}
                        </span>
                        <span className="text-xs text-gray-500">{news.date}</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {news.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-4">
                  <span className="capitalize text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                    {news.category}
                  </span>
                  <a 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1.5"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Read Full Article</span>
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

export default ProjectNews; 