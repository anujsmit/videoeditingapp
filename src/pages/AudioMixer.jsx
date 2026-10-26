import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { 
  Search, 
  Play, 
  Pause, 
  Star, 
  Plus, 
  Headphones,
  SlidersVertical
} from 'lucide-react';

export default function AudioMixer({ isEmbedded = false, onAddTrack }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Music'); // 'Music' | 'Sound Effects' | 'Voiceover' | 'Audio Mixer'
  const [searchQuery, setSearchQuery] = useState('');
  const [playingTrackId, setPlayingTrackId] = useState(null);

  // Mixer state
  const [masterVol, setMasterVol] = useState(0);    // dB (-30 to +6)
  const [musicVol, setMusicVol] = useState(-6);     // dB
  const [voiceVol, setVoiceVol] = useState(-3);     // dB
  const [sfxVol, setSfxVol] = useState(-9);         // dB
  const [fadeIn, setFadeIn] = useState('0.5s');
  const [fadeOut, setFadeOut] = useState('0.5s');
  const [noiseReduction, setNoiseReduction] = useState(true);

  const [tracks, setTracks] = useState([
    { id: 'better-days', title: 'Better Days', duration: '02:34', category: 'Acoustic', favorite: true },
    { id: 'summer-vibes', title: 'Summer Vibes', duration: '02:12', category: 'Upbeat', favorite: false },
    { id: 'cinematic-rise', title: 'Cinematic Rise', duration: '03:15', category: 'Epic', favorite: true },
    { id: 'happy-moments', title: 'Happy Moments', duration: '02:08', category: 'Pop', favorite: false },
    { id: 'chill-background', title: 'Chill Background', duration: '03:02', category: 'Lo-Fi', favorite: true },
    { id: 'epic-adventure', title: 'Epic Adventure', duration: '02:45', category: 'Orchestral', favorite: false },
  ]);

  const soundEffects = [
    { id: 'whoosh-1', title: 'Cinematic Whoosh', duration: '00:02', category: 'Transition' },
    { id: 'camera-click', title: 'Camera Shutter Click', duration: '00:01', category: 'Foley' },
    { id: 'pop-bubble', title: 'Subtle UI Pop', duration: '00:01', category: 'UI' },
    { id: 'glitch-hit', title: 'Glitch Impact Bass', duration: '00:03', category: 'Impact' },
    { id: 'bell-ding', title: 'Success Chime', duration: '00:02', category: 'UI' },
  ];

  const togglePlay = (id) => {
    setPlayingTrackId(playingTrackId === id ? null : id);
  };

  const toggleFav = (id) => {
    setTracks(ts => ts.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
  };

  const handleAdd = (track) => {
    if (onAddTrack) onAddTrack(track);
    if (!isEmbedded) {
      navigate('/editor');
    }
  };

  const filteredTracks = (activeTab === 'Sound Effects' ? soundEffects : tracks).filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const content = (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1016]">
      {/* Top Header Tabs */}
      <div className="h-11 border-b border-[#20222f] px-5 flex items-center justify-between bg-[#12131a]">
        <div className="flex items-center gap-1 bg-[#171822] p-1 rounded-lg border border-[#242635]">
          {['Music', 'Sound Effects', 'Voiceover', 'Audio Mixer'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181922] border border-[#272938] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Track List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-gray-300">
              {activeTab === 'Sound Effects' ? 'SFX Library' : 'Royalty-Free Music'}
            </span>
            <span className="text-[11px] text-gray-500">
              {filteredTracks.length} tracks
            </span>
          </div>

          <div className="space-y-1.5">
            {filteredTracks.map((track) => {
              const isPlaying = playingTrackId === track.id;
              return (
                <div
                  key={track.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                    isPlaying 
                      ? 'bg-blue-600/10 border-blue-500/50' 
                      : 'bg-[#151620] border-[#222433] hover:border-[#333749]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Play/Pause Button */}
                    <button
                      onClick={() => togglePlay(track.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isPlaying ? 'bg-blue-600 text-white shadow-md' : 'bg-[#1e202d] text-gray-300 hover:text-white hover:bg-[#282a3c]'
                      }`}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>

                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>{track.title}</span>
                        {isPlaying && (
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 bg-blue-400 h-full animate-bounce"></span>
                            <span className="w-0.5 bg-blue-400 h-2/3 animate-bounce delay-100"></span>
                            <span className="w-0.5 bg-blue-400 h-4/5 animate-bounce delay-200"></span>
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500">{track.category || 'Soundtrack'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-mono text-gray-400 text-[11px]">{track.duration}</span>

                    {/* Star favorite */}
                    <button
                      onClick={() => toggleFav(track.id)}
                      className="text-gray-500 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star size={13} className={track.favorite ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>

                    {/* Add to timeline */}
                    <button
                      onClick={() => handleAdd(track)}
                      className="p-1.5 rounded-lg bg-[#1f2231] hover:bg-blue-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Add to Timeline"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Audio Mixer Controls */}
        <div className="w-80 bg-[#13141c] border-l border-[#20222f] p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#212330] mb-4">
              <div className="flex items-center gap-2">
                <SlidersVertical size={15} className="text-blue-400" />
                <h3 className="text-xs font-bold text-white tracking-wide">Audio Mixer</h3>
              </div>
              <button 
                onClick={() => {
                  setMasterVol(0);
                  setMusicVol(-6);
                  setVoiceVol(-3);
                  setSfxVol(-9);
                }}
                className="text-[10px] text-blue-400 hover:text-blue-300"
              >
                Reset
              </button>
            </div>

            {/* 4 Vertical Channel Sliders */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { name: 'Master', val: masterVol, setVal: setMasterVol, min: -30, max: 6 },
                { name: 'Music', val: musicVol, setVal: setMusicVol, min: -30, max: 6 },
                { name: 'Voice', val: voiceVol, setVal: setVoiceVol, min: -30, max: 6 },
                { name: 'SFX', val: sfxVol, setVal: setSfxVol, min: -30, max: 6 },
              ].map((ch) => (
                <div key={ch.name} className="flex flex-col items-center bg-[#171822] border border-[#252838] rounded-xl p-2.5">
                  <span className="text-[11px] font-semibold text-gray-300 mb-2">{ch.name}</span>

                  {/* Vertical Fader Track */}
                  <div className="h-36 flex items-center justify-center my-1 relative">
                    <input
                      type="range"
                      min={ch.min}
                      max={ch.max}
                      step={0.5}
                      value={ch.val}
                      onChange={(e) => ch.setVal(parseFloat(e.target.value))}
                      className="accent-blue-500 h-28 -rotate-90 cursor-pointer"
                    />
                  </div>

                  <span className="text-[10px] font-mono text-gray-400 mt-2">
                    {ch.val > 0 ? `+${ch.val.toFixed(1)}` : ch.val.toFixed(1)} dB
                  </span>
                </div>
              ))}
            </div>

            {/* Fade In / Fade Out */}
            <div className="space-y-3 pt-3 border-t border-[#20222f]">
              <div className="text-[11px] font-semibold text-gray-300">Fade In / Out</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#171822] border border-[#252838] rounded-lg p-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Fade In:</span>
                  <input
                    type="text"
                    value={fadeIn}
                    onChange={(e) => setFadeIn(e.target.value)}
                    className="w-12 bg-transparent text-right text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="bg-[#171822] border border-[#252838] rounded-lg p-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Fade Out:</span>
                  <input
                    type="text"
                    value={fadeOut}
                    onChange={(e) => setFadeOut(e.target.value)}
                    className="w-12 bg-transparent text-right text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Noise Reduction Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Headphones size={13} className="text-gray-400" />
                  <span className="text-xs text-gray-300">Noise Reduction</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNoiseReduction(!noiseReduction)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    noiseReduction ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      noiseReduction ? 'left-4.5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#20222f] mt-4">
            <button
              onClick={() => navigate('/editor')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Apply to Timeline
            </button>
          </div>
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
        <Sidebar activeItem="Audio" />
        {content}
      </div>
    </div>
  );
}
