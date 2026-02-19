'use client';

import { useState, useEffect } from 'react';
import { parseAbiItem, formatUnits } from 'viem';
import { CONTRACT_ADDRESS, EXPLORER_URL, DEPLOYMENT_BLOCK } from '@/config';
import { publicClient } from '@/utils/viem';

type Round = {
    winner: string;
    amount: string;
    txHash: string;
    blockNumber: bigint;
};

export default function LastRoundsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && rounds.length === 0) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            // Get logs for "WinnerSelected"
            // event WinnerSelected(address indexed winner, uint256 amountWon);
            const logs = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem('event WinnerSelected(address indexed winner, uint256 amountWon)'),
                fromBlock: DEPLOYMENT_BLOCK,
                toBlock: 'latest'
            });

            // Parse logs (reverse to show newest first)
            const parsedRounds = logs.reverse().slice(0, 10).map(log => ({
                winner: log.args.winner!,
                amount: formatUnits(log.args.amountWon!, 6),
                txHash: log.transactionHash!,
                blockNumber: log.blockNumber!
            }));

            setRounds(parsedRounds);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full text-white text-xs bg-black border border-yellow-500 rounded-md px-4 py-3 hover:bg-zinc-900 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.2)] font-bold uppercase tracking-wider"
                title="View past rounds"
            >
                Last Rounds 📜
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 shrink-0">
                    <span>📜</span> Last Rounds
                </h2>

                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : rounds.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 italic">No rounds played yet.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs text-zinc-500 uppercase tracking-wider font-mono sticky top-0 bg-zinc-900 pb-2">
                                <tr>
                                    <th className="pb-3 pl-2">Winner</th>
                                    <th className="pb-3 text-right">Prize</th>
                                    <th className="pb-3 text-center">Proof</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rounds.map((round) => (
                                    <tr key={round.txHash} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-2 font-mono text-zinc-300">
                                            {`${round.winner.slice(0, 6)}...${round.winner.slice(-4)}`}
                                        </td>
                                        <td className="py-3 text-right font-bold text-money-green">
                                            {Number(round.amount).toFixed(2)} $
                                        </td>
                                        <td className="py-3 text-center">
                                            <a
                                                href={`${EXPLORER_URL}/tx/${round.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                                title="View Transaction"
                                            >
                                                ↗️
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end shrink-0">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
