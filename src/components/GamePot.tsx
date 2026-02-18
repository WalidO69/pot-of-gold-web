'use client';

import { useEffect, useState } from 'react';
import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits, type Abi } from 'viem';
import PotOfGoldABI from '@/abi/PotOfGold.json';
import ERC20ABI from '@/abi/ERC20.json';
import PixelLoader from './PixelLoader';
import ShareModal from './ShareModal';
import { useTestMode } from '@/context/TestModeContext';


// Placeholder addresses (Replace with real ones in .env)
// Address from .env.local
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x6CE78fCDc5E9b1B5Cf970B029E0e95BA4a73ae79';
// USDC on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

export default function GamePot() {
    const { address: realAddress } = useAccount();
    const { isTestMode, state: testState, actions: testActions, isProcessing: isTestProcessing, lastEvent: testLastEvent } = useTestMode();
    const address = isTestMode ? testState.address as `0x${string}` : realAddress;

    const [showShareModal, setShowShareModal] = useState(false);

    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
        "I just joined the Pot of Gold! 🍀\n\n6 players enter, 1 winner takes 5$.\n\nJoin the round now!"
    )}&embeds[]=https://pot-of-gold-web.vercel.app`;

    // --- READS ---
    const { data: entryFee } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'ENTRY_FEE',
    });

    const { data: activePlayers, refetch: refetchPlayers, isLoading: isLoadingPlayers } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'getPlayersCount',
    });

    const { data: discountedFee } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'DISCOUNTED_FEE',
    });

    const { data: consecutiveLosses } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'consecutiveLosses',
        args: address ? [address] : undefined,
    });

    const { data: lastGameStart } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'lastGameStart',
    });

    // Fetch players array (0-5) to determine count
    const { data: playersData } = useReadContracts({
        contracts: Array.from({ length: 6 }).map((_, i) => ({
            address: CONTRACT_ADDRESS,
            abi: PotOfGoldABI.abi as Abi,
            functionName: 'players',
            args: [BigInt(i)],
        })),
    });

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACT_ADDRESS] : undefined,
    });

    // Logic
    // Convert BigInt to number for display
    const playerCount = isTestMode ? testState.players.length : (activePlayers ? Number(activePlayers) : 0);

    const hasDiscount = isTestMode
        ? testState.consecutiveLosses >= 5
        : (consecutiveLosses ? Number(consecutiveLosses) >= 5 : false);

    const currentFee = isTestMode
        ? (hasDiscount ? testState.discountedFee : testState.entryFee)
        : (hasDiscount ? discountedFee : entryFee);

    const needsApproval = isTestMode
        ? testState.allowance < (currentFee as bigint || BigInt(0))
        : (currentFee && allowance ? (allowance as bigint) < (currentFee as bigint) : true);

    // Refund Logic
    const currentTime = Math.floor(Date.now() / 1000);
    const refundTime = lastGameStart ? Number(lastGameStart) + (24 * 3600) : Infinity;
    const canRefund = !isTestMode && playerCount > 0 && playerCount < 6 && currentTime > refundTime;

    // Player Entry Limit Logic (Max 2)
    const activePlayersArray = isTestMode
        ? testState.players
        : (playersData?.map(p => p.status === 'success' ? (p.result as string) : null).filter(Boolean) || []);

    const userEntryCount = activePlayersArray.filter(p => p?.toLowerCase() === address?.toLowerCase()).length;
    const isLimitReached = userEntryCount >= 2;

    // --- WRITES ---
    const { data: hash, error, isPending, writeContract } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isConfirmed && !isTestMode) {
            refetchAllowance();
            refetchPlayers();
            setShowShareModal(true);
        }
    }, [isConfirmed, refetchAllowance, refetchPlayers, isTestMode]);

    // Test Mode Join Listener
    useEffect(() => {
        if (isTestMode && testLastEvent && testLastEvent.type === 'PLAYER_ENTERED' && testLastEvent.player === address) {
            setShowShareModal(true);
        }
    }, [isTestMode, testLastEvent, address]);


    const handleInteraction = () => {
        if (isTestMode) {
            if (needsApproval) {
                testActions.approve();
            } else {
                testActions.joinPot();
            }
            return;
        }

        if (needsApproval) {
            writeContract({
                address: USDC_ADDRESS,
                abi: ERC20ABI,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS, parseUnits('100', 6)], // Approve plenty for UX
            });
        } else {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: PotOfGoldABI.abi as Abi,
                functionName: 'enter',
            });
        }
    };

    const handleRefund = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: PotOfGoldABI.abi as Abi,
            functionName: 'refund',
        });
    };

    const getButtonText = () => {
        if (isTestMode && isTestProcessing) return 'Processing (Fake)...';
        if (isPending) return 'Processing...';
        if (isConfirming) return 'Confirming...';
        if (isLimitReached) return 'Max 2 entries reached';
        if (needsApproval) return 'Approve $';
        if (hasDiscount) return 'Enter Pot (0.5$) - 50% OFF!';
        return 'Enter Pot (1$)';
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className={`relative ${playerCount > 0 ? 'animate-wiggle' : ''}`} style={{ animationDuration: `${Math.max(0.1, 1 - (playerCount * 0.15))}s` }}>
                {/* Glowing Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,215,0,0.4)_0%,transparent_70%)] animate-pulse z-[-1]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[radial-gradient(circle,rgba(255,223,0,0.6)_0%,transparent_60%)] animate-pulse delay-75 z-[-1]" />

                <img
                    src="/images/pot-idle.gif"
                    alt="Pot of Gold"
                    className={`w-80 h-80 pixelated object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] ${playerCount === 0 ? 'animate-heartbeat' : ''}`}
                />
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
                <div className="bg-zinc-800 border-2 border-white px-4 py-2 text-center w-full shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                    <div className="text-white text-sm flex items-center justify-center gap-2">
                        <span className="text-white">PLAYERS:</span>
                        {isLoadingPlayers && !isTestMode ? (
                            <PixelLoader size="sm" />
                        ) : (
                            <span>{playerCount} / 6</span>
                        )}
                    </div>
                </div>

                <p className="text-[10px] text-white text-center -mt-2 px-2">
                    If the pot doesn't reach 6 players within 24 hours, all participants will be refunded
                </p>

                {/* Current Round Players List */}
                {playerCount > 0 && (
                    <div className="bg-black/80 border-2 border-farcaster-purple p-2 w-full">
                        <h3 className="text-[10px] text-white mb-2 text-center border-b border-farcaster-purple/30 pb-1">
                            CURRENT ROUND PLAYERS
                        </h3>
                        <div className="flex flex-col gap-2">
                            {isTestMode ? (
                                testState.players.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded">
                                        <img
                                            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${p}`}
                                            alt="Avatar"
                                            className="w-6 h-6 rounded bg-zinc-800 border border-white/20"
                                        />
                                        <span className="text-xs text-white font-mono truncate">
                                            {p.slice(0, 6)}...{p.slice(-4)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                playersData?.map((p, i) => {
                                    if (p.status !== 'success' || !p.result || p.result === '0x0000000000000000000000000000000000000000') return null;
                                    const playerAddress = p.result as string;
                                    return (
                                        <div key={i} className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded">
                                            <img
                                                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${playerAddress}`}
                                                alt="Avatar"
                                                className="w-6 h-6 rounded bg-zinc-800 border border-white/20"
                                            />
                                            <span className="text-xs text-white font-mono truncate">
                                                {playerAddress.slice(0, 6)}...{playerAddress.slice(-4)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={handleInteraction}
                disabled={isPending || isConfirming || (isTestMode ? isTestProcessing : false) || playerCount >= 6 || isLimitReached}
                className={`
            w-full max-w-sm py-4 px-6 uppercase font-bold text-sm tracking-widest
            border-b-4 active:border-b-0 active:mt-1 transition-all
            flex items-center justify-center gap-2
            ${needsApproval
                        ? 'bg-blue-600 hover:bg-blue-500 border-blue-800 text-white'
                        : 'bg-green-500 hover:bg-green-500 border-green-800 text-white'
                    }
            ${(isPending || isConfirming || (isTestMode && isTestProcessing) || playerCount >= 6 || isLimitReached) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                {getButtonText()}
            </button>

            {/* Refund Button (Only visible when stuck) */}
            {canRefund && (
                <button
                    onClick={handleRefund}
                    disabled={isPending || isConfirming}
                    className="w-full max-w-sm py-2 px-4 uppercase font-bold text-xs tracking-widest bg-red-600 hover:bg-red-500 border-b-4 border-red-800 active:border-b-0 active:mt-1 text-white transition-all flex items-center justify-center gap-2"
                >
                    ⚠️ Game Stuck? Refund & Reset ⚠️
                </button>
            )}

            {error && <p className="text-red-500 text-[10px] text-center max-w-xs">{error.message.split('\n')[0]}</p>}

            {/* Tailwind Animation Config needs to be added for 'animate-wiggle' */}
            <style jsx global>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }
          .animate-wiggle {
            animation: wiggle 1s infinite ease-in-out;
          }
        `}</style>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareUrl={shareUrl}
            />
        </div>
    );
}
