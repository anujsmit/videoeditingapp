import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  Video, 
  Music, 
  Type, 
  Layers, 
  Wand2, 
  SlidersHorizontal, 
  Sparkles, 
  Play, 
  Pause, 
  Scissors, 
  Undo, 
  Redo, 
  Download, 
  Search, 
  ChevronDown, 
  Maximize, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  ArrowRightLeft, 
  Minus,
  Square,
  X,
  ArrowLeft,
  Film,
  UploadCloud,
  Check
} from 'lucide-react';
import { getAllMedia, saveMediaFile } from '../utils/storage';

export default function MainEditor() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Active Tool Ribbon Selection (Templates removed!)
  const [activeRibbon, setActiveRibbon] = useState('Media'); 
  const [mediaFilter, setMediaFilter] = useState('All'); 
  const [mediaSearch, setMediaSearch] = useState('');
  const [userMedia, setUserMedia] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  // Active Project & Active Clip
  const [projectName] = useState(() => localStorage.getItem('active_project_name') || 'My Awesome Project');
  const [activeClip, setActiveClip] = useState(() => {
    const stored = localStorage.getItem('editor_active_clip');
    if (stored) {
      try { return JSON.parse(stored); } catch {}
    }
    return {
      id: 'default-clip',
      name: 'mountain.mp4',
      type: 'Videos',
      blobUrl: null,
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400',
    };
  });

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(12800); 
  const [totalDurationMs, setTotalDurationMs] = useState(92533); 
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [resolutionPreset, setResolutionPreset] = useState('1080P');
  const [fitPreset, setFitPreset] = useState('Fit');

  // Inspector State
  const [inspectorTab, setInspectorTab] = useState('Video'); 
  const [inspectorSubtab, setInspectorSubtab] = useState('Basic'); 
  const [scale, setScale] = useState(100);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [blendMode, setBlendMode] = useState('Normal');
  const [opacity, setOpacity] = useState(100);
  const [isStabilized, setIsStabilized] = useState(true);

  // Timeline State
  const [zoomLevel, setZoomLevel] = useState(50);
  const [track1Locked, setTrack1Locked] = useState(false);
  const [track1Muted, setTrack1Muted] = useState(false);
  const [track2Locked, setTrack2Locked] = useState(false);
  const [track2Muted, setTrack2Muted] = useState(false);
  const [track3Locked, setTrack3Locked] = useState(false);
  const [track3Muted, setTrack3Muted] = useState(false);

  // Active effect / caption
  const [activeEffect, setActiveEffect] = useState('Cinematic');
  const [activeCaption, setActiveCaption] = useState('The view is absolutely amazing');

  useEffect(() => {
    async function fetchMedia() {
      try {
        const items = await getAllMedia();
        setUserMedia(items || []);
        if (items && items.length > 0 && !activeClip.blobUrl) {
          const firstVid = items.find(i => i.type === 'Videos') || items[0];
          setActiveClip(firstVid);
        }
      } catch {
        setUserMedia([]);
      }
    }
    fetchMedia();
  }, [activeClip.blobUrl]);

  const loadUserMedia = async () => {
    try {
      const items = await getAllMedia();
      setUserMedia(items || []);
    } catch {
      setUserMedia([]);
    }
  };

  const handleCustomImport = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsImporting(true);
    try {
      for (const file of Array.from(files)) {
        const saved = await saveMediaFile(file);
        setActiveClip(saved);
      }
      await loadUserMedia();
    } catch (err) {
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  };

  // Video time update handling
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTimeMs(videoRef.current.currentTime * 1000);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setTotalDurationMs(videoRef.current.duration * 1000);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(true);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Timeline scrubber jump
  const handleSeek = (ms) => {
    setCurrentTimeMs(ms);
    if (videoRef.current) {
      videoRef.current.currentTime = ms / 1000;
    }
  };

  // Format millisecond time to 00:00:12:24 (HH:MM:SS:FF)
  const formatTimecode = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const frames = Math.floor((ms % 1000) / (1000 / 30));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  // Left Ribbon Items without mock templates!
  const ribbonItems = [
    { id: 'Media', label: 'Media', icon: FolderOpen },
    { id: 'Audio', label: 'Audio', icon: Music },
    { id: 'Text', label: 'Text', icon: Type },
    { id: 'Stickers', label: 'Stickers', icon: Layers },
    { id: 'Effects', label: 'Effects', icon: Wand2 },
    { id: 'Transitions', label: 'Transitions', icon: ArrowRightLeft },
    { id: 'Filters', label: 'Filters', icon: SlidersHorizontal },
    { id: 'AI Tools', label: 'AI Tools', icon: Sparkles },
  ];

  const filteredMedia = userMedia.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(mediaSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (mediaFilter === 'All') return true;
    return item.type === mediaFilter;
  });

  const playheadPercent = totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0e12] text-white select-none overflow-hidden font-sans">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleCustomImport}
        accept="video/*,image/*,audio/*"
        className="hidden"
      />

      {/* Top Application Bar */}
      <header className="h-10 min-h-[40px] bg-[#121319] border-b border-[#20222e] px-3.5 flex items-center justify-between z-40">
        {/* Left: Project title & App Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft size={13} />
            <span className="text-[11px]">Dashboard</span>
          </button>

          <div className="h-3 w-px bg-[#262837]"></div>

          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-5.5 h-5.5 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Film size={12} />
            </div>
            <span className="font-bold text-white text-xs tracking-wide">anujkattel</span>
            <span className="text-[11px] text-gray-400">Video Editor</span>
          </div>

          <div className="h-4 w-px bg-[#262837] mx-1"></div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-200">{projectName}</span>
            <span className="text-[10px] bg-[#1d1f2b] text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-medium">
              Saved
            </span>
          </div>
        </div>

        {/* Center: Search & Project Status */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleSeek(0)}
            className="p-1 hover:text-white text-gray-400 rounded hover:bg-white/5 cursor-pointer" 
            title="Jump to Start"
          >
            <Undo size={13} />
          </button>
          <button 
            onClick={() => handleSeek(totalDurationMs)}
            className="p-1 hover:text-white text-gray-400 rounded hover:bg-white/5 cursor-pointer" 
            title="Jump to End"
          >
            <Redo size={13} />
          </button>
        </div>

        {/* Right: Resolution, Export, Profile, Window Controls */}
        <div className="flex items-center gap-3">
          {/* Resolution Dropdown */}
          <div 
            onClick={() => setResolutionPreset(r => r === '1080P' ? '4K' : r === '4K' ? '720P' : '1080P')}
            className="flex items-center bg-[#181923] border border-[#272938] hover:border-[#3a3d54] rounded-lg px-2 py-1 text-xs text-gray-300 cursor-pointer select-none"
          >
            <span className="text-[11px] font-mono mr-1.5">{resolutionPreset}</span>
            <ChevronDown size={11} className="text-gray-500" />
          </div>

          {/* Export Button */}
          <button
            onClick={() => navigate('/export')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-1 rounded-lg font-bold transition-all shadow-md shadow-blue-900/30 cursor-pointer"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          {/* User Avatar */}
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
            alt="Profile" 
            onClick={() => navigate('/settings')}
            className="w-6 h-6 rounded-full object-cover border border-[#2e3144] cursor-pointer hover:ring-2 hover:ring-blue-500"
          />

          {/* Window control buttons */}
          <div className="flex items-center space-x-0.5 text-gray-400 border-l border-[#242636] pl-2">
            <button className="p-1 hover:text-white hover:bg-white/10 rounded"><Minus size={11} /></button>
            <button className="p-1 hover:text-white hover:bg-white/10 rounded"><Square size={10} /></button>
            <button onClick={() => navigate('/')} className="p-1 hover:text-white hover:bg-red-600 rounded cursor-pointer"><X size={11} /></button>
          </div>
        </div>
      </header>

      {/* Main Workspace (Ribbon + Drawer + Canvas Player + Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Far-Left Vertical Ribbon (No templates mockup!) */}
        <div className="w-14 bg-[#111218] border-r border-[#1f212d] flex flex-col items-center py-2.5 space-y-1 shrink-0 select-none z-30">
          {ribbonItems.map((item) => {
            const isActive = activeRibbon === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveRibbon(item.id)}
                className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#191b24]'
                }`}
                title={item.label}
              >
                <item.icon size={16} />
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Drawer Panel: Custom Media Bin */}
        <div className="w-72 bg-[#13141c] border-r border-[#20222f] flex flex-col shrink-0 select-none overflow-hidden">
          {activeRibbon === 'Media' && (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Drawer Top */}
              <div className="p-3 border-b border-[#20222f] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    {['All', 'Video', 'Image', 'Audio'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setMediaFilter(f)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          mediaFilter === f ? 'bg-[#222533] text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => navigate('/media')}
                    className="p-1 hover:text-white text-gray-400 cursor-pointer"
                    title="Open Full Media Library"
                  >
                    <FolderOpen size={13} />
                  </button>
                </div>

                {/* Real Custom Import Action */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Plus size={13} />
                    <span>{isImporting ? 'Adding...' : 'Import Files'}</span>
                  </button>
                  <button 
                    onClick={() => navigate('/media')}
                    className="flex-1 py-1.5 bg-[#1e202d] hover:bg-[#282a3c] border border-[#2b2e42] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 text-gray-200 transition-colors cursor-pointer"
                  >
                    <FolderOpen size={13} />
                    <span>Library</span>
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search your files..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full bg-[#181923] border border-[#262838] rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Media Thumbnails Grid */}
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {filteredMedia.length === 0 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-44 border-2 border-dashed border-[#242738] hover:border-blue-500/70 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors bg-[#171822]"
                  >
                    <UploadCloud size={24} className="text-blue-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-300">Click to import files</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">MP4, MOV, JPG, PNG, MP3</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredMedia.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setActiveClip(m)}
                        className={`group relative bg-[#171823] border rounded-lg overflow-hidden cursor-pointer transition-all ${
                          activeClip?.id === m.id ? 'border-blue-500 shadow-sm' : 'border-[#242636] hover:border-blue-500/80'
                        }`}
                      >
                        <div className="aspect-video bg-black flex items-center justify-center overflow-hidden relative">
                          {m.thumbnail ? (
                            <img src={m.thumbnail} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <Video size={22} className="text-blue-400" />
                          )}
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 px-1 rounded text-white">
                            {m.duration}
                          </span>
                        </div>
                        <div className="p-1.5 flex items-center justify-between text-[11px]">
                          <span className="truncate text-gray-300 group-hover:text-white">{m.name}</span>
                          <button 
                            onClick={() => setActiveClip(m)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 bg-blue-600 rounded text-white transition-opacity"
                            title="Set as Active Canvas"
                          >
                            <Check size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeRibbon === 'Audio' && (
            <div className="flex flex-1 flex-col p-3 space-y-3 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Audio Tracks</span>
                <button 
                  onClick={() => navigate('/audio')}
                  className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Full Mixer
                </button>
              </div>

              {['Better Days (02:34)', 'Summer Vibes (02:12)', 'Cinematic Rise (03:15)', 'Chill Beat (03:02)'].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#181923] border border-[#262838] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Music size={13} className="text-blue-400 shrink-0" />
                    <span className="truncate text-gray-200">{t}</span>
                  </div>
                  <button className="p-1 hover:text-blue-400 cursor-pointer"><Plus size={12}/></button>
                </div>
              ))}
            </div>
          )}

          {activeRibbon === 'Effects' && (
            <div className="flex flex-1 flex-col p-3 space-y-2 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Trending Effects</span>
                <button 
                  onClick={() => navigate('/effects')}
                  className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Blur', 'Cinematic', 'Glow', 'Shake', 'Vignette', 'Film Grain'].map((ef, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveEffect(ef)}
                    className={`p-2 rounded-lg border text-xs text-center cursor-pointer transition-all ${
                      activeEffect === ef ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-[#181923] border-[#262838] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {ef}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeRibbon === 'Text' && (
            <div className="flex flex-1 flex-col p-3 space-y-3 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Captions & Text</span>
                <button 
                  onClick={() => navigate('/captions')}
                  className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  AI Captions
                </button>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Active Subtitle Text</label>
                <input
                  type="text"
                  value={activeCaption}
                  onChange={(e) => setActiveCaption(e.target.value)}
                  className="w-full bg-[#181923] border border-[#272938] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {!['Media', 'Audio', 'Effects', 'Text'].includes(activeRibbon) && (
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center text-gray-500 text-xs">
              <Sparkles size={24} className="text-gray-600 mb-2" />
              <span>{activeRibbon} Ready</span>
            </div>
          )}
        </div>

        {/* Center: Real Video / Image Canvas & Player */}
        <div className="flex-1 flex flex-col bg-[#0b0c10] overflow-hidden relative">
          {/* Player Header bar */}
          <div className="h-8 border-b border-[#1c1e29] px-4 flex items-center justify-between bg-[#111218] text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-300">Player</span>
              <span className="text-[11px] text-gray-500 truncate max-w-xs font-mono">
                {activeClip.name || 'mountain.mp4'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px]">{resolutionPreset}</span>
              <span 
                onClick={() => setFitPreset(f => f === 'Fit' ? '100%' : f === '100%' ? '50%' : 'Fit')}
                className="text-[11px] bg-[#1a1c26] hover:bg-[#252838] px-1.5 py-0.5 rounded border border-[#272938] cursor-pointer"
              >
                {fitPreset}
              </span>
            </div>
          </div>

          {/* Main Video Viewport (Plays user's real uploaded video if provided!) */}
          <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
            <div 
              className="relative w-full max-w-3xl aspect-video bg-[#0f1015] border border-[#20222f] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center group"
              style={{
                transform: `scale(${scale / 100}) translate(${posX}px, ${posY}px) rotate(${rotation}deg)`,
                opacity: opacity / 100,
                filter: activeEffect === 'Blur' ? 'blur(3px)' : activeEffect === 'Vignette' ? 'contrast(1.2)' : 'none',
              }}
            >
              {activeClip.blobUrl && activeClip.type === 'Videos' ? (
                <video
                  ref={videoRef}
                  src={activeClip.blobUrl}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  className="w-full h-full object-cover"
                  playsInline
                />
              ) : activeClip.blobUrl && activeClip.type === 'Images' ? (
                <img
                  src={activeClip.blobUrl}
                  alt={activeClip.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeClip.thumbnail || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400"}
                  alt="Main video viewport"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Subtitle Caption Overlay */}
              {activeCaption && (
                <div className="absolute bottom-6 inset-x-0 flex justify-center px-4 pointer-events-none">
                  <div className="px-4 py-1.5 rounded-lg text-center text-white font-bold text-sm bg-black/50 backdrop-blur-sm shadow-xl drop-shadow-md border border-white/10">
                    {activeCaption}
                  </div>
                </div>
              )}

              {/* Center Play Button on hover */}
              <div 
                onClick={togglePlay}
                className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl">
                  {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="fill-black ml-0.5" />}
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="h-11 bg-[#12131a] border-t border-[#1e202d] px-4 flex items-center justify-between text-xs text-gray-300">
            {/* Left: Scissor split, undo, redo */}
            <div className="flex items-center gap-3">
              <button className="hover:text-white p-1 cursor-pointer" title="Split clip"><Scissors size={14} /></button>
              <button onClick={() => handleSeek(0)} className="hover:text-white p-1 cursor-pointer" title="Undo"><Undo size={14} /></button>
              <button onClick={() => handleSeek(totalDurationMs)} className="hover:text-white p-1 cursor-pointer" title="Redo"><Redo size={14} /></button>
            </div>

            {/* Center: Timecode & Transport controls */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-blue-400">
                {formatTimecode(currentTimeMs)}
              </span>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => handleSeek(0)}
                  className="p-1 hover:text-white text-gray-400 rounded hover:bg-white/5 cursor-pointer"
                >
                  <SkipBack size={13} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                </button>
                <button 
                  onClick={() => handleSeek(totalDurationMs)}
                  className="p-1 hover:text-white text-gray-400 rounded hover:bg-white/5 cursor-pointer"
                >
                  <SkipForward size={13} />
                </button>
              </div>

              <span className="font-mono text-xs text-gray-500">
                {formatTimecode(totalDurationMs)}
              </span>
            </div>

            {/* Right: Volume & Fullscreen */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white cursor-pointer">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-16 accent-blue-500 h-1 cursor-pointer"
                />
              </div>
              <button className="hover:text-white p-1 cursor-pointer"><Maximize size={14} /></button>
            </div>
          </div>
        </div>

        {/* Right: Property Inspector Panel */}
        <div className="w-72 bg-[#12131a] border-l border-[#20222f] flex flex-col shrink-0 select-none overflow-hidden">
          {/* Top Inspector Tabs */}
          <div className="flex border-b border-[#20222f] text-xs font-semibold">
            {['Video', 'Audio', 'Speed', 'Animation'].map((tab) => (
              <button
                key={tab}
                onClick={() => setInspectorTab(tab)}
                className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
                  inspectorTab === tab 
                    ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Subtabs under Video */}
          {inspectorTab === 'Video' && (
            <div className="flex border-b border-[#1d1f2b] px-3 py-1 gap-2 text-[11px] text-gray-400">
              {['Basic', 'Cutout', 'Mask', 'Enhance'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setInspectorSubtab(sub)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    inspectorSubtab === sub ? 'bg-[#1e202d] text-white font-medium' : 'hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Inspector Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
            {inspectorTab === 'Video' && (
              <>
                {/* Transform */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                    <span>Transform</span>
                    <button 
                      onClick={() => { setScale(100); setPosX(0); setPosY(0); setRotation(0); }}
                      className="text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                      <RotateCcw size={11} />
                    </button>
                  </div>

                  {/* Scale */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px]">Scale</span>
                    <div className="flex items-center gap-2 w-36">
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={scale}
                        onChange={(e) => setScale(parseInt(e.target.value))}
                        className="flex-1 accent-blue-500 h-1 cursor-pointer"
                      />
                      <span className="w-8 text-right font-mono text-gray-200">{scale}%</span>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px]">Position</span>
                    <div className="flex gap-2 w-36">
                      <div className="flex items-center bg-[#171822] border border-[#272938] rounded px-1.5 py-0.5 flex-1">
                        <span className="text-gray-500 text-[10px] mr-1">X</span>
                        <input
                          type="number"
                          value={posX}
                          onChange={(e) => setPosX(parseInt(e.target.value) || 0)}
                          className="bg-transparent text-white w-full text-right text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center bg-[#171822] border border-[#272938] rounded px-1.5 py-0.5 flex-1">
                        <span className="text-gray-500 text-[10px] mr-1">Y</span>
                        <input
                          type="number"
                          value={posY}
                          onChange={(e) => setPosY(parseInt(e.target.value) || 0)}
                          className="bg-transparent text-white w-full text-right text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rotate */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px]">Rotate</span>
                    <div className="flex items-center gap-2 w-36">
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="flex-1 accent-blue-500 h-1 cursor-pointer"
                      />
                      <span className="w-8 text-right font-mono text-gray-200">{rotation}°</span>
                    </div>
                  </div>
                </div>

                {/* Blend */}
                <div className="pt-3 border-t border-[#1f212f] space-y-3">
                  <span className="text-xs font-bold text-gray-200 block">Blend</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={blendMode}
                      onChange={(e) => setBlendMode(e.target.value)}
                      className="flex-1 bg-[#171822] border border-[#272938] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Screen">Screen</option>
                      <option value="Overlay">Overlay</option>
                      <option value="Multiply">Multiply</option>
                    </select>

                    <div className="flex items-center bg-[#171822] border border-[#272938] rounded-lg px-2 py-1 w-24">
                      <span className="text-[10px] text-gray-500 mr-1">Opacity</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent text-right text-xs text-white focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-gray-500 ml-0.5">%</span>
                    </div>
                  </div>
                </div>

                {/* Stabilize Switch */}
                <div className="pt-3 border-t border-[#1f212f] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-200 block">Stabilize</span>
                    <span className="text-[10px] text-gray-500">Optical warp stabilizer</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsStabilized(!isStabilized)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      isStabilized ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                        isStabilized ? 'left-4.5' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {inspectorTab === 'Audio' && (
              <div className="space-y-4">
                <span className="font-bold text-white block">Audio Gain & Presets</span>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Volume</span>
                  <input type="range" className="w-32 accent-blue-500 h-1" defaultValue={100} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Equalizer</span>
                  <select className="bg-[#171822] border border-[#272938] rounded px-2 py-1 text-xs">
                    <option>Voice Enhance</option>
                    <option>Bass Boost</option>
                    <option>Flat</option>
                  </select>
                </div>
              </div>
            )}

            {inspectorTab === 'Speed' && (
              <div className="space-y-4">
                <span className="font-bold text-white block">Speed Ramping</span>
                <div className="flex gap-2">
                  {['0.5x', '1.0x', '1.5x', '2.0x'].map((s, i) => (
                    <button key={i} className={`flex-1 py-1 rounded text-xs border cursor-pointer ${s === '1.0x' ? 'bg-blue-600 text-white' : 'bg-[#181923] border-[#272938]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Multi-Track Timeline */}
      <div className="h-64 bg-[#0e0f14] border-t border-[#1f212d] flex flex-col shrink-0 select-none overflow-hidden">
        {/* Timeline Tools Bar */}
        <div className="h-9 bg-[#13141a] border-b border-[#1f212c] px-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <button onClick={() => handleSeek(0)} className="hover:text-white flex items-center gap-1 cursor-pointer"><Undo size={13} /></button>
            <button onClick={() => handleSeek(totalDurationMs)} className="hover:text-white flex items-center gap-1 cursor-pointer"><Redo size={13} /></button>
            <div className="h-3.5 w-px bg-[#262837]"></div>
            <button className="hover:text-white flex items-center gap-1 cursor-pointer"><Scissors size={13} /> Split</button>
            <button className="hover:text-white flex items-center gap-1 cursor-pointer"><Trash2 size={13} /> Delete</button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-500">Zoom</span>
            <input
              type="range"
              min="10"
              max="100"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="w-24 accent-blue-500 h-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Timeline Canvas & Tracks */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Track Headers (Left sidebar) */}
          <div className="w-36 bg-[#121319] border-r border-[#1f212c] flex flex-col shrink-0 divide-y divide-[#1c1e28] text-xs">
            <div className="h-6 bg-[#101117] px-2 flex items-center text-[10px] text-gray-500 font-mono">
              Tracks
            </div>

            {/* Track 1: Subtitle/Text */}
            <div className="h-12 px-2.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-gray-300 flex items-center gap-1">
                <Type size={12} className="text-purple-400" /> Text 1
              </span>
              <div className="flex items-center gap-1 text-gray-500">
                <button onClick={() => setTrack1Locked(!track1Locked)} className="cursor-pointer">
                  {track1Locked ? <Lock size={11} className="text-amber-400"/> : <Unlock size={11}/>}
                </button>
                <button onClick={() => setTrack1Muted(!track1Muted)} className="cursor-pointer">
                  {track1Muted ? <EyeOff size={11} className="text-red-400"/> : <Eye size={11}/>}
                </button>
              </div>
            </div>

            {/* Track 2: Video */}
            <div className="h-16 px-2.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-gray-300 flex items-center gap-1">
                <Video size={12} className="text-blue-400" /> Video 1
              </span>
              <div className="flex items-center gap-1 text-gray-500">
                <button onClick={() => setTrack2Locked(!track2Locked)} className="cursor-pointer">
                  {track2Locked ? <Lock size={11} className="text-amber-400"/> : <Unlock size={11}/>}
                </button>
                <button onClick={() => setTrack2Muted(!track2Muted)} className="cursor-pointer">
                  {track2Muted ? <EyeOff size={11} className="text-red-400"/> : <Eye size={11}/>}
                </button>
              </div>
            </div>

            {/* Track 3: Audio */}
            <div className="h-12 px-2.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-gray-300 flex items-center gap-1">
                <Music size={12} className="text-cyan-400" /> Audio 1
              </span>
              <div className="flex items-center gap-1 text-gray-500">
                <button onClick={() => setTrack3Locked(!track3Locked)} className="cursor-pointer">
                  {track3Locked ? <Lock size={11} className="text-amber-400"/> : <Unlock size={11}/>}
                </button>
                <button onClick={() => setTrack3Muted(!track3Muted)} className="cursor-pointer">
                  {track3Muted ? <VolumeX size={11} className="text-red-400"/> : <Volume2 size={11}/>}
                </button>
              </div>
            </div>
          </div>

          {/* Track Lanes with Clips & Playhead */}
          <div className="flex-1 overflow-x-auto relative bg-[#090a0d] custom-scrollbar">
            {/* Timeline Ruler */}
            <div className="h-6 border-b border-[#1f212c] bg-[#101117] flex items-center text-[9px] font-mono text-gray-500 sticky top-0 z-10 select-none">
              {['00:00', '00:10', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30'].map((time, i) => (
                <div 
                  key={i} 
                  onClick={() => handleSeek(i * 10000)}
                  className="flex-1 border-l border-[#1f212d] pl-1 h-full flex items-center cursor-pointer hover:bg-white/5"
                >
                  <span>{time}</span>
                </div>
              ))}
            </div>

            {/* Lane 1: Subtitles Track */}
            <div className="h-12 border-b border-[#1b1c26] relative flex items-center px-1">
              <div 
                className="h-8 rounded-md bg-purple-900/60 border border-purple-500/80 px-2 flex items-center text-[11px] text-purple-200 font-medium shadow-sm hover:border-purple-300 cursor-pointer"
                style={{ width: '45%', marginLeft: '5%' }}
              >
                <Type size={11} className="mr-1.5 text-purple-400" />
                <span className="truncate">{activeCaption || 'Subtitles Track'}</span>
              </div>
            </div>

            {/* Lane 2: Video Track (Reflects active user clip!) */}
            <div className="h-16 border-b border-[#1b1c26] relative flex items-center px-1">
              <div 
                className="h-13 rounded-lg overflow-hidden border border-blue-500/80 bg-blue-950/40 flex shadow-md group cursor-pointer hover:border-blue-400"
                style={{ width: '70%', marginLeft: '0%' }}
              >
                <div className="w-6 bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white uppercase tracking-wider shrink-0" style={{ writingMode: 'vertical-rl' }}>
                  {activeClip.name || 'clip.mp4'}
                </div>
                <div className="flex-1 flex overflow-hidden">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <img
                      key={idx}
                      src={activeClip.thumbnail || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200"}
                      alt="Thumbnail"
                      className="h-full flex-1 object-cover border-r border-blue-900/40"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Lane 3: Audio Waveform Track */}
            <div className="h-12 border-b border-[#1b1c26] relative flex items-center px-1">
              <div 
                className="h-8 rounded-md bg-cyan-950/70 border border-cyan-500/70 px-2 flex items-center overflow-hidden shadow-sm hover:border-cyan-300 cursor-pointer"
                style={{ width: '65%', marginLeft: '10%' }}
              >
                <Music size={11} className="mr-2 text-cyan-400 shrink-0" />
                <span className="text-[10px] text-cyan-200 font-mono mr-3 shrink-0">Audio Track</span>
                <div className="flex-1 flex items-center gap-[2px] h-full py-1 overflow-hidden">
                  {Array.from({ length: 90 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[2px] bg-cyan-400/80 rounded-full"
                      style={{ height: `${Math.sin(i * 0.3) * 40 + 50}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Playhead Scrub Line */}
            <div 
              className="absolute top-0 bottom-0 pointer-events-none z-20"
              style={{ left: `${playheadPercent}%` }}
            >
              <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm -ml-[7px] shadow-md border border-white"></div>
              <div className="w-[1.5px] h-full bg-blue-500 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
