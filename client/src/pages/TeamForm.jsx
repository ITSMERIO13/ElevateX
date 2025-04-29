import { useState } from 'react';
import { Globe, Github, Upload, Save, X } from 'lucide-react';

export default function ProjectSubmission() {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [selectedSDGs, setSelectedSDGs] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState('');
const [description, setDescription] = useState('');



  const sdgGoals = [
    { id: 1, name: "No Poverty", color: "bg-red-600" },
    { id: 2, name: "Zero Hunger", color: "bg-yellow-600" },
    { id: 3, name: "Good Health and Well-being", color: "bg-green-600" },
    { id: 4, name: "Quality Education", color: "bg-red-400" },
    { id: 5, name: "Gender Equality", color: "bg-orange-600" },
    { id: 6, name: "Clean Water and Sanitation", color: "bg-blue-500" },
    { id: 7, name: "Affordable and Clean Energy", color: "bg-yellow-500" },
    { id: 8, name: "Decent Work and Economic Growth", color: "bg-red-700" },
    { id: 9, name: "Industry, Innovation and Infrastructure", color: "bg-orange-500" },
    { id: 10, name: "Reduced Inequalities", color: "bg-pink-600" },
    { id: 11, name: "Sustainable Cities and Communities", color: "bg-yellow-700" },
    { id: 12, name: "Responsible Consumption and Production", color: "bg-amber-600" },
    { id: 13, name: "Climate Action", color: "bg-green-700" },
    { id: 14, name: "Life Below Water", color: "bg-blue-700" },
    { id: 15, name: "Life on Land", color: "bg-green-800" },
    { id: 16, name: "Peace, Justice and Strong Institutions", color: "bg-blue-800" },
    { id: 17, name: "Partnerships for the Goals", color: "bg-purple-800" }
  ];

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSDG = (sdgId) => {
    if (selectedSDGs.includes(sdgId)) {
      setSelectedSDGs(selectedSDGs.filter(id => id !== sdgId));
    } else {
      setSelectedSDGs([...selectedSDGs, sdgId]);
    }
  };

  const removePreview = () => {
    setThumbnailPreview(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-8">
      <h1 className="text-3xl font-bold mb-2">Submit Team Project</h1>
      <p className="text-neutral-400 mb-8">Showcase your innovation and creativity</p>
      
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <form className="space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-lg font-medium mb-3">Project Thumbnail</label>
            <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
  {thumbnailPreview ? (
    <div className="relative w-full h-[500px] bg-neutral-800 rounded-lg overflow-hidden"> {/* Increased height */}
      <img 
        src={thumbnailPreview} 
        alt="Thumbnail preview" 
        className="w-full h-full object-contain"
      />
      <button 
        type="button"
        onClick={removePreview}
        className="absolute top-2 right-2 bg-black bg-opacity-70 p-1 rounded-full hover:bg-opacity-100 transition-all"
      >
        <X size={18} />
      </button>
    </div>
  ) : (
    <div className="w-full h-[500px] border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center p-6 bg-neutral-800 bg-opacity-40">
      <Upload size={48} className="text-neutral-500 mb-3" />
      <p className="text-neutral-400 text-center mb-4">Drag and drop your thumbnail here or click to browse</p>
      <p className="text-neutral-500 text-sm text-center">Recommended size: 1200 x 630 pixels (16:9)</p>
    </div>
  )}
</div>

              
              <div className="lg:w-1/3">
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-3">Thumbnail Guidelines</h3>
                  <ul className="text-sm text-neutral-400 space-y-2">
                    <li>• Use high-quality visuals that represent your project</li>
                    <li>• Avoid text-heavy images</li>
                    <li>• Maximum file size: 2MB</li>
                    <li>• Supported formats: JPG, PNG, WebP</li>
                  </ul>
                  
                  <label className="mt-4 block">
                    <span className="sr-only">Choose thumbnail</span>
                    <input 
                      type="file" 
                      className="block w-full text-sm text-neutral-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-medium
                        file:bg-neutral-800 file:text-black
                        hover:file:bg-purple-800 hover:file:text-gray-200"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Project Title</label>
            <input 
  type="text" 
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full bg-black border border-neutral-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
  placeholder="Enter your project title"
/>

          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea 
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full bg-black border border-neutral-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-32"
  placeholder="Describe your project, its purpose, and the technology used"
  rows={6}
/>

          </div>

          <div>
            <label className="block text-lg font-medium mb-3">SDG Goals</label>
            <p className="text-neutral-400 text-sm mb-4">Select the Sustainable Development Goals your project addresses</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sdgGoals.map(sdg => (
                <button
                  key={sdg.id}
                  type="button"
                  className={`flex items-center p-3 rounded-lg transition-all text-left ${
                    selectedSDGs.includes(sdg.id)
                      ? `${sdg.color} text-white`
                      : 'bg-neutral-800 hover:bg-neutral-700'
                  }`}
                  onClick={() => toggleSDG(sdg.id)}
                >
                  <div className={`w-8 h-8 rounded-full ${selectedSDGs.includes(sdg.id) ? 'bg-black bg-opacity-20' : sdg.color} flex items-center justify-center mr-3`}>
                    {sdg.id}
                  </div>
                  <span className="text-sm">{sdg.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">GitHub Repository</label>
            <div className="flex items-center">
              <div className="bg-neutral-800 p-3 rounded-l-lg border-y border-l border-neutral-800">
                <Github size={20} />
              </div>
              <input 
                type="text" 
                className="flex-1 bg-black border border-neutral-800 rounded-r-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://github.com/username/project-repo"
              />
            </div>
          </div>
          
          {selectedSDGs.length > 0 && (
            <div>
              <label className="block text-md font-medium mb-2">Selected Goals</label>
              <div className="flex flex-wrap gap-2">
                {selectedSDGs.map(id => {
                  const sdg = sdgGoals.find(goal => goal.id === id);
                  return (
                    <span key={id} className={`${sdg.color} px-3 py-1 rounded-full text-sm flex items-center`}>
                      {sdg.name}
                      <button 
                        type="button" 
                        onClick={() => toggleSDG(id)}
                        className="ml-2 hover:bg-black hover:bg-opacity-20 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
            >
              <Save className="mr-2" size={18} />
              Submit Project
            </button>
            
            <button 
  type="button" 
  onClick={() => setShowPreview(true)}
  className="bg-black border border-purple-700 hover:bg-neutral-900 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
>
  <Globe className="mr-2" size={18} />
  Preview
</button>

          </div>
        </form>
        {showPreview && (
  <div className="fixed inset-0 z-50">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center blur-md brightness-50"
      style={{ backgroundImage: `url(${thumbnailPreview})` }}
    />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-70" />

    {/* Modal Content */}
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-4xl shadow-lg relative">
        {/* Close Button */}
        <button 
          onClick={() => setShowPreview(false)} 
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Full-Width Thumbnail */}
        {thumbnailPreview && (
          <img 
            src={thumbnailPreview} 
            alt="Preview" 
            className="w-full h-[400px] object-cover rounded-md mb-6"
          />
        )}

        <h2 className="text-2xl font-bold mb-4">Project Preview</h2>

        <h3 className="text-lg font-semibold mb-1">Title</h3>
        <p className="mb-4 text-neutral-300">{title || "No title provided"}</p>

        <h3 className="text-lg font-semibold mb-1">Description</h3>
        <p className="mb-6 text-neutral-300 whitespace-pre-line">{description || "No description provided."}</p>

        {selectedSDGs.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Selected SDGs</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSDGs.map(id => {
                const sdg = sdgGoals.find(goal => goal.id === id);
                return (
                  <span key={id} className={`${sdg.color} px-3 py-1 rounded-full text-sm`}>
                    {sdg.name}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
