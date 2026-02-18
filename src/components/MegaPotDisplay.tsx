'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits, type Abi } from 'viem';
import PotOfGoldABI from '@/abi/PotOfGold.json';
import PixelLoader from './PixelLoader';

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000';

const getNextDrawTime = () => {
    const now = new Date();
    const target = new Date(now);

    // Set to next Sunday
    const day = now.getUTCDay();
    const diff = (7 - day) % 7;
    target.setUTCDate(now.getUTCDate() + diff);

    // Set to 22:00:00 UTC
    target.setUTCHours(22, 0, 0, 0);

    // If target is in the past (i.e. it's Sunday after 10PM), move to next week
    if (target.getTime() <= now.getTime()) {
        target.setUTCDate(target.getUTCDate() + 7);
    }

    return target;
};

export default function MegaPotDisplay() {
    const { data: megaPotBalance, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'megaPotBalance',
    });

    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = getNextDrawTime().getTime();
            const distance = target - now;

            if (distance < 0) {
                return 'DRAWING...';
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };

        // Initial set
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full max-w-md mx-auto mb-6">
            <div className="bg-zinc-900/90 border-2 border-yellow-400 rounded-lg py-2 px-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
                {/* Left: Trophy Icon */}
                <span className="text-white text-xl filter drop-shadow-md">MEGAPOT</span>

                {/* Center: Amount */}
                <div className="flex flex-col items-center flex-1">
                    {isLoading ? (
                        <PixelLoader size="sm" />
                    ) : (
                        <span className="text-yellow-400 font-pixel text-lg animate-pulse drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            {megaPotBalance ? formatUnits(megaPotBalance as bigint, 6) : '0'} $
                        </span>
                    )}
                </div>

                {/* Right: Badge */}
                <div className="flex flex-col items-end">
                    <div className="bg-green-600 text-white text-[10px] px-2 py-1 rounded shadow-sm font-bold tracking-wider mb-1">
                        WEEKLY DRAW
                    </div>
                    <span className="text-[8px] text-yellow-200 font-mono text-right min-w-[100px]">
                        {timeLeft || 'LOADING...'}
                    </span>
                </div>
            </div>
        </div>
    );
}
