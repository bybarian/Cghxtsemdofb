import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('[App] Starting...');

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('[App] Render trigger successful');
  } catch (err) {
    console.error('[App] Initial render failed:', err);
    container.innerHTML = `
      <div style="padding: 40px; color: red; font-family: sans-serif;">
        <h2>無法啟動手冊應用程式</h2>
        <p>請檢查網路連線或重新整理頁面。若持續發生錯誤，請截圖提供給數位中心。</p>
        <hr/>
        <pre style="background:#eee; padding: 10px; font-size: 12px; overflow: auto;">${err instanceof Error ? err.stack : String(err)}</pre>
      </div>`;
  }
} else {
  console.error('[App] Critical: Root container not found');
}
