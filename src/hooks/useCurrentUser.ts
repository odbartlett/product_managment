import { useAppContext } from '../context/AppContext';

export function useCurrentUser() {
  const { currentUser, state, dispatch } = useAppContext();

  const switchUser = (userId: string) => {
    dispatch({ type: 'SET_ACTIVE_USER', payload: userId });
  };

  return { currentUser, allUsers: state.users, switchUser };
}
