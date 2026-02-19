'use client';

import { useAccount, useReadContract, useBalance, useEnsName, useEnsAvatar } from 'wagmi';
import { formatUnits } from 'viem';
import PotOfGoldABI from '@/abi/PotOfGold.json';
import { type Abi } from 'viem';
import RulesModal from './RulesModal';

import { CONTRACT_ADDRESS, USDC_ADDRESS, ACTIVE_CHAIN, IS_MAINNET } from '@/config';

import { useFarcasterUser } from '@/hooks/useFarcasterUser';

export default function PlayerHeader() {
    const { address, isConnected } = useAccount();

    // Identity
    const { data: ensName } = useEnsName({ address, chainId: 1 });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
    const { user: fcUser } = useFarcasterUser(address);

    // Stats: Consecutive Losses
    const { data: consecutiveLosses } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'consecutiveLosses',
        args: address ? [address] : undefined,
    });

    // Fetch current MegaPot round
    const { data: megaPotRound } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'megaPotRound',
    });

    // Fetch user tickets for current round
    const { data: userTickets } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: PotOfGoldABI.abi as Abi,
        functionName: 'tickets',
        args: megaPotRound !== undefined && address ? [megaPotRound, address] : undefined,
    });

    // Balance: USDC
    const { data: usdcBalance } = useBalance({
        address: address,
        token: USDC_ADDRESS,
        chainId: ACTIVE_CHAIN.id,
    });

    // if (!isConnected) return null;

    return (
        <div className="w-full bg-zinc-900 border-b-2 border-zinc-800 py-3 px-4 sticky top-0 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-row items-center justify-between gap-2 md:gap-6">

                {/* Identity */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-11 md:h-11 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-600 shrink-0">
                        {fcUser?.pfp_url ? (
                            <img src={fcUser.pfp_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : ensAvatar ? (
                            <img src={ensAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px]">
                                {isConnected ? '👾' : '👤'}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold text-[11px] md:text-sm tracking-wide leading-tight">
                            {isConnected
                                ? (fcUser ? `@${fcUser.username}` : (ensName || (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Player')))
                                : 'Guest'
                            }
                        </span>
                        <span className="text-[8px] md:text-[10px] text-zinc-400 font-mono tracking-tight leading-tight">
                            {isConnected ? (IS_MAINNET ? 'BASE' : 'BASE SEPOLIA') : 'DISCONNECTED'}
                        </span>
                    </div>
                </div>

                {/* Stats & Balance */}
                <div className="flex items-center gap-3 md:gap-6 font-mono text-white">
                    {/* Tickets */}
                    <div className="flex flex-col items-center border-r border-zinc-700 pr-3 md:pr-6">
                        <span className="text-zinc-500 text-[8px] md:text-[10px] uppercase tracking-wider leading-none mb-1.5">Tickets</span>
                        <div className="flex items-center gap-1.5 text-yellow-400 font-bold leading-none text-xs md:text-base" title="MegaPot Tickets">
                            <span>🎟️</span>
                            <span>{userTickets ? userTickets.toString() : '0'}</span>
                        </div>
                    </div>

                    {/* Streak */}
                    <div className="flex flex-col items-end">
                        <span className="text-zinc-500 text-[8px] md:text-[10px] uppercase opacity-80 leading-none mb-1.5">Streak</span>
                        <span className="text-white font-bold text-xs md:text-base leading-none">
                            {consecutiveLosses ? Number(consecutiveLosses) : 0} 💔
                        </span>
                    </div>

                    <div className="w-px h-6 md:h-9 bg-zinc-700"></div>

                    {/* Balance */}
                    <div className="flex flex-col items-end">
                        <span className="text-zinc-500 text-[8px] md:text-[10px] uppercase opacity-80 leading-none mb-1.5">Balance</span>
                        <span className="text-money-green font-bold text-xs md:text-base leading-none">
                            {usdcBalance ? Number(formatUnits(usdcBalance.value, usdcBalance.decimals)).toFixed(2) : '0.00'} $
                        </span>
                    </div>

                    <div className="w-px h-6 md:h-9 bg-zinc-700 mx-1 md:mx-3"></div>

                    {/* Rules */}
                    <RulesModal />
                </div>
            </div>
        </div>
    );
}
