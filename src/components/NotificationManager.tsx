'use client';

import { useEffect, useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { formatUnits } from 'viem';
import PotOfGoldABI from '@/abi/PotOfGold.json';
import { type Abi } from 'viem';
import { useGameSounds } from '../hooks/useGameSounds';
import { useTestMode } from '@/context/TestModeContext';
import confetti from 'canvas-confetti';

// Simple Toast Component
function Toast({ message, type, onClose, onShare }: { message: string, type: 'success' | 'info', onClose: () => void, onShare?: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 8000); // Longer duration for winners
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-gray-800';
    const borderColor = type === 'success' ? 'border-green-400' : 'border-gold-shine';

    return (
        <div className={`pointer-events-auto bg-gray-800 text-white px-4 py-3 rounded shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 ${borderColor} animate-bounce font-pixel text-xs md:text-sm z-50 flex flex-col gap-2 min-w-[300px]`}>
            <div className="flex items-center justify-between gap-4">
                <span className="flex-1">{message}</span>
                <button onClick={onClose} className="text-white/80 hover:text-white font-bold ml-2">X</button>
            </div>
            {onShare && (
                <button
                    onClick={onShare}
                    className="bg-white text-black font-bold py-2 px-4 rounded text-[10px] hover:bg-gray-200 transition-colors self-end uppercase flex items-center gap-2"
                >
                    <span>Share on Warpcast</span>
                    <span>📢</span>
                </button>
            )}
        </div>
    );
}

export default function NotificationManager() {
    const { playCoin, playWin, playFail } = useGameSounds();
    const { isTestMode, lastEvent } = useTestMode();
    const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'info', shareUrl?: string }[]>([]);

    const addToast = (message: string, type: 'success' | 'info', shareUrl?: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, shareUrl }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleShare = (url: string) => {
        window.open(url, '_blank');
    };

    // --- Test Mode Listener ---
    useEffect(() => {
        if (!isTestMode || !lastEvent) return;

        // Give a small delay to ensure state update propagates (sometimes needed for sounds)
        const timeout = setTimeout(() => {
            if (lastEvent.type === 'PLAYER_ENTERED') {
                console.log('Test Event: Player Entered', lastEvent.player);
                playCoin();
                addToast(`New Player Joined! 💰`, 'info');
            } else if (lastEvent.type === 'WINNER_SELECTED') {
                console.log('Test Event: Winner Selected', lastEvent.winner);
                playWin();

                // Confetti
                const duration = 5 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 50 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                }, 250);

                const formattedAmount = formatUnits(lastEvent.amount, 6);
                addToast(`WINNER! ${lastEvent.winner.slice(0, 6)}... won ${formattedAmount}$! 🏆`, 'success');
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [lastEvent, isTestMode, playCoin, playWin]);

    // --- Event Listeners ---

    // 1. Player Entered
    useWatchContractEvent({
        address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
        abi: PotOfGoldABI.abi as Abi,
        eventName: 'PlayerEntered',
        onLogs(logs) {
            logs.forEach(log => {
                // @ts-ignore
                const player = log.args.player;
                console.log('New Player:', player);
                playCoin();
                addToast(`New Player Joined! 💰`, 'info');
            });
        },
    });

    // 2. Winner Selected
    useWatchContractEvent({
        address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
        abi: PotOfGoldABI.abi as Abi,
        eventName: 'WinnerSelected',
        onLogs(logs) {
            logs.forEach(log => {
                // @ts-ignore
                const { winner, amountWon } = log.args;
                console.log('Winner:', winner, amountWon);
                playWin();

                // Confetti Explosion!
                const duration = 5 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();

                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }

                    const particleCount = 50 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                }, 250);

                const formattedAmount = formatUnits(amountWon, 6);
                const shareText = `I just saw someone win ${formattedAmount}$ on Pot of Gold! 🍀\n\nJoin the pot now!`;
                const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=https://pot-of-gold-web.vercel.app`;

                addToast(`WINNER! ${winner ? `${winner.slice(0, 6)}...` : 'Unknown'} won ${formattedAmount}$! 🏆`, 'success', shareUrl);
            });
        },
    });

    // 3. Refund Issued
    useWatchContractEvent({
        address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
        abi: PotOfGoldABI.abi as Abi,
        eventName: 'RefundIssued',
        onLogs() {
            playFail();
            addToast('Game Refunded. Check your wallet.', 'info');
        },
    });

    return (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    onShare={toast.shareUrl ? () => handleShare(toast.shareUrl as string) : undefined}
                />
            ))}
        </div>
    );
}
