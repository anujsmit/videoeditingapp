import { useState, useEffect, useRef } from 'react';
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
  Film,
  UploadCloud,
  Trash2,
  Play
} from 'lucide-react';
import { getAllMedia, saveMediaFile, deleteMedia, toggleMediaFavorite } from '../utils/storage';

export default function MediaLibrary() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const items = await getAllMedia();
        setMediaItems(items || []);
      } catch {
        setMediaItems([]);
      }
    }
    fetchMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const items = await getAllMedia();
      setMediaItems(items || []);
    } catch {
      setMediaItems([]);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsImporting(true);
    try {
      for (const file of Array.from(files)) {
        await saveMediaFile(file);
      }
      await loadMedia();
    } catch (err) {
      console.error('Failed to import file:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Delete this media file from storage?')) {
      await deleteMedia(id);
      setMediaItems(prev => prev.filter(m => m.id !== id));
      if (selectedMedia?.id === id) setSelectedMedia(null);
    }
  };

  const handleFavorite = async (id, e) => {
    e.stopPropagation();
    const fav = await toggleMediaFavorite(id);
    setMediaItems(prev => prev.map(m => m.id === id ? { ...m, favorite: fav } : m));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleOpenInEditor = (media) => {
    if (media) {
      localStorage.setItem('editor_active_clip', JSON.stringify({
        id: media.id,
        name: media.name,
        type: media.type,
        blobUrl: media.blobUrl,
      }));
    }
    navigate('/editor');
  };

  const categories = [
    { id: 'All', label: 'All Media', count: mediaItems.length, icon: FolderOpen },
    { id: 'Videos', label: 'Videos', count: mediaItems.filter(m => m.type === 'Videos').length, icon: Video },
    { id: 'Images', label: 'Images', count: mediaItems.filter(m => m.type === 'Images').length, icon: ImageIcon },
    { id: 'Audio', label: 'Audio', count: mediaItems.filter(m => m.type === 'Audio').length, icon: Music },
    { id: 'Favorites', label: 'Favorites', count: mediaItems.filter(m => m.favorite).length, icon: Star },
  ];

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Favorites') return item.favorite;
    return item.type === activeCategory;
  });

  return (
    <div 
      className="flex flex-col h-screen w-screen bg-[#0d0e12] text-white select-none overflow-hidden font-sans"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files)}
        accept="video/*,image/*,audio/*"
        className="hidden"
      />

      <AppHeader 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search your saved files..."
        rightActions={
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus size={14} /> 
            <span>{isImporting ? 'Importing...' : 'Add Custom Files'}</span>
          </button>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Media Library" />

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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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
              <span>Local Storage</span>
              <span className="text-gray-200">{mediaItems.length} files saved</span>
            </div>
            <div className="w-full bg-[#242636] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(mediaItems.length * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Media Grid / List */}
        <div className="flex-1 flex flex-col bg-[#0f1016] overflow-hidden relative">
          {/* Drag & Drop Overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-blue-600/20 backdrop-blur-sm border-2 border-dashed border-blue-400 flex flex-col items-center justify-center pointer-events-none">
              <UploadCloud size={48} className="text-blue-400 mb-2 animate-bounce" />
              <span className="text-base font-bold text-white">Drop your media files here to save them!</span>
            </div>
          )}

          {/* Sub Toolbar */}
          <div className="h-11 border-b border-[#1f212c] px-6 flex items-center justify-between bg-[#12131a]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">{activeCategory} Media</span>
              <span className="text-[11px] text-gray-400">({filteredMedia.length} files)</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#171822] border border-[#252837] rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <Grid size={13} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded cursor-pointer ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="List View"
                >
                  <List size={13} />
                </button>
              </div>

              <button 
                onClick={() => handleOpenInEditor(selectedMedia || filteredMedia[0])}
                className="flex items-center gap-1.5 bg-[#1f2231] hover:bg-[#2b2f42] text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-[#2d3043] transition-colors cursor-pointer"
              >
                <Film size={13} />
                <span>Open in Timeline</span>
              </button>
            </div>
          </div>

          {/* Media Items Container */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredMedia.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-72 border-2 border-dashed border-[#242738] hover:border-blue-500/70 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-colors bg-[#13141d]"
              >
                <UploadCloud size={40} className="text-blue-400 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">No custom files in {activeCategory}</h3>
                <p className="text-xs text-gray-400 max-w-sm mb-4">
                  Drag and drop your videos, images, or audio here, or click to browse files from your computer.
                </p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold">
                  Browse Files
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    onDoubleClick={() => handleOpenInEditor(item)}
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
                          {item.type === 'Audio' ? (
                            <Music size={28} className="text-indigo-400 mb-1" />
                          ) : (
                            <Video size={28} className="text-blue-400 mb-1" />
                          )}
                          <span className="text-[10px] text-gray-400">{item.duration}</span>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleFavorite(item.id, e)}
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

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => handleDelete(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 rounded transition-opacity"
                          title="Delete file"
                        >
                          <Trash2 size={13} />
                        </button>

                        <button 
                          onClick={() => handleOpenInEditor(item)}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-blue-600 hover:bg-blue-500 rounded text-white transition-opacity"
                          title="Open in Timeline"
                        >
                          <Play size={12} className="ml-0.5" />
                        </button>
                      </div>
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
                    onDoubleClick={() => handleOpenInEditor(item)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1c26] transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded overflow-hidden bg-black shrink-0 flex items-center justify-center">
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
                        onClick={(e) => handleFavorite(item.id, e)}
                        className={`p-1 ${item.favorite ? 'text-amber-400' : 'text-gray-500 hover:text-white'}`}
                      >
                        <Star size={13} className={item.favorite ? 'fill-amber-400' : ''} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1 hover:text-red-400 text-gray-500 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 size={13} />
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
