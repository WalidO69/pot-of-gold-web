'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Abi } from 'viem';
import PotOfGoldABI from '@/abi/PotOfGold.json';
import confetti from 'canvas-confetti';

import { CONTRACT_ADDRESS, APP_URL } from '@/config';

export default function DailyShareButton() {
    const { address } = useAccount();
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    // Read last claim time
    const { data: lastDailyClaim, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'lastDailyClaim',
        args: address ? [address] : undefined,
    });

    const { data: hash, isPending, writeContract } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    // Timer Logic
    useEffect(() => {
        if (!lastDailyClaim) return;

        const updateTimer = () => {
            const now = Math.floor(Date.now() / 1000);
            const nextClaim = Number(lastDailyClaim) + (24 * 3600);
            const diff = nextClaim - now;

            if (diff <= 0) {
                setTimeLeft(null); // Ready
            } else {
                const h = Math.floor(diff / 3600).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
                const s = (diff % 60).toString().padStart(2, '0');
                setTimeLeft(`${h}:${m}:${s}`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [lastDailyClaim]);

    // Effect for successful claim
    useEffect(() => {
        if (isConfirmed) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 9999
            });
            refetch(); // Update state
        }
    }, [isConfirmed, refetch]);

    const handleShareAndClaim = () => {
        // 1. Open Share Intent
        const shareText = "I just grabbed my free Daily Ticket for the Pot of Gold! 🎟️🍀\n\nDaily chance to win the MegaPot! 💰\n\n👇 Claim yours now!";
        // Using the APP_URL so Warpcast crawls for metadata (Frame v1/v2)
        const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${APP_URL}`;
        window.open(shareUrl, '_blank');

        // 2. Trigger Transaction
        // Small delay to let the share window open
        setTimeout(() => {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: PotOfGoldABI.abi as Abi,
                functionName: 'claimDailyTicket',
            });
        }, 1000);
    };

    return (
        <div className="w-full max-w-sm mx-auto relative group">
            {/* Rainbow Border Container */}
            <div className={`
                relative p-1 rounded-xl overflow-hidden
                ${!timeLeft ? 'animate-pulse hover:scale-105 transition-transform cursor-pointer' : 'opacity-80 grayscale'}
            `}>
                {/* Rainbow Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-spin-slow opacity-80" />

                {/* Content */}
                {timeLeft ? (
                    <div className="relative w-full bg-zinc-900/90 rounded-lg p-4 border-2 border-zinc-700 flex flex-col items-center justify-center gap-2 overflow-hidden">
                        {/* Progress Bar Background */}
                        <div className="absolute bottom-0 left-0 h-1 bg-yellow-500/20 w-full" />

                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">Next Free Ticket In</span>
                        <div className="text-2xl font-black text-white font-mono tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            {timeLeft}
                        </div>
                        <p className="text-[9px] text-zinc-600 uppercase font-bold">Come back tomorrow! 🍀</p>
                    </div>
                ) : (
                    <button
                        onClick={handleShareAndClaim}
                        disabled={isPending || isConfirming}
                        className="
                            relative w-full bg-black/90 rounded-lg p-2
                            flex items-center justify-between gap-4 border-2 border-white
                            shadow-[0_0_15px_rgba(255,255,255,0.3)]
                        "
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src="/daily-share.png"
                                alt="Daily Reward"
                                className="w-12 h-12 object-contain rounded-md"
                            />
                            <div className="flex flex-col items-start">
                                <span className="text-white font-black text-lg uppercase tracking-wider italic drop-shadow-[2px_2px_0_#000]">
                                    DAILY SHARE
                                </span>
                                <span className="text-[10px] text-yellow-300 font-mono">
                                    +1 FREE MEGAPOT TICKET 🎟️
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/10 px-3 py-1 rounded text-xs font-bold text-white min-w-[80px] text-center">
                            {isPending || isConfirming ? (
                                <span className="animate-pulse">Claiming...</span>
                            ) : (
                                <span className="text-green-400">CLAIM 🚀</span>
                            )}
                        </div>
                    </button>
                )}
            </div>

            {/* Notification Dot if ready */}
            {!timeLeft && !isPending && !isConfirming && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-bounce shadow-lg border border-white" />
            )}
        </div>
    );
}
