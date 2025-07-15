// Save the user to localStorage
export function setUserSession(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // Gets the current user
  export function getUserSession() {
    return JSON.parse(localStorage.getItem('user'));
  }
  
  // Sign out
  export function logout() {
    localStorage.removeItem('user');
    window.location.hash = '/login';
  }
  