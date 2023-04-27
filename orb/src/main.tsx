import React from 'react';
import ReactDOM from 'react-dom/client';

import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

import { Analytics } from '@vercel/analytics/react';

import App from './App.tsx';

import './index.css';

const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <WagmiConfig client={client}>
            <App />
        </WagmiConfig>

        <Analytics />
    </React.StrictMode>,
);
