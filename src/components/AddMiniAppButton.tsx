'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';

export default function AddMiniAppButton() {
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const checkAdded = async () => {
            try {
                const context = await sdk.context;
                if (context?.client?.added) {
                    setIsAdded(true);
                }
            } catch (err) {
                console.error('Failed to get context', err);
            }
        };
        checkAdded();
    }, []);

    const handleAdd = async () => {
        try {
            await sdk.actions.addFrame();
            setIsAdded(true);
        } catch (error) {
            console.error('Failed to add app', error);
        }
    };

    if (isAdded) {
        return (
            <div className="w-full text-zinc-500 text-[10px] bg-black/40 border border-zinc-800 rounded-md px-4 py-3 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <span>App Added</span>
                <span className="text-green-500">✅</span>
            </div>
        );
    }

    return (
        <button
            onClick={handleAdd}
            className="w-full text-white text-xs bg-black border border-yellow-500 rounded-md px-4 py-3 hover:bg-zinc-900 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.2)] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            title="Add to Warpcast"
        >
            <span>Add Mini App</span>
            <span>➕</span>
        </button>
    );
}
