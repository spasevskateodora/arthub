const MET_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

export const searchMuseum = async (query = 'painting', limit = 3) => {
  try {
    const res = await fetch(`${MET_BASE}/search?hasImages=true&q=${query}&departmentId=11`);
    const data = await res.json();
    const ids = (data.objectIDs || []).slice(0, limit);
    const works = await Promise.all(
      ids.map(id => fetch(`${MET_BASE}/objects/${id}`).then(r => r.json()))
    );
    return works.filter(w => w.primaryImageSmall);
  } catch {
    return [];
  }
};
