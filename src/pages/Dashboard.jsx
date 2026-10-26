import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { 
  Plus, 
  FolderOpen, 
  Sparkles, 
  Play, 
  Trash2,
  SlidersHorizontal,
  Flame,
  Film,
  UploadCloud
} from 'lucide-react';
import { getAllProjects, deleteProject } from '../utils/storage';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const stored = await getAllProjects();
        if (stored && stored.length > 0) {
          setProjects(stored);
        } else {
          // Default starter project if none created yet
          const defaultProjects = [
            {
              id: 'proj_travel_vlog',
              name: 'Travel Vlog',
              duration: '00:12:34',
              updatedAt: '2 hours ago',
              resolution: '1920 × 1080 (Full HD)',
              fps: '30 FPS',
              aspect: '16:9',
              thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
            },
            {
              id: 'proj_cinematic',
              name: 'Cinematic Edit',
              duration: '00:03:21',
              updatedAt: '1 day ago',
              resolution: '2560 × 1080 (Ultrawide)',
              fps: '24 FPS',
              aspect: '21:9',
              thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
            },
          ];
          setProjects(defaultProjects);
        }
      } catch {
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Delete this project?')) {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleOpenProject = (project) => {
    localStorage.setItem('active_project_id', project.id);
    localStorage.setItem('active_project_name', project.name);
    navigate('/editor');
  };

  const filteredProjects = projects.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0e12] text-white select-none overflow-hidden font-sans">
      {/* Top Header */}
      <AppHeader 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search projects..."
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Home" />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-[#0f1016]">
          <div className="max-w-6xl mx-auto space-y-7">
            
            {/* Hero Banner (Mockup templates button removed!) */}
            <div className="relative w-full h-[270px] rounded-2xl overflow-hidden border border-[#242738] shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1600" 
                alt="Welcome banner" 
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e12] via-[#0d0e12]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent"></div>

              {/* Banner content */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30 w-fit mb-3">
                  <Flame size={13} className="text-blue-400" />
                  <span>Pro Video Studio</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                  Welcome to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-blue-200">
                    anujkattel Video Editor
                  </span>
                </h1>

                <p className="text-sm text-gray-300 max-w-lg mb-6 leading-relaxed">
                  Import your custom video, image, and audio files. Edit with precision multi-track timeline and AI tools.
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => navigate('/new-project')}
                    className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg hover:shadow-white/10 active:scale-98 cursor-pointer"
                  >
                    <Plus size={16} className="stroke-[2.5]" />
                    <span>New Project</span>
                  </button>

                  <button 
                    onClick={() => navigate('/media')}
                    className="flex items-center gap-2 bg-[#1b1d28]/90 hover:bg-[#252839] text-gray-200 px-4 py-2.5 rounded-xl font-medium text-xs transition-all border border-[#2b2f44] cursor-pointer"
                  >
                    <UploadCloud size={15} />
                    <span>Import Custom Media</span>
                  </button>

                  <button 
                    onClick={() => navigate('/editor')}
                    className="flex items-center gap-2 bg-[#1b1d28]/90 hover:bg-[#252839] text-gray-200 px-4 py-2.5 rounded-xl font-medium text-xs transition-all border border-[#2b2f44] cursor-pointer"
                  >
                    <FolderOpen size={15} />
                    <span>Open Editor</span>
                  </button>

                  <button 
                    onClick={() => navigate('/captions')}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-xs transition-all border border-blue-400/40 shadow-md shadow-blue-900/30 cursor-pointer"
                  >
                    <Sparkles size={15} />
                    <span>AI Auto-Edit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Projects Header */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">My Projects</h2>
                  <p className="text-[11px] text-gray-400">Continue editing your projects</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate('/new-project')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                  >
                    + New Project
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project)}
                    className="group bg-[#15161f] hover:bg-[#1a1b26] border border-[#232534] hover:border-blue-500/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-blue-950/20"
                  >
                    {/* Thumbnail box */}
                    <div className="relative aspect-video w-full overflow-hidden bg-[#0c0d11]">
                      {project.thumbnail ? (
                        <img 
                          src={project.thumbnail} 
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#171822] text-gray-500">
                          <Film size={28} className="mb-1 text-gray-600" />
                          <span className="text-[10px]">{project.aspect || '16:9'}</span>
                        </div>
                      )}

                      {/* Aspect Ratio Badge */}
                      <span className="absolute top-2 left-2 text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-gray-200 px-2 py-0.5 rounded border border-white/10">
                        {project.aspect || '16:9'}
                      </span>

                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-11 h-11 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <Play size={18} className="fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="text-xs font-semibold text-gray-100 group-hover:text-white truncate">
                          {project.name}
                        </h3>
                        <button 
                          onClick={(e) => handleDelete(project.id, e)}
                          className="text-gray-500 hover:text-red-400 p-0.5 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>{project.resolution ? project.resolution.split(' ')[0] : '1080p'}</span>
                        <span>·</span>
                        <span>{project.updatedAt || 'Recent'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="pt-2 border-t border-[#1f2231]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Workspace Tools
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={() => navigate('/editor')}
                  className="p-3.5 rounded-xl bg-[#15161f] border border-[#232534] hover:border-blue-500/50 text-left transition-all group cursor-pointer"
                >
                  <Film size={18} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Main Video Editor</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Timeline & playback</div>
                </button>

                <button 
                  onClick={() => navigate('/media')}
                  className="p-3.5 rounded-xl bg-[#15161f] border border-[#232534] hover:border-blue-500/50 text-left transition-all group cursor-pointer"
                >
                  <FolderOpen size={18} className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Custom Media Library</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Import and save your files</div>
                </button>

                <button 
                  onClick={() => navigate('/effects')}
                  className="p-3.5 rounded-xl bg-[#15161f] border border-[#232534] hover:border-blue-500/50 text-left transition-all group cursor-pointer"
                >
                  <Sparkles size={18} className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Effects & Transitions</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Cinematic filters & blurs</div>
                </button>

                <button 
                  onClick={() => navigate('/captions')}
                  className="p-3.5 rounded-xl bg-[#15161f] border border-[#232534] hover:border-blue-500/50 text-left transition-all group cursor-pointer"
                >
                  <SlidersHorizontal size={18} className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Captions & Audio Mixer</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">AI subtitles & master audio</div>
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
