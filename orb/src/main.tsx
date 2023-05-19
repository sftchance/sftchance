import React from 'react';
import ReactDOM from 'react-dom/client';

import { Analytics } from '@vercel/analytics/react';

import { WagmiConfig } from 'wagmi';
import { config } from './wagmi';

import App from './App.tsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <WagmiConfig config={config}>
            <App />
        </WagmiConfig>

        <Analytics />
    </React.StrictMode>,
);
