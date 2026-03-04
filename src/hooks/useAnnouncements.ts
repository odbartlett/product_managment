import { useAppContext } from '../context/AppContext';
import type { Announcement } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useAnnouncements() {
  const { state, dispatch, currentUser } = useAppContext();

  const announcements = state.announcements.filter(
    (a) =>
      a.university === currentUser?.university &&
      (a.dormBuilding === 'all' || a.dormBuilding === currentUser?.dormBuilding)
  );

  const pinned = announcements.filter((a) => a.isPinned);
  const unpinned = announcements.filter((a) => !a.isPinned);

  const postAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt' | 'authorId' | 'authorName' | 'university'>) => {
    if (!currentUser) return;
    const announcement: Announcement = {
      ...data,
      id: uuidv4(),
      authorId: currentUser.id,
      authorName: `${currentUser.name} (RA)`,
      university: currentUser.university,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ANNOUNCEMENT', payload: announcement });
  };

  return { announcements, pinned, unpinned, postAnnouncement };
}
