console.log('MAIN_LOAD_START');

// Add a super-early visual indicator
const early = document.createElement('div');
early.style.cssText = "position:fixed;top:0;right:0;background:black;color:white;z-index:9999999;font-size:10px;padding:2px;";
early.innerText = "MAIN EXEC";
document.body.appendChild(early);

import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

console.log('MAIN_IMPORTS_DONE');
early.innerText += " -> IMPORTS OK";

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('MAIN_ROOT_FOUND');
  early.innerText += " -> ROOT OK";
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('MAIN_RENDER_CALLED');
    early.innerText += " -> RENDER OK";
    early.style.background = "green";
  } catch (err) {
    console.error('MAIN_RENDER_FAILED', err);
    early.innerText += " -> RENDER ERROR: " + err;
    early.style.background = "red";
  }
} else {
  console.error('MAIN_NO_ROOT');
  early.innerText += " -> NO ROOT";
}
