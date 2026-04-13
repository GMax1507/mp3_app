const JAMENDO_CLIENT_ID = '79fe67b2'; 
const BASE_URL = 'https://api.jamendo.com/v3.0';

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string;
  duration: number;
  image: string;
}

const buildUrl = (endpoint: string, params: Record<string, string | number>) => {
  const query = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: 'json',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  return `${BASE_URL}${endpoint}?${query}`;
};

export const jamendoApi = {
  getPopularTracks: async (limit = 10): Promise<JamendoTrack[]> => {
    try {
      const url = buildUrl('/tracks', {
        limit, 
        order: 'popularity_total',
        imagesize: 200, 
        audioformat: 'mp32',
      });
      const response = await fetch(url);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Erro Jamendo (Popular):", error);
      return [];
    }
  },

  searchTracks: async (query: string, limit = 20): Promise<JamendoTrack[]> => {
    if (!query.trim()) return [];
    try {
      const url = buildUrl('/tracks', {
        limit, 
        search: query,
        imagesize: 200, 
        audioformat: 'mp32',
      });
      const response = await fetch(url);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Erro Jamendo (Search):", error);
      return [];
    }
  },

  getTracksByGenre: async (tag: string, limit = 15): Promise<JamendoTrack[]> => {
    try {
      const url = buildUrl('/tracks', {
        limit, 
        tags: tag, 
        order: 'popularity_total',
        imagesize: 200, 
        audioformat: 'mp32',
      });
      const response = await fetch(url);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Erro Jamendo (Genre):", error);
      return [];
    }
  },

  getRecommendedTracks: async (limit = 10): Promise<JamendoTrack[]> => {
    try {
      const url = buildUrl('/tracks', {
        limit, 
        order: 'popularity_week',
        imagesize: 200, 
        audioformat: 'mp32',
      });
      const response = await fetch(url);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Erro Jamendo (Recommended):", error);
      return [];
    }
  },
};