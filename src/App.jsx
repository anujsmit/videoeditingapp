import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import MainEditor from './pages/MainEditor';
import MediaLibrary from './pages/MediaLibrary';
import Effects from './pages/Effects';
import AudioMixer from './pages/AudioMixer';
import Captions from './pages/Captions';
import Export from './pages/Export';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/editor" element={<MainEditor />} />
        <Route path="/media" element={<MediaLibrary />} />
        <Route path="/effects" element={<Effects />} />
        <Route path="/audio" element={<AudioMixer />} />
        <Route path="/captions" element={<Captions />} />
        <Route path="/export" element={<Export />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}