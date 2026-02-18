'use client';

import { useEnsName } from 'wagmi';
import { formatIdentity } from '../utils/formatIdentity';

// Mock Data Type
interface PlayerStep {
    address: string;
    wins: number;
    totalGames: number;
    totalEarnings: number;
    losingStreak: number;
}

// Mock Data - Removed for production
const MOCK_LEADERBOARD: PlayerStep[] = [];

function LeaderboardRow({ player, rank }: { player: PlayerStep; rank: number }) {
    // In a real app, useEnsName would fetch from mainnet for these addresses
    const { data: ensName } = useEnsName({ address: player.address as `0x${string}`, chainId: 1 });

    const isHighRoller = player.totalEarnings > 50;
    const isBadLuck = player.losingStreak >= 3;

    // Determine color based on earnings
    let earningsColor = 'text-white';
    if (player.totalEarnings > 0) earningsColor = 'text-green-500';
    if (player.totalEarnings < 0) earningsColor = 'text-red-500';

    return (
        <tr className="border-b border-green-900/50 hover:bg-green-900/20 transition-colors font-mono text-xs md:text-sm">
            <td className="p-4 text-center text-yellow-400">#{rank}</td>
            <td className="p-4">
                <span className="text-green-300 mr-2">
                    {formatIdentity(player.address, ensName)}
                </span>
                {isHighRoller && <span title="High Roller">🍀</span>}
                {isBadLuck && <span title="Losing Streak">💔</span>}
            </td>
            <td className="p-4 text-center text-blue-300">{player.wins}</td>
            <td className={`p-4 text-right ${earningsColor}`}>{player.totalEarnings} $</td>
        </tr>
    );
}

export default function Leaderboard() {
    return (
        <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col gap-8">
            {/* MegaPot Info Box */}
            <div className="bg-zinc-900 border-2 border-yellow-400 p-4 rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.3)] text-center">
                <div className="flex items-center justify-center gap-4 mb-2 animate-pulse">
                    <img src="/images/slot-icon.png" alt="777" className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain" />
                    <h3 className="text-yellow-400 font-pixel text-lg md:text-xl">MEGAPOT</h3>
                    <img src="/images/slot-icon.png" alt="777" className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain transform scale-x-[-1]" />
                </div>
                <p className="text-white font-pixel text-[10px] md:text-sm leading-relaxed">
                    - Pot grows by 0.5$ every round<br />
                    - One winner takes the whole stash every week<br />
                    - The MORE you play, the MORE tickets you get<br />
                    - MegaDraw is every sunday at 10pm UTC !
                </p>
            </div>

            <div className="bg-black border-4 border-yellow-400 p-2 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <div className="bg-yellow-900/20 p-4 border-b-4 border-yellow-400 mb-2">
                    <h2 className="text-center text-yellow-400 text-xl md:text-2xl uppercase tracking-widest animate-pulse">
                        TOP PLAYERS
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-yellow-600 border-b-2 border-yellow-600 text-[10px] md:text-xs uppercase">
                                <th className="p-2 text-center">Rank</th>
                                <th className="p-2">Player</th>
                                <th className="p-2 text-center">Wins</th>
                                <th className="p-2 text-right">Won</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_LEADERBOARD.length > 0 &&
                                [...MOCK_LEADERBOARD]
                                    .sort((a, b) => b.wins - a.wins)
                                    .map((player, index) => (
                                        <LeaderboardRow key={player.address} player={player} rank={index + 1} />
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-center text-[10px] text-yellow-800 font-mono">
                    INSERT COIN TO JOIN LEADERBOARD
                </div>
            </div>
        </div>
    );
}
