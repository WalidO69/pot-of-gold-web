'use client';

import { useState, useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { formatUnits, parseAbiItem } from 'viem';
import { type Abi } from 'viem';
import PotOfGoldABI from '@/abi/PotOfGold.json';
import { useFarcasterUsers } from '@/hooks/useFarcasterUser';

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000';

interface Winner {
    address: string;
    amount: string;
    txHash: string;
    timestamp?: number;
}

export default function WinnersHistory() {
    const [winners, setWinners] = useState<Winner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient();

    // Fetch past winners
    useEffect(() => {
        const fetchHistory = async () => {
            if (!publicClient) return;
            if (CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
                setIsLoading(false);
                return;
            }
            try {
                const logs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESS,
                    event: parseAbiItem('event WinnerSelected(address indexed winner, uint256 amountWon, uint256 devFee, uint256 megaPotContribution)'),
                    fromBlock: BigInt(37800000),
                    toBlock: 'latest'
                });

                // Sort by block number descending (newest first)
                const sortedLogs = logs.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber)).slice(0, 10);

                const formattedWinners = sortedLogs.map(log => ({
                    address: log.args.winner as string,
                    amount: formatUnits(log.args.amountWon as bigint, 6),
                    txHash: log.transactionHash
                }));

                setWinners(formattedWinners);
            } catch (error) {
                console.error('Error fetching winners history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [publicClient]);

    // Listen for new winners
    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        eventName: 'WinnerSelected',
        onLogs(logs) {
            const newWinners = logs.map((log: any) => ({
                address: log.args.winner as string,
                amount: formatUnits(log.args.amountWon as bigint, 6),
                txHash: log.transactionHash as string
            }));
            setWinners(prev => [...newWinners, ...prev].slice(0, 10));
        },
    });

    const winnerAddresses = winners.map(w => w.address);
    const { data: farcasterUsers } = useFarcasterUsers(winnerAddresses);

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mt-8 text-center text-zinc-500 text-xs animate-pulse">
                Loading History...
            </div>
        );
    }

    if (winners.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mt-12 mb-8">
            <h2 className="text-xl md:text-2xl text-yellow-500 text-center mb-6 font-bold uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,1)] flex items-center justify-center gap-3">
                <span className="text-2xl">📜</span> HISTORY
            </h2>

            <div className="bg-zinc-900 border-4 border-zinc-700 p-1 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-sm">
                        <thead className="bg-zinc-800 text-zinc-400 border-b-2 border-zinc-700">
                            <tr>
                                <th className="p-3 text-center">🏆 Winner</th>
                                <th className="p-3 text-right">Amount</th>
                                <th className="p-3 text-center">Provably Fair 🎲</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {winners.map((winner, index) => {
                                const fcUser = farcasterUsers?.[winner.address.toLowerCase()];
                                const displayName = fcUser ? `@${fcUser.username}` : `${winner.address.slice(0, 6)}...${winner.address.slice(-4)}`;
                                const avatarUrl = fcUser?.pfp_url || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${winner.address}`;

                                return (
                                    <tr key={winner.txHash + index} className="hover:bg-zinc-800/50 transition-colors">
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="w-6 h-6 rounded bg-zinc-800 border border-white/10"
                                                />
                                                <span className="text-white">
                                                    {displayName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right text-money-green font-bold">
                                            {Number(winner.amount).toFixed(2)} $
                                        </td>
                                        <td className="p-3 text-center">
                                            <a
                                                href={`https://sepolia.basescan.org/tx/${winner.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-lg hover:scale-110 transition-transform inline-block"
                                                title="Verified by Chainlink VRF. Click to view on-chain proof."
                                            >
                                                ✅
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
