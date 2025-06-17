import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Conditionally import global styles for non-admin routes
const isAdminRoute = window.location.pathname.startsWith('/admin');

if (!isAdminRoute) {
  import('./styles/global/baguetteBox.min.css');
  import('./styles/global/bootstrap.min.css');
  import('./styles/global/dat.gui.css');
  import('./styles/global/splitting.css');
  import('./styles/global/splitting-cells.css');
  import('./styles/global/style.css');
  import('./styles/global/swiper-bundle.min.css');
  import('./styles/global/style_overwrite.css');
  // You can also conditionally load JS files here using dynamic `import()` or appendScript functions
}

// Bootstrap the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
