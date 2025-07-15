import { router } from './router.js';

// Listen for route changes
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
