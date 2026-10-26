import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  Square, 
  HardDrive, 
  Video,
  X,
  Minus,
  ArrowLeft,
  UploadCloud,
  Check
} from 'lucide-react';
import { saveProject, saveMediaFile } from '../utils/storage';

export default function NewProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeStep, setActiveStep] = useState('Project Setup');
  const [projectName, setProjectName] = useState('My Video Project');
  const [savePath, setSavePath] = useState('C:\\Users\\anujkattel\\Videos\\Projects');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1920 × 1080 (Full HD)');
  const [fps, setFps] = useState('30 FPS');
  const [initialFiles, setInitialFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Steps without mock templates
  const steps = [
    { id: 'Project Setup', icon: Monitor },
    { id: 'Aspect Ratio', icon: Square },
    { id: 'Storage', icon: HardDrive },
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9', desc: 'YouTube', res: '1920 × 1080 (Full HD)' },
    { id: '9:16', label: '9:16', desc: 'TikTok / Shorts', res: '1080 × 1920 (Full HD)' },
    { id: '1:1', label: '1:1', desc: 'Instagram', res: '1080 × 1080 (Square)' },
    { id: '4:3', label: '4:3', desc: 'Classic', res: '1440 × 1080 (Standard)' },
    { id: '21:9', label: '21:9', desc: 'Cinema', res: '2560 × 1080 (Ultrawide)' },
  ];

  const handleAspectSelect = (ar) => {
    setAspectRatio(ar.id);
    setResolution(ar.res);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setInitialFiles(Array.from(e.target.files));
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      // Save any initial user files into storage
      for (const file of initialFiles) {
        await saveMediaFile(file);
      }

      // Save project
      const newProj = await saveProject({
        name: projectName || 'Untitled Project',
        aspect: aspectRatio,
        resolution,
        fps,
      });

      localStorage.setItem('active_project_id', newProj.id);
      localStorage.setItem('active_project_name', newProj.name);
      navigate('/editor');
    } catch {
      navigate('/editor');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0f1015] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Window Titlebar */}
      <div className="h-10 bg-[#121319] border-b border-[#222430] px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft size={13} />
            <span className="text-[11px]">Dashboard</span>
          </button>

          <div className="h-3 w-px bg-[#282a38]"></div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
              <Video size={12} />
            </div>
            <span className="font-bold text-white text-xs">anujkattel</span>
            <span className="text-gray-400 text-[11px]">Video Editor</span>
          </div>
        </div>

        {/* Window Controls */}
        <div className="flex items-center space-x-1 text-gray-400">
          <button className="p-1 hover:text-white hover:bg-white/10 rounded">
            <Minus size={11} />
          </button>
          <button className="p-1 hover:text-white hover:bg-white/10 rounded">
            <Square size={10} />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="p-1 hover:text-white hover:bg-red-600 rounded cursor-pointer"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Step Navigation Sidebar */}
        <div className="w-48 bg-[#13141b] border-r border-[#212330] p-3 space-y-1">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1c24]'
                }`}
              >
                <step.icon size={14} className={isActive ? 'text-blue-400' : 'text-gray-500'} />
                <span>{step.id}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-auto"></div>}
              </button>
            );
          })}
        </div>

        {/* Form Body and Preview */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left: Configuration Form */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2">
            <div className="space-y-5">
              {/* Header */}
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Create New Project</h1>
                <p className="text-xs text-gray-400">Set up your workspace and import your custom media files.</p>
              </div>

              {/* Project Name */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  Project Name
                </label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-[#171822] border border-[#282a3a] hover:border-[#383b50] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Save Location */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  Save Location
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#171822] border border-[#282a3a] rounded-lg px-3.5 py-2 text-xs text-gray-400 flex items-center overflow-hidden">
                    <span className="truncate">{savePath}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const newP = prompt('Enter save directory:', savePath);
                      if (newP) setSavePath(newP);
                    }}
                    className="bg-[#1e202d] hover:bg-[#272a3b] border border-[#2f3246] px-4 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Browse
                  </button>
                </div>
              </div>

              {/* Aspect Ratio Cards */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-2 block">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {aspectRatios.map((ar) => {
                    const isSelected = aspectRatio === ar.id;
                    return (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => handleAspectSelect(ar)}
                        className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-900/30' 
                            : 'bg-[#161722] border-[#262838] hover:border-[#3a3d54] text-gray-400'
                        }`}
                      >
                        <div className="h-8 flex items-center justify-center mb-1.5">
                          <div 
                            className={`border-2 rounded transition-colors ${
                              isSelected ? 'border-blue-400 bg-blue-500/20' : 'border-gray-500'
                            } ${
                              ar.id === '16:9' ? 'w-8 h-4.5' :
                              ar.id === '9:16' ? 'w-4 h-7' :
                              ar.id === '1:1' ? 'w-6 h-6' :
                              ar.id === '4:3' ? 'w-7 h-5' :
                              ar.id === '21:9' ? 'w-9 h-4' : 'w-6 h-6'
                            }`}
                          />
                        </div>
                        <div className="text-xs font-bold leading-none">{ar.label}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate w-full text-center">
                          {ar.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Media Upload Section */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  Add Your Media Files (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*,image/*,audio/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#2b2e40] hover:border-blue-500/70 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#141520]"
                >
                  <UploadCloud size={24} className="text-blue-400 mb-1.5" />
                  <span className="text-xs font-semibold text-gray-200">Click to upload your custom video, image, or audio files</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">MP4, MOV, PNG, JPG, MP3, WAV (Saved directly to your local workspace)</span>
                  {initialFiles.length > 0 && (
                    <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                      <Check size={13} /> {initialFiles.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution & FPS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                    Resolution
                  </label>
                  <select 
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-[#171822] border border-[#282a3a] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="1920 × 1080 (Full HD)">1920 × 1080 (Full HD)</option>
                    <option value="1080 × 1920 (Full HD)">1080 × 1920 (Full HD)</option>
                    <option value="3840 × 2160 (4K UHD)">3840 × 2160 (4K UHD)</option>
                    <option value="1280 × 720 (HD)">1280 × 720 (HD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                    Frame Rate
                  </label>
                  <select 
                    value={fps}
                    onChange={(e) => setFps(e.target.value)}
                    className="w-full bg-[#171822] border border-[#282a3a] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="30 FPS">30 FPS</option>
                    <option value="24 FPS">24 FPS (Cinematic)</option>
                    <option value="60 FPS">60 FPS (Smooth)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#222432] flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => navigate('/')}
                className="px-5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Creating Project...' : 'Create Project'}
              </button>
            </div>
          </div>

          {/* Right: Aspect Ratio Preview */}
          <div className="w-64 bg-[#14151e] border border-[#232533] rounded-2xl p-4 flex flex-col items-center justify-between">
            <div className="w-full text-center">
              <div className="text-xs font-bold text-gray-300">Preview</div>
              <div className="text-[10px] text-gray-500">{aspectRatio} Canvas Format</div>
            </div>

            {/* Visual Canvas Box */}
            <div className="flex-1 w-full flex items-center justify-center py-4">
              <div 
                className="relative rounded-lg overflow-hidden border-2 border-blue-500/70 shadow-2xl bg-black transition-all duration-300 flex items-center justify-center"
                style={{
                  width: aspectRatio === '9:16' ? '135px' : aspectRatio === '1:1' ? '160px' : aspectRatio === '4:3' ? '180px' : '200px',
                  height: aspectRatio === '9:16' ? '240px' : aspectRatio === '1:1' ? '160px' : aspectRatio === '4:3' ? '135px' : '112px',
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#171824] text-gray-400 p-2 text-center">
                  <Video size={24} className="text-blue-400 mb-1" />
                  <span className="text-[10px] text-gray-300 font-semibold">{projectName}</span>
                  <span className="text-[9px] text-gray-500">{aspectRatio}</span>
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-white border border-white/10">
                  {aspectRatio}
                </span>
              </div>
            </div>

            <div className="w-full bg-[#1b1d28] border border-[#282b3c] rounded-lg p-2.5 text-[11px] space-y-1 text-gray-400">
              <div className="flex justify-between">
                <span>Resolution:</span>
                <span className="text-gray-200 font-mono">{resolution.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Framerate:</span>
                <span className="text-gray-200 font-mono">{fps}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
