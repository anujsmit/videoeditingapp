import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { 
  FolderOpen, 
  Video, 
  Image as ImageIcon, 
  Music, 
  Star, 
  Grid, 
  List, 
  Plus, 
  Film
} from 'lucide-react';

export default function MediaLibrary() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const categories = [
    { id: 'All', label: 'All Media', count: 124, icon: FolderOpen },
    { id: 'Videos', label: 'Videos', count: 52, icon: Video },
    { id: 'Images', label: 'Images', count: 34, icon: ImageIcon },
    { id: 'Audio', label: 'Audio', count: 28, icon: Music },
    { id: 'Favorites', label: 'Favorites', count: 12, icon: Star },
  ];

  const [mediaItems, setMediaItems] = useState([
    {
      id: 'travel-mp4',
      name: 'Travel.mp4',
      type: 'Videos',
      duration: '00:12',
      size: '24.5 MB',
      date: 'Oct 24, 2026',
      favorite: true,
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'mountain-jpg',
      name: 'mountain.jpg',
      type: 'Images',
      duration: 'Image',
      size: '4.2 MB',
      date: 'Oct 24, 2026',
      favorite: true,
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'city-mp4',
      name: 'city.mp4',
      type: 'Videos',
      duration: '00:08',
      size: '18.1 MB',
      date: 'Oct 23, 2026',
      favorite: false,
      thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'beach-png',
      name: 'beach.png',
      type: 'Images',
      duration: 'Image',
      size: '3.8 MB',
      date: 'Oct 22, 2026',
      favorite: true,
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'music-mp3',
      name: 'music.mp3',
      type: 'Audio',
      duration: '03:15',
      size: '7.4 MB',
      date: 'Oct 21, 2026',
      favorite: true,
      thumbnail: null,
      isAudio: true,
    },
    {
      id: 'forest-mp4',
      name: 'forest.mp4',
      type: 'Videos',
      duration: '02:15',
      size: '86.0 MB',
      date: 'Oct 20, 2026',
      favorite: false,
      thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'camera-jpg',
      name: 'camera.jpg',
      type: 'Images',
      duration: 'Image',
      size: '5.1 MB',
      date: 'Oct 19, 2026',
      favorite: false,
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'logo-png',
      name: 'logo.png',
      type: 'Images',
      duration: 'Image',
      size: '1.2 MB',
      date: 'Oct 18, 2026',
      favorite: false,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    },
  ]);

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Favorites') return item.favorite;
    return item.type === activeCategory;
  });

  const handleImport = () => {
    const name = prompt('Enter media file name (e.g. drone_shot.mp4):', 'drone_shot.mp4');
    if (!name) return;
    const isVid = name.endsWith('.mp4');
    const isAud = name.endsWith('.mp3');
    const newItem = {
      id: `imported-${Date.now()}`,
      name,
      type: isVid ? 'Videos' : isAud ? 'Audio' : 'Images',
      duration: isVid ? '00:45' : isAud ? '02:30' : 'Image',
      size: '32.0 MB',
      date: 'Just now',
      favorite: false,
      thumbnail: isAud ? null : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400',
      isAudio: isAud,
    };
    setMediaItems([newItem, ...mediaItems]);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setMediaItems(items => items.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0e12] text-white select-none overflow-hidden font-sans">
      <AppHeader 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search media files..."
        rightActions={
          <button 
            onClick={handleImport}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Plus size={14} /> Import
          </button>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Media" />

        {/* Media Categories Column */}
        <div className="w-52 bg-[#12131a] border-r border-[#20222f] p-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2 px-2">
              Categories
            </div>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#191b24]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <cat.icon size={15} className={isActive ? 'text-white' : 'text-gray-400'} />
                    <span>{cat.label}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-[#1c1e29] text-gray-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Storage Status */}
          <div className="p-3 bg-[#171822] rounded-xl border border-[#262838] text-[11px]">
            <div className="flex justify-between text-gray-400 mb-1">
              <span>Cloud Storage</span>
              <span className="text-gray-200">14.2 GB / 50 GB</span>
            </div>
            <div className="w-full bg-[#242636] h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[28%] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Media Grid / List */}
        <div className="flex-1 flex flex-col bg-[#0f1016] overflow-hidden">
          {/* Sub Toolbar */}
          <div className="h-11 border-b border-[#1f212c] px-6 flex items-center justify-between bg-[#12131a]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">{activeCategory} Media</span>
              <span className="text-[11px] text-gray-400">({filteredMedia.length} items)</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#171822] border border-[#252837] rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <Grid size={13} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="List View"
                >
                  <List size={13} />
                </button>
              </div>

              <button 
                onClick={() => navigate('/editor')}
                className="flex items-center gap-1.5 bg-[#1f2231] hover:bg-[#2b2f42] text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-[#2d3043] transition-colors cursor-pointer"
              >
                <Film size={13} />
                <span>Open in Timeline</span>
              </button>
            </div>
          </div>

          {/* Media Items Container */}
          <div className="flex-1 overflow-y-auto p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    onDoubleClick={() => navigate('/editor')}
                    className={`group bg-[#15161f] border rounded-xl overflow-hidden cursor-pointer transition-all ${
                      selectedMedia?.id === item.id 
                        ? 'border-blue-500 shadow-md shadow-blue-900/30' 
                        : 'border-[#242635] hover:border-[#3a3d52]'
                    }`}
                  >
                    {/* Media Preview Box */}
                    <div className="relative aspect-video bg-[#0c0d12] flex items-center justify-center overflow-hidden">
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/40 to-purple-950/30">
                          <Music size={28} className="text-indigo-400 mb-1" />
                          <div className="flex items-center gap-0.5">
                            {[16, 28, 12, 34, 20, 10, 24].map((h, i) => (
                              <div key={i} className="w-1 bg-indigo-500/60 rounded-full" style={{ height: `${h}px` }}></div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`absolute top-2 right-2 p-1 rounded-full backdrop-blur-md transition-all ${
                          item.favorite ? 'bg-amber-500/90 text-white' : 'bg-black/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white'
                        }`}
                      >
                        <Star size={12} className={item.favorite ? 'fill-white' : ''} />
                      </button>

                      {/* Duration Tag */}
                      <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/75 backdrop-blur-sm px-1.5 py-0.5 rounded text-white border border-white/10">
                        {item.duration}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-2.5 flex items-center justify-between text-xs">
                      <div className="truncate mr-2">
                        <div className="font-semibold text-gray-200 group-hover:text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-gray-500">{item.size} · {item.date}</div>
                      </div>
                      <button 
                        onClick={() => navigate('/editor')}
                        className="opacity-0 group-hover:opacity-100 p-1 bg-blue-600 hover:bg-blue-500 rounded text-white transition-opacity cursor-pointer"
                        title="Add to Timeline"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#15161f] border border-[#242635] rounded-xl overflow-hidden divide-y divide-[#20222f]">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    onDoubleClick={() => navigate('/editor')}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1c26] transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded overflow-hidden bg-black shrink-0">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-950/40 text-indigo-400">
                            <Music size={12} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-[10px] text-gray-500">{item.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-gray-400">
                      <span>{item.duration}</span>
                      <span>{item.size}</span>
                      <span>{item.date}</span>
                      <button 
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`p-1 ${item.favorite ? 'text-amber-400' : 'text-gray-500 hover:text-white'}`}
                      >
                        <Star size={13} className={item.favorite ? 'fill-amber-400' : ''} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
