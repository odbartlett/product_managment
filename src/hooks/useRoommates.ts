import { useAppContext } from '../context/AppContext';

export function useRoommates() {
  const { state, dispatch, currentUser } = useAppContext();

  if (!currentUser) return { roommates: [], sharedItems: [], claimItem: () => {}, unclaimItem: () => {} };

  const roommates = state.users.filter((u) => currentUser.roommateIds.includes(u.id));
  const roomKey = `${currentUser.dormBuilding}-${currentUser.roomNumber}`;
  const sharedItems = state.sharedItems.filter((item) => item.roomKey === roomKey);

  const claimItem = (itemId: string) => {
    dispatch({ type: 'CLAIM_ITEM', payload: { itemId, userId: currentUser.id } });
  };

  const unclaimItem = (itemId: string) => {
    dispatch({ type: 'UNCLAIM_ITEM', payload: { itemId } });
  };

  const getUserById = (id: string) => state.users.find((u) => u.id === id);

  return { roommates, sharedItems, claimItem, unclaimItem, getUserById };
}
