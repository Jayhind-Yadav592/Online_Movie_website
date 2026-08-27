import api from '@/lib/axios';

export interface Movie {
  id: number;
  title: string;
  slug: string;
  poster: string;
  backdrop: string;
  release_date: string;
  runtime: number;
  rating: number;
  certification: string;
  language: { id: number; name: string; code: string };
  genres: Array<{ id: number; name: string; slug: string }>;
  featured?: boolean;
  trending?: boolean;
}

export const getFeaturedMovie = async (): Promise<Movie | null> => {
  try {
    const res = await api.get('/movies/?featured=true');
    return res.data.results && res.data.results.length > 0 ? res.data.results[0] : null;
  } catch (error) {
    console.error("Error fetching featured movie", error);
    return null;
  }
};

export const getMovies = async (params: any = {}): Promise<Movie[]> => {
  try {
    const res = await api.get('/movies/', { params });
    return res.data.results || [];
  } catch (error) {
    console.error("Error fetching movies", error);
    return [];
  }
};

export const getSeries = async (params: any = {}): Promise<any[]> => {
  try {
    const res = await api.get('/series/', { params });
    return res.data.results || [];
  } catch (error) {
    console.error("Error fetching series", error);
    return [];
  }
};
