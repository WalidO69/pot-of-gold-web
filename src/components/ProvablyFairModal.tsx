'use client';

import { useState } from 'react';

import { CONTRACT_ADDRESS, EXPLORER_URL } from '@/config';

export default function ProvablyFairModal() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full text-white text-xs bg-black border border-yellow-500 rounded-md px-4 py-3 hover:bg-zinc-900 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.2)] font-bold uppercase tracking-wider"
                title="Learn how this game is fair"
            >
                Provably Fair 🎲
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-5 max-w-sm w-full shadow-2xl relative overflow-y-auto max-h-[85vh]">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span>🎲</span> Provably Fair
                </h2>

                <div className="space-y-3 text-[11px] text-zinc-300 leading-relaxed">
                    <p>
                        Pot of Gold uses <strong className="text-white font-bold">Chainlink VRF</strong> to determine winners.
                    </p>

                    <ul className="list-disc pl-4 space-y-1.5 marker:text-yellow-500">
                        <li>
                            <strong className="text-white">Random:</strong> Selected using cryptographically secure random numbers.
                        </li>
                        <li>
                            <strong className="text-white">Verifiable:</strong> Generation is verified on-chain. Tamper-proof.
                        </li>
                        <li>
                            <strong className="text-white">Transparent:</strong> Every result is recorded on the Base blockchain.
                        </li>
                    </ul>

                    <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 mt-3">
                        <p className="text-[9px] text-zinc-500 mb-1 uppercase tracking-wider">Contract</p>
                        <a
                            href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-blue-400 hover:text-blue-300 break-all flex items-center gap-1 group text-[10px]"
                        >
                            {CONTRACT_ADDRESS.slice(0, 18)}...{CONTRACT_ADDRESS.slice(-10)}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2.5 h-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1.5 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors text-xs"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
