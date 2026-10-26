import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  X, 
  CheckCircle, 
  Video,
  Minus,
  Square,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function Export() {
  const navigate = useNavigate();
  const [format, setFormat] = useState('MP4 (H.264)');
  const [resolution, setResolution] = useState('1080 × 1920 (Full HD)');
  const [fps, setFps] = useState('30 FPS');
  const [quality, setQuality] = useState('High');
  const [bitrate, setBitrate] = useState('Recommended');
  const [exportAudio, setExportAudio] = useState(true);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setIsFinished(false);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setIsFinished(true);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  return (
    <div className="h-screen w-screen bg-[#0f1015] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Window Titlebar */}
      <div className="h-10 bg-[#121319] border-b border-[#222430] px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/editor')}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Back to Editor"
          >
            <ArrowLeft size={13} />
            <span className="text-[11px]">Editor</span>
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

        <div className="flex items-center space-x-1 text-gray-400">
          <button className="p-1 hover:text-white hover:bg-white/10 rounded">
            <Minus size={11} />
          </button>
          <button className="p-1 hover:text-white hover:bg-white/10 rounded">
            <Square size={10} />
          </button>
          <button 
            onClick={() => navigate('/editor')}
            className="p-1 hover:text-white hover:bg-red-600 rounded cursor-pointer"
            title="Close"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* Main Export Content */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Form: Settings */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Export Video</h1>
              <p className="text-xs text-gray-400">Configure your render format, quality, and bitrate.</p>
            </div>

            {/* Format */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#161722] border border-[#272938] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="MP4 (H.264)">MP4 (H.264)</option>
                <option value="MOV (Apple ProRes)">MOV (Apple ProRes)</option>
                <option value="WebM (VP9)">WebM (VP9)</option>
                <option value="GIF (Animated)">GIF (Animated)</option>
              </select>
            </div>

            {/* Resolution */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-[#161722] border border-[#272938] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="1080 × 1920 (Full HD)">1080 × 1920 (Full HD)</option>
                <option value="1920 × 1080 (Full HD)">1920 × 1080 (Full HD)</option>
                <option value="3840 × 2160 (4K UHD)">3840 × 2160 (4K UHD)</option>
                <option value="1280 × 720 (HD)">1280 × 720 (HD)</option>
              </select>
            </div>

            {/* Frame Rate */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Frame Rate</label>
              <select
                value={fps}
                onChange={(e) => setFps(e.target.value)}
                className="w-full bg-[#161722] border border-[#272938] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="30 FPS">30 FPS</option>
                <option value="24 FPS">24 FPS</option>
                <option value="60 FPS">60 FPS</option>
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full bg-[#161722] border border-[#272938] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Maximum (Lossless)">Maximum (Lossless)</option>
                <option value="Standard">Standard</option>
                <option value="Fast Encode">Fast Encode</option>
              </select>
            </div>

            {/* Bitrate */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Bitrate</label>
              <select
                value={bitrate}
                onChange={(e) => setBitrate(e.target.value)}
                className="w-full bg-[#161722] border border-[#272938] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Recommended">Recommended (Auto VBR)</option>
                <option value="High (20 Mbps)">High (20 Mbps)</option>
                <option value="Medium (10 Mbps)">Medium (10 Mbps)</option>
                <option value="Custom (CBR)">Custom (CBR)</option>
              </select>
            </div>

            {/* Export Audio Toggle */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-xs font-semibold text-gray-300">Export Audio</label>
              <input
                type="checkbox"
                checked={exportAudio}
                onChange={(e) => setExportAudio(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Progress / Status feedback */}
          {isExporting && (
            <div className="mt-4 p-3 bg-[#171822] border border-blue-500/40 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-blue-400 font-semibold">Rendering video frames...</span>
                <span className="font-mono text-white">{exportProgress}%</span>
              </div>
              <div className="w-full bg-[#242636] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {isFinished && (
            <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Video exported successfully to your Projects folder!</span>
              </div>
              <button
                onClick={() => navigate('/editor')}
                className="flex items-center gap-1 text-white bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded font-medium cursor-pointer"
              >
                <span>Back to Editor</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Right Preview & Action Column */}
        <div className="w-72 bg-[#14151e] border border-[#232533] rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-gray-300 mb-3 text-center">Video Preview</div>

            {/* 9:16 Vertical Video Frame */}
            <div className="w-full h-56 bg-black rounded-xl overflow-hidden border border-[#2b2d3d] relative flex items-center justify-center shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400"
                alt="Export preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold bg-black/80 px-1.5 py-0.5 rounded text-white border border-white/10">
                8:10
              </span>
            </div>

            {/* Estimates box */}
            <div className="mt-4 bg-[#181923] border border-[#262838] rounded-xl p-3 text-xs space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Estimated File Size:</span>
                <span className="font-semibold text-white font-mono">~ 324 MB</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Time:</span>
                <span className="font-semibold text-white font-mono">2 min 18 sec</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Encoder:</span>
                <span className="text-gray-200">NVENC H.264</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="pt-4 border-t border-[#232533] space-y-2">
            <button
              onClick={handleStartExport}
              disabled={isExporting}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-white text-black hover:bg-gray-200 transition-all shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download size={15} />
              <span>{isExporting ? 'Exporting...' : isFinished ? 'Export Again' : 'Export'}</span>
            </button>

            <button
              onClick={() => navigate('/editor')}
              className="w-full py-2 rounded-xl font-medium text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
