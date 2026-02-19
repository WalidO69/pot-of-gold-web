'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    darkTheme,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
    rainbowWallet,
    coinbaseWallet,
    metaMaskWallet,
    walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import {
    base,
    baseSepolia,
    mainnet,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { FarcasterProvider } from '@/components/FarcasterProvider';
import { ACTIVE_CHAIN } from '@/config';

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [
                rainbowWallet,
                coinbaseWallet,
                metaMaskWallet,
                walletConnectWallet,
            ],
        },
    ],
    {
        appName: 'Pot of Gold',
        projectId: 'YOUR_PROJECT_ID',
    }
);

const config = createConfig({
    chains: [ACTIVE_CHAIN, base, baseSepolia, mainnet],
    transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
        [mainnet.id]: http(),
    },
    connectors: [...connectors, farcasterMiniApp()],
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent SSR completely for Wagmi/RainbowKit to avoid localStorage errors
    if (!mounted) return null;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#ffd700', // gold-shine
                        accentColorForeground: 'black',
                        borderRadius: 'small',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                >
                    <FarcasterProvider>
                        {children}
                    </FarcasterProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
