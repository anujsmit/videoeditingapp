import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { 
  Sparkles, 
  Search, 
  Layers, 
  Flame, 
  Camera, 
  Sun, 
  Zap, 
  Compass, 
  Film, 
  Split, 
  Heart, 
  Star, 
  Trees, 
  Wand2, 
  ArrowRightLeft,
  Plus,
  Check
} from 'lucide-react';

export default function Effects({ isEmbedded = false, onApplyEffect }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Effects'); // 'Effects' | 'Transitions'
  const [selectedCategory, setSelectedCategory] = useState('Basic');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedEffect, setAppliedEffect] = useState(null);

  const categories = [
    { id: 'Basic', label: 'Basic', icon: Layers },
    { id: 'Blur', label: 'Blur', icon: Sparkles },
    { id: 'Camera', label: 'Camera', icon: Camera },
    { id: 'Light', label: 'Light', icon: Sun },
    { id: 'Glitch', label: 'Glitch', icon: Zap },
    { id: 'Distortion', label: 'Distortion', icon: Compass },
    { id: 'Retro', label: 'Retro', icon: Film },
    { id: 'Split', label: 'Split', icon: Split },
    { id: 'Love', label: 'Love', icon: Heart },
    { id: 'Star', label: 'Star', icon: Star },
    { id: 'Nature', label: 'Nature', icon: Trees },
    { id: 'AI Effects', label: 'AI Effects', icon: Wand2 },
  ];

  const trendingEffects = [
    { id: 'blur', name: 'Blur', category: 'Blur', preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300' },
    { id: 'cinematic', name: 'Cinematic', category: 'Basic', preview: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300' },
    { id: 'glow', name: 'Glow', category: 'Light', preview: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=300' },
    { id: 'shake', name: 'Shake', category: 'Camera', preview: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300' },
    { id: 'vignette', name: 'Vignette', category: 'Basic', preview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=300' },
    { id: 'film-grain', name: 'Film Grain', category: 'Retro', preview: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=300' },
    { id: 'chromatic', name: 'Chromatic', category: 'Glitch', preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300' },
    { id: 'zoom', name: 'Zoom', category: 'Camera', preview: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300' },
    { id: 'rgb-split', name: 'RGB Split', category: 'Glitch', preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=300' },
    { id: 'flash', name: 'Flash', category: 'Light', preview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=300' },
  ];

  const transitions = [
    { id: 'fade', name: 'Fade', preview: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300' },
    { id: 'slide', name: 'Slide', preview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=300' },
    { id: 'zoom-tr', name: 'Zoom', preview: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300' },
    { id: 'push', name: 'Push', preview: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&q=80&w=300' },
    { id: 'dissolve', name: 'Dissolve', preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300' },
  ];

  const handleApply = (effect) => {
    setAppliedEffect(effect.id);
    if (onApplyEffect) onApplyEffect(effect);
    setTimeout(() => {
      if (!isEmbedded) {
        navigate('/editor');
      }
    }, 400);
  };

  const filteredEffects = trendingEffects.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const content = (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1016]">
      {/* Top Header Tabs */}
      <div className="h-11 border-b border-[#20222f] px-5 flex items-center justify-between bg-[#12131a]">
        <div className="flex items-center gap-1 bg-[#171822] p-1 rounded-lg border border-[#242635]">
          <button
            onClick={() => setActiveTab('Effects')}
            className={`px-4 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'Effects' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Effects
          </button>
          <button
            onClick={() => setActiveTab('Transitions')}
            className={`px-4 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'Transitions' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Transitions
          </button>
        </div>

        <div className="relative w-64">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={activeTab === 'Effects' ? 'Search effects...' : 'Search transitions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181922] border border-[#272938] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Categories Menu */}
        <div className="w-44 bg-[#12131a] border-r border-[#20222f] p-2 space-y-0.5 overflow-y-auto custom-scrollbar">
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isCatActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#181a24]'
                }`}
              >
                <cat.icon size={14} className={isCatActive ? 'text-blue-400' : 'text-gray-500'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Main Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {activeTab === 'Effects' ? (
            <>
              {/* Trending Effects Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame size={14} className="text-amber-500" />
                    <h3 className="text-xs font-bold text-white tracking-wide">Trending Effects</h3>
                  </div>
                  <span className="text-[10px] text-gray-500">10 Presets</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {filteredEffects.map((effect) => {
                    const isApplied = appliedEffect === effect.id;
                    return (
                      <div
                        key={effect.id}
                        onClick={() => handleApply(effect)}
                        className={`group relative bg-[#151620] border rounded-xl overflow-hidden cursor-pointer transition-all ${
                          isApplied ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-[#242636] hover:border-[#383c52]'
                        }`}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={effect.preview} 
                            alt={effect.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                          {/* Center Add Button on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                              {isApplied ? <Check size={14} /> : <Plus size={14} />}
                            </div>
                          </div>

                          <span className="absolute bottom-1.5 left-2 text-[11px] font-semibold text-white">
                            {effect.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transitions Section previewed below */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft size={14} className="text-blue-400" />
                    <h3 className="text-xs font-bold text-white tracking-wide">Quick Transitions</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {transitions.map((tr) => (
                    <div
                      key={tr.id}
                      onClick={() => handleApply(tr)}
                      className="group relative bg-[#151620] border border-[#242636] hover:border-blue-500/60 rounded-xl overflow-hidden cursor-pointer transition-all"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={tr.preview} 
                          alt={tr.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <span className="absolute bottom-1.5 left-2 text-[11px] font-semibold text-white">
                          {tr.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white tracking-wide">All Transitions</h3>
                <span className="text-[10px] text-gray-500">Smooth Scene Blend</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {transitions.map((tr) => (
                  <div
                    key={tr.id}
                    onClick={() => handleApply(tr)}
                    className="group relative bg-[#151620] border border-[#242636] hover:border-blue-500/60 rounded-xl overflow-hidden cursor-pointer transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img src={tr.preview} alt={tr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <span className="absolute bottom-1.5 left-2 text-[11px] font-semibold text-white">{tr.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0e12] text-white select-none overflow-hidden font-sans">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Effects" />
        {content}
      </div>
    </div>
  );
}
