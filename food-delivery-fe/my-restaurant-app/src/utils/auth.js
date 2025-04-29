export const signOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/signin';
}; 