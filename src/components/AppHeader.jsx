import { Minus, Square, X, Search, Video, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AppHeader({ 
  showSearch = true, 
  searchPlaceholder = 'Search projects, templates...',
  searchValue,
  onSearchChange,
  middleContent,
  rightActions,
  title,
  backTo,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else if (location.pathname !== '/') {
      navigate(-1);
    }
  };

  return (
    <header className="h-11 min-h-[44px] bg-[#121318] border-b border-[#22242f] px-3.5 flex items-center justify-between select-none z-50">
      {/* Left: Brand & Optional Back Button */}
      <div className="flex items-center gap-2">
        {location.pathname !== '/' && (
          <button
            onClick={handleBack}
            className="p-1.5 mr-1 text-gray-400 hover:text-white hover:bg-[#1f212d] rounded-lg transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft size={15} />
          </button>
        )}

        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform">
            <Video size={15} className="fill-white/20" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-white tracking-wide flex items-center gap-1.5">
              anujkattel
              <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                Pro
              </span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">Video Editor</div>
          </div>
        </div>
      </div>

      {/* Middle Content */}
      <div className="flex-1 max-w-xl mx-4 flex items-center justify-center">
        {middleContent ? (
          middleContent
        ) : showSearch ? (
          <div className="relative w-full max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-[#181920] border border-[#272938] hover:border-[#383b4e] focus:border-blue-500 text-xs text-white placeholder-gray-500 pl-8 pr-3 py-1.5 rounded-lg transition-colors focus:outline-none"
            />
          </div>
        ) : title ? (
          <h2 className="text-xs font-semibold text-gray-200 tracking-wide">{title}</h2>
        ) : null}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {rightActions}

        {/* User Avatar */}
        <div 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all" 
          title="Account Settings"
        >
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
            alt="User Avatar"
            className="w-6 h-6 rounded-full object-cover border border-[#34374a]" 
          />
        </div>

        {/* Window Controls */}
        <div className="flex items-center ml-1 border-l border-[#272937] pl-1.5 space-x-0.5 text-gray-400">
          <button 
            className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Minimize"
          >
            <Minus size={12} />
          </button>
          <button 
            className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Maximize"
          >
            <Square size={11} />
          </button>
          <button 
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
              }
            }}
            className="p-1.5 hover:text-white hover:bg-red-600/80 rounded transition-colors cursor-pointer"
            title={location.pathname === '/' ? 'Close' : 'Home'}
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </header>
  );
}
