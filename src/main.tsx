
import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('MINIMAL_TEST_LOADED');
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<h1 style={{color: 'blue', padding: '100px'}}>VITE REACT IS WORKING</h1>);
  
  const status = document.createElement('div');
  status.style.cssText = "position:fixed;top:0;left:0;background:green;color:white;z-index:99999;padding:10px;";
  status.innerText = "ISOLATION TEST ACTIVE";
  document.body.appendChild(status);
}

