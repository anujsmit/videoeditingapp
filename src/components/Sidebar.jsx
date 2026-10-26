import { 
  Home, 
  FolderPlus, 
  FolderOpen, 
  Sparkles, 
  Settings as SettingsIcon, 
  Folder, 
  Trash2,
  Video
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ activeItem = 'Home' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const primaryNav = [
    { id: 'Home', icon: Home, label: 'Home', path: '/' },
    { id: 'New Project', icon: FolderPlus, label: 'New Project', path: '/new-project' },
    { id: 'Open Project', icon: FolderOpen, label: 'Open Project', path: '/editor' },
    { id: 'AI Tools', icon: Sparkles, label: 'AI Tools', path: '/captions' },
  ];

  const recentNav = [
    { id: 'My Projects', icon: Folder, label: 'My Projects', path: '/' },
    { id: 'Media Library', icon: FolderOpen, label: 'Media Library', path: '/media' },
    { id: 'Trash', icon: Trash2, label: 'Trash', path: '/media' },
  ];

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (item) => {
    if (activeItem && activeItem === item.id) return true;
    if (item.path && location.pathname === item.path) return true;
    return false;
  };

  return (
    <aside className="w-56 bg-[#13141a] border-r border-[#20222d] flex flex-col justify-between shrink-0 select-none py-3 text-xs">
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 px-4 pb-4 mb-3 border-b border-[#1f212c] cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Video size={14} />
          </div>
          <div>
            <div className="font-bold text-white text-[13px] leading-tight">anujkattel</div>
            <div className="text-[10px] text-gray-400">Video Editor</div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-0.5 px-2">
          {primaryNav.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all text-left cursor-pointer ${
                  active 
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-700/20' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1c24]'
                }`}
              >
                <item.icon size={16} className={active ? 'text-white' : 'text-gray-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recent Projects Submenu */}
        <div className="mt-6 px-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2 px-2">
            Storage & Files
          </div>
          <div className="space-y-0.5">
            {recentNav.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#1a1c24] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={14} className="text-gray-400" />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Bottom Button */}
      <div className="px-2 pt-2 border-t border-[#1f212c]">
        <button 
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#1a1c24] transition-colors text-left cursor-pointer ${
            location.pathname === '/settings' ? 'bg-[#1a1c24] text-white font-medium' : ''
          }`}
        >
          <SettingsIcon size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
