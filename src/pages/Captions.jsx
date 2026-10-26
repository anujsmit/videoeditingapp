import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Bold, 
  Italic, 
  Check, 
  Volume2
} from 'lucide-react';

export default function Captions({ isEmbedded = false, onSubtitleChange }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Auto Captions'); // 'Auto Captions' | 'Import Subtitles' | 'Manual Edit'
  const [language, setLanguage] = useState('English (Auto Detect)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubIndex, setSelectedSubIndex] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);

  // Subtitle styling state
  const [activeStyleTab, setActiveStyleTab] = useState('Style');
  const [fontFamily, setFontFamily] = useState('Poppins');
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [fontColor, setFontColor] = useState('#FFFFFF');

  const [subtitles, setSubtitles] = useState([
    { start: '00:00:00', end: '00:00:03', text: 'Welcome to my travel vlog' },
    { start: '00:00:03', end: '00:00:06', text: 'Today we are exploring' },
    { start: '00:00:06', end: '00:00:09', text: 'this beautiful mountain' },
    { start: '00:00:09', end: '00:00:12', text: 'The view is absolutely amazing' },
    { start: '00:00:12', end: '00:00:15', text: "Let's go!" },
    { start: '00:00:15', end: '00:00:18', text: 'Stay tuned for more adventures' },
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedSubIndex(3);
    }, 1000);
  };

  const handleTextChange = (index, newText) => {
    const nextSubs = [...subtitles];
    nextSubs[index].text = newText;
    setSubtitles(nextSubs);
    if (onSubtitleChange) onSubtitleChange(nextSubs);
  };

  const activeCaption = subtitles[selectedSubIndex]?.text || '';

  const content = (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1016]">
      {/* Top Header Tabs */}
      <div className="h-11 border-b border-[#20222f] px-5 flex items-center justify-between bg-[#12131a]">
        <div className="flex items-center gap-1 bg-[#171822] p-1 rounded-lg border border-[#242635]">
          {['Auto Captions', 'Import Subtitles', 'Manual Edit'].map(tab => (
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

        <button 
          onClick={() => navigate('/editor')}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          <Check size={13} />
          <span>Apply to Video</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Subtitles Generator & List */}
        <div className="w-[440px] bg-[#12131a] border-r border-[#20222f] flex flex-col justify-between overflow-hidden">
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {/* Language and Generate Button */}
            <div className="bg-[#171822] border border-[#262837] rounded-xl p-3.5 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                  Language
                </label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#1e202d] border border-[#2c2f42] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="English (Auto Detect)">English (Auto Detect)</option>
                  <option value="Spanish (Auto Detect)">Spanish (Auto Detect)</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-900/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={14} />
                <span>{isGenerating ? 'Analyzing Audio with AI...' : 'Generate Captions'}</span>
              </button>

              <p className="text-[10px] text-gray-500 text-center">
                AI will automatically detect speech and generate synchronized captions.
              </p>
            </div>

            {/* Subtitles Timeline List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-300">Subtitle Blocks</span>
                <span className="text-[10px] text-gray-500">{subtitles.length} lines</span>
              </div>

              <div className="space-y-1.5">
                {subtitles.map((sub, idx) => {
                  const isSelected = selectedSubIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSubIndex(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600/15 border-blue-500 shadow-sm' 
                          : 'bg-[#161722] border-[#242636] hover:border-[#35384e]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-1">
                        <span>{sub.start} - {sub.end}</span>
                        {isSelected && <span className="text-blue-400 font-sans font-semibold">Active</span>}
                      </div>
                      <input
                        type="text"
                        value={sub.text}
                        onChange={(e) => handleTextChange(idx, e.target.value)}
                        className="w-full bg-transparent text-xs text-white focus:outline-none focus:bg-[#1f2130] rounded px-1 py-0.5"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Subtitle Style Toolbar (bottom of left column) */}
          <div className="p-3 bg-[#151620] border-t border-[#20222f] space-y-2">
            {/* Style tabs */}
            <div className="flex border-b border-[#242636] pb-1 gap-4 text-xs font-semibold text-gray-400">
              {['Style', 'Font', 'Animation', 'Position'].map(st => (
                <button
                  key={st}
                  onClick={() => setActiveStyleTab(st)}
                  className={`pb-1 transition-colors ${
                    activeStyleTab === st ? 'text-blue-400 border-b-2 border-blue-400' : 'hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 pt-1">
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="bg-[#1d1f2c] border border-[#2b2e40] text-xs text-white rounded px-2 py-1 focus:outline-none"
              >
                <option value="Poppins">Poppins</option>
                <option value="Inter">Inter</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Impact">Impact</option>
              </select>

              <div className="flex items-center bg-[#1d1f2c] border border-[#2b2e40] rounded px-2 py-1 gap-1">
                <span className="text-[10px] text-gray-400">Size</span>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                  className="w-8 bg-transparent text-xs text-white text-center focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-[#1d1f2c] border border-[#2b2e40] rounded p-0.5">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`p-1 rounded ${isBold ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Bold size={12} />
                </button>
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  className={`p-1 rounded ${isItalic ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Italic size={12} />
                </button>
              </div>

              {/* Color swatches */}
              <div className="flex items-center gap-1.5 ml-auto">
                {['#FFFFFF', '#FACC15', '#38BDF8', '#F43F5E'].map(c => (
                  <button
                    key={c}
                    onClick={() => setFontColor(c)}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      fontColor === c ? 'scale-125 border-white ring-1 ring-blue-500' : 'border-gray-600 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Video Preview with Live Subtitle Overlay */}
        <div className="flex-1 flex flex-col bg-[#0b0c10] items-center justify-center p-6 relative">
          {/* Main Video Viewport */}
          <div className="relative w-full max-w-3xl aspect-video bg-[#121319] border border-[#222432] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center group">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200"
              alt="Hiker on mountain"
              className="w-full h-full object-cover"
            />

            {/* Subtitle Caption Overlay */}
            {activeCaption && (
              <div className="absolute bottom-8 inset-x-0 flex justify-center px-4 pointer-events-none">
                <div
                  className="px-4 py-1.5 rounded-lg text-center drop-shadow-xl"
                  style={{
                    fontFamily,
                    fontSize: `${fontSize}px`,
                    fontWeight: isBold ? '700' : '400',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    color: fontColor,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(3px)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  }}
                >
                  {activeCaption}
                </div>
              </div>
            )}
          </div>

          {/* Video Control Bar */}
          <div className="w-full max-w-3xl h-12 bg-[#14151e] border border-[#232534] rounded-xl mt-4 px-4 flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <span className="font-mono text-xs text-blue-400">00:00:09 / 00:01:32</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:text-white rounded hover:bg-white/5"><RotateCcw size={14}/></button>
              <button className="p-1.5 hover:text-white rounded hover:bg-white/5"><RotateCw size={14}/></button>
              <button className="p-1.5 hover:text-white rounded hover:bg-white/5"><Volume2 size={14}/></button>
              <button className="p-1.5 hover:text-white rounded hover:bg-white/5"><Maximize size={14}/></button>
            </div>
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
        <Sidebar activeItem="AI Tools" />
        {content}
      </div>
    </div>
  );
}
