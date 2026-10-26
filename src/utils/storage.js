// Storage utility using browser IndexedDB for persistent storage of user files and projects

const DB_NAME = 'anujkattel_editor_db';
const DB_VERSION = 1;

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Generate thumbnail and duration for user uploaded video/image
export async function extractMediaMetadata(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    const isAudio = file.type.startsWith('audio');

    if (isVideo) {
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 0.5;

      video.onloadedmetadata = () => {
        const durationSec = video.duration || 0;
        const minutes = Math.floor(durationSec / 60);
        const seconds = Math.floor(durationSec % 60);
        const durationStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 180;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            URL.revokeObjectURL(url);
            resolve({ duration: durationStr, durationSec, thumbnail });
          } catch {
            URL.revokeObjectURL(url);
            resolve({ duration: durationStr, durationSec, thumbnail: null });
          }
        };
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ duration: '00:10', durationSec: 10, thumbnail: null });
      };
    } else if (isImage) {
      resolve({ duration: 'Image', durationSec: 5, thumbnail: url });
    } else if (isAudio) {
      const audio = document.createElement('audio');
      audio.src = url;
      audio.onloadedmetadata = () => {
        const durationSec = audio.duration || 0;
        const minutes = Math.floor(durationSec / 60);
        const seconds = Math.floor(durationSec % 60);
        URL.revokeObjectURL(url);
        resolve({ duration: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, durationSec, thumbnail: null });
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ duration: '03:00', durationSec: 180, thumbnail: null });
      };
    } else {
      resolve({ duration: 'File', durationSec: 5, thumbnail: null });
    }
  });
}

// Save a user's uploaded file into IndexedDB
export async function saveMediaFile(file) {
  const db = await openDatabase();
  const metadata = await extractMediaMetadata(file);

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isVideo = file.type.startsWith('video');
  const isAudio = file.type.startsWith('audio');
  const isImage = file.type.startsWith('image');

  const mediaItem = {
    id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    type: isVideo ? 'Videos' : isAudio ? 'Audio' : isImage ? 'Images' : 'Other',
    size: formatSize(file.size),
    rawSize: file.size,
    mimeType: file.type,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    duration: metadata.duration,
    durationSec: metadata.durationSec,
    thumbnail: metadata.thumbnail,
    fileBlob: file,
    favorite: false,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readwrite');
    const store = tx.objectStore('media');
    const req = store.put(mediaItem);
    req.onsuccess = () => {
      resolve({
        ...mediaItem,
        blobUrl: URL.createObjectURL(file),
      });
    };
    req.onerror = () => reject(req.error);
  });
}

// Retrieve all user saved media
export async function getAllMedia() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readonly');
    const store = tx.objectStore('media');
    const req = store.getAll();

    req.onsuccess = () => {
      const items = (req.result || []).map((item) => ({
        ...item,
        blobUrl: item.fileBlob ? URL.createObjectURL(item.fileBlob) : item.thumbnail,
      }));
      resolve(items.reverse());
    };
    req.onerror = () => reject(req.error);
  });
}

// Delete media item
export async function deleteMedia(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readwrite');
    const store = tx.objectStore('media');
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Toggle media favorite
export async function toggleMediaFavorite(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readwrite');
    const store = tx.objectStore('media');
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item = getReq.result;
      if (item) {
        item.favorite = !item.favorite;
        store.put(item);
        resolve(item.favorite);
      } else {
        resolve(false);
      }
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

// Save or update a project
export async function saveProject(project) {
  const db = await openDatabase();
  const proj = {
    id: project.id || `proj_${Date.now()}`,
    name: project.name || 'Untitled Project',
    aspect: project.aspect || '16:9',
    resolution: project.resolution || '1920 × 1080 (Full HD)',
    fps: project.fps || '30 FPS',
    updatedAt: 'Just now',
    createdAt: project.createdAt || new Date().toISOString(),
    thumbnail: project.thumbnail || null,
    clips: project.clips || [],
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('projects', 'readwrite');
    const store = tx.objectStore('projects');
    const req = store.put(proj);
    req.onsuccess = () => {
      localStorage.setItem('active_project_id', proj.id);
      resolve(proj);
    };
    req.onerror = () => reject(req.error);
  });
}

// Retrieve all user saved projects
export async function getAllProjects() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('projects', 'readonly');
    const store = tx.objectStore('projects');
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result || []).reverse());
    req.onerror = () => reject(req.error);
  });
}

// Delete a project
export async function deleteProject(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('projects', 'readwrite');
    const store = tx.objectStore('projects');
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Get the current active project
export async function getActiveProject() {
  const id = localStorage.getItem('active_project_id');
  if (!id) return null;
  const db = await openDatabase();
  return new Promise((resolve) => {
    const tx = db.transaction('projects', 'readonly');
    const store = tx.objectStore('projects');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

