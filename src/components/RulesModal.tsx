'use client';

import { useState } from 'react';

export default function RulesModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-zinc-800 text-yellow-400 border-2 border-zinc-600 rounded hover:bg-zinc-700 transition-colors font-bold text-xs md:text-sm"
                title="How to Play"
            >
                ?
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div
                        className="bg-zinc-900 border-4 border-yellow-400 p-6 max-w-md w-full relative shadow-[0_0_50px_rgba(255,215,0,0.2)] animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold text-xl leading-none p-2"
                        >
                            X
                        </button>

                        <h2 className="text-yellow-400 text-xl font-bold mb-6 text-center uppercase tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            How to Play
                        </h2>

                        <div className="space-y-4 text-xs md:text-sm font-mono text-white">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🪙</span>
                                <div>
                                    <strong className="text-yellow-400 block mb-1">ENTRY FEE</strong>
                                    <p className="text-gray-300">1 $ per ticket.</p>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        (0.5 $ if you have a 5+ losing streak!)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🎲</span>
                                <div>
                                    <strong className="text-green-400 block mb-1">GAME LOOP</strong>
                                    <p className="text-gray-300">Pot triggers automatically when 6 players join.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🏆</span>
                                <div>
                                    <strong className="text-yellow-400 block mb-1">WINNER TAKES</strong>
                                    <p className="text-white text-lg font-bold">5 $</p>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        The other 1 $ is split: 0.5 Dev / 0.5 MegaPot.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🎰</span>
                                <div>
                                    <strong className="text-purple-400 block mb-1">MEGAPOT</strong>
                                    <p className="text-gray-300">
                                        Each game grows the MegaPot. One lucky winner takes it all every Sunday!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t-2 border-zinc-800 text-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-yellow-400 text-black font-bold py-2 px-6 hover:bg-yellow-300 transition-colors uppercase text-sm border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
                            >
                                GOT IT!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
