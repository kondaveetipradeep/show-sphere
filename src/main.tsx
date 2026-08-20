// Ensure fetch and web standard APIs have valid setters across Window.prototype, window, and globalThis
try {
  const props = ['fetch', 'Request', 'Response', 'Headers', 'FormData'] as const;
  const targets: any[] = [];
  if (typeof Window !== 'undefined' && Window.prototype) targets.push(Window.prototype);
  if (typeof window !== 'undefined') targets.push(window);
  if (typeof globalThis !== 'undefined') targets.push(globalThis);
  if (typeof self !== 'undefined') targets.push(self);

  props.forEach((prop) => {
    try {
      let currentVal: any = undefined;
      try {
        currentVal = (window as any)?.[prop];
      } catch (_) {}
      let holder = currentVal;

      targets.forEach((target) => {
        try {
          Object.defineProperty(target, prop, {
            get() {
              return holder;
            },
            set(newVal) {
              holder = newVal;
            },
            configurable: true,
            enumerable: true,
          });
        } catch (_) {}
      });
    } catch (_) {}
  });
} catch (_) {}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

