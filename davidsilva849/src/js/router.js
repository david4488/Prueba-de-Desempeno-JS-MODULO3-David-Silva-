import { loginView } from './views/login.js';
import { registerView } from './views/register.js';
import { dashboardView } from './views/dashboard.js'; // we import the views 

const routes = {
  '/login': loginView,   //routes of views
  '/register': registerView,
  '/dashboard': dashboardView
};

export function router() {
  const path = window.location.hash.slice(1) || '/login';
  const user = JSON.parse(localStorage.getItem('user'));

  // Route protection
  if (!user && path.startsWith('/dashboard')) {
    window.location.hash = '/login';
    return;
  }

  if (user && (path === '/login' || path === '/register')) {
    window.location.hash = '/dashboard';
    return;
  }

  const render = routes[path];
  if (render) render();
  else document.getElementById('content').innerHTML = '<h2>404 - Página no encontrada</h2>';
}
