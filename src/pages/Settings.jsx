import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { 
  Sliders, 
  Cpu, 
  Keyboard, 
  HardDrive, 
  Info, 
  Check, 
  RotateCcw, 
  Moon, 
  Sun, 
  Laptop,
  RefreshCw
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General'); // 'General' | 'Performance' | 'Shortcuts' | 'Storage' | 'About'
  const [language, setLanguage] = useState('English');
  const [autoSave, setAutoSave] = useState(true);
  const [hardwareAccel, setHardwareAccel] = useState('Auto');
  const [projectLocation, setProjectLocation] = useState('C:\\Users\\anujkattel\\Videos\\Projects');
  const [theme, setTheme] = useState('Dark'); // 'Dark' | 'Light' | 'System'
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const tabs = [
    { id: 'General', icon: Sliders },
    { id: 'Performance', icon: Cpu },
    { id: 'Shortcuts', icon: Keyboard },
    { id: 'Storage', icon: HardDrive },
    { id: 'About', icon: Info },
  ];

  const handleReset = () => {
    setLanguage('English');
    setAutoSave(true);
    setHardwareAccel('Auto');
    setProjectLocation('C:\\Users\\anujkattel\\Videos\\Projects');
    setTheme('Dark');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0e12] text-white select-none overflow-hidden font-sans">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Settings" />

        <div className="flex-1 flex flex-col bg-[#0f1016] overflow-hidden">
          {/* Top Tabs */}
          <div className="h-11 border-b border-[#20222f] px-6 flex items-center justify-between bg-[#12131a]">
            <div className="flex items-center gap-1 bg-[#171822] p-1 rounded-lg border border-[#242635]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <tab.icon size={13} />
                    <span>{tab.id}</span>
                  </button>
                );
              })}
            </div>

            {isSavedNotice && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Settings updated
              </span>
            )}
          </div>

          {/* Settings Body */}
          <div className="flex-1 overflow-y-auto p-8 max-w-3xl custom-scrollbar">
            {activeTab === 'General' && (
              <div className="space-y-6">
                {/* Language */}
                <div className="flex items-center justify-between py-3 border-b border-[#1f2231]">
                  <div>
                    <h3 className="text-xs font-bold text-white">Language</h3>
                    <p className="text-[11px] text-gray-400">Application interface display language</p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[#171822] border border-[#272938] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 w-44"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                    <option value="Japanese">日本語</option>
                  </select>
                </div>

                {/* Auto Save Projects */}
                <div className="flex items-center justify-between py-3 border-b border-[#1f2231]">
                  <div>
                    <h3 className="text-xs font-bold text-white">Auto Save Projects</h3>
                    <p className="text-[11px] text-gray-400">Save workspace project changes automatically every 2 minutes</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      autoSave ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                        autoSave ? 'left-5.5' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Check for Updates */}
                <div className="flex items-center justify-between py-3 border-b border-[#1f2231]">
                  <div>
                    <h3 className="text-xs font-bold text-white">Check for Updates</h3>
                    <p className="text-[11px] text-gray-400">Current build version: v2.4.0 (Latest)</p>
                  </div>
                  <button
                    onClick={() => alert('anujkattel Video Editor is up to date!')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1d28] hover:bg-[#252839] border border-[#2d3043] rounded-lg text-xs font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Check Now</span>
                  </button>
                </div>

                {/* Hardware Acceleration */}
                <div className="flex items-center justify-between py-3 border-b border-[#1f2231]">
                  <div>
                    <h3 className="text-xs font-bold text-white">Hardware Acceleration</h3>
                    <p className="text-[11px] text-gray-400">Accelerate playback and encoding using GPU hardware</p>
                  </div>
                  <select
                    value={hardwareAccel}
                    onChange={(e) => setHardwareAccel(e.target.value)}
                    className="bg-[#171822] border border-[#272938] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 w-44"
                  >
                    <option value="Auto">Auto (NVIDIA / AMD)</option>
                    <option value="NVIDIA NVENC">NVIDIA NVENC</option>
                    <option value="Intel QuickSync">Intel QuickSync</option>
                    <option value="Disabled">Disabled (Software only)</option>
                  </select>
                </div>

                {/* Default Project Location */}
                <div className="flex items-center justify-between py-3 border-b border-[#1f2231]">
                  <div className="pr-4">
                    <h3 className="text-xs font-bold text-white">Default Project Location</h3>
                    <p className="text-[11px] text-gray-400 truncate max-w-sm">{projectLocation}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newP = prompt('Change project directory path:', projectLocation);
                      if (newP) setProjectLocation(newP);
                    }}
                    className="px-3.5 py-1.5 bg-[#1b1d28] hover:bg-[#252839] border border-[#2d3043] rounded-lg text-xs font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* Theme Selector */}
                <div className="flex items-center justify-between py-3 border-b border-[#1f2231]">
                  <div>
                    <h3 className="text-xs font-bold text-white">Theme</h3>
                    <p className="text-[11px] text-gray-400">Choose your interface color palette</p>
                  </div>
                  <div className="flex items-center bg-[#171822] border border-[#272938] p-1 rounded-lg gap-1">
                    {[
                      { id: 'Dark', icon: Moon },
                      { id: 'Light', icon: Sun },
                      { id: 'System', icon: Laptop },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                          theme === t.id 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <t.icon size={12} />
                        <span>{t.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1b26] hover:bg-[#25283a] border border-[#2a2d3e] text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Settings</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Performance' && (
              <div className="space-y-4 text-xs text-gray-300">
                <div className="p-4 bg-[#151620] border border-[#242636] rounded-xl space-y-2">
                  <h4 className="font-bold text-white">GPU Acceleration</h4>
                  <p className="text-gray-400">Dedicated GPU: NVIDIA GeForce RTX (CUDA 12.2 Active)</p>
                  <p className="text-gray-400">Memory Cache: 8 GB allocated for real-time video scrubbing</p>
                </div>
              </div>
            )}

            {activeTab === 'Shortcuts' && (
              <div className="space-y-2 text-xs">
                {[
                  { key: 'Space', action: 'Play / Pause Video' },
                  { key: 'Ctrl + B', action: 'Split Clip at Playhead' },
                  { key: 'Delete', action: 'Delete Selected Clip' },
                  { key: 'Ctrl + Z', action: 'Undo Last Action' },
                  { key: 'Ctrl + Y', action: 'Redo Action' },
                  { key: 'Ctrl + E', action: 'Open Export Dialog' },
                ].map((sc, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 bg-[#151620] border border-[#242636] rounded-lg">
                    <span className="text-gray-300">{sc.action}</span>
                    <kbd className="px-2 py-0.5 bg-[#1e202d] border border-[#2d3042] rounded text-blue-400 font-mono text-[11px]">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'About' && (
              <div className="p-6 bg-[#151620] border border-[#242636] rounded-2xl text-center space-y-3">
                <h2 className="text-lg font-bold text-white">anujkattel Video Editor</h2>
                <p className="text-xs text-gray-400">Version 2.4.0 (Production Release)</p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  A modern desktop video editing studio with pro timeline, AI captions, audio mixer, and GPU-accelerated export.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
