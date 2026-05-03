console.log('Main.tsx point A');
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx point B');
const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('Main.tsx point C - Root found');
  const root = createRoot(rootElement);
  root.render(<App />);
  
  // Visual indicator that main.tsx reached this point
  const indicator = document.createElement('div');
  indicator.style.position = 'fixed';
  indicator.style.bottom = '15px';
  indicator.style.right = '0';
  indicator.style.background = 'green';
  indicator.style.color = 'white';
  indicator.style.fontSize = '10px';
  indicator.style.padding = '2px 5px';
  indicator.style.zIndex = '1000001';
  indicator.innerText = 'MAIN.TSX OK';
  document.body.appendChild(indicator);
} else {
  console.error('Failed to find root element');
}
