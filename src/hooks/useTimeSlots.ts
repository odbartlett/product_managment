import { useAppContext } from '../context/AppContext';

export function useTimeSlots() {
  const { state, dispatch, currentUser } = useAppContext();

  const slots = state.timeSlots.filter(
    (s) =>
      s.university === currentUser?.university &&
      s.dormBuilding === currentUser?.dormBuilding
  );

  const currentSlotId = currentUser?.timeSlotId ?? null;

  const bookSlot = (slotId: string) => {
    if (!currentUser) return;
    // If already booked somewhere, unbook first
    if (currentSlotId && currentSlotId !== slotId) {
      dispatch({ type: 'UNBOOK_SLOT', payload: { slotId: currentSlotId, userId: currentUser.id } });
    }
    dispatch({ type: 'BOOK_SLOT', payload: { slotId, userId: currentUser.id } });
  };

  const unbookSlot = () => {
    if (!currentUser || !currentSlotId) return;
    dispatch({ type: 'UNBOOK_SLOT', payload: { slotId: currentSlotId, userId: currentUser.id } });
  };

  return { slots, currentSlotId, bookSlot, unbookSlot };
}
