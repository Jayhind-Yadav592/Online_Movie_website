import api from '@/lib/axios';

export const getWatchlist = async () => {
  const res = await api.get('/user/watchlist/');
  return res.data;
};

export const addToWatchlist = async (movieId: number) => {
  const res = await api.post('/user/watchlist/', { movie: movieId });
  return res.data;
};

export const removeFromWatchlist = async (id: number) => {
  const res = await api.delete(`/user/watchlist/${id}/`);
  return res.data;
};

export const getWatchHistory = async () => {
  const res = await api.get('/user/history/');
  return res.data;
};

export const updateWatchHistory = async (movieId: number, progress: number, duration: number, historyId?: number) => {
  if (historyId) {
    const res = await api.patch(`/user/history/${historyId}/`, {
      progress_seconds: progress,
      duration_seconds: duration,
      completed: progress / duration > 0.95
    });
    return res.data;
  } else {
    // We might need to get existing history first or let backend handle update_or_create.
    // Wait, the backend WatchHistoryViewSet doesn't use update_or_create by default.
    // Let's create a specialized endpoint for tracking, or just do POST if not exists.
    const res = await api.post('/user/history/', {
      movie: movieId,
      progress_seconds: progress,
      duration_seconds: duration,
      completed: progress / duration > 0.95
    });
    return res.data;
  }
};
