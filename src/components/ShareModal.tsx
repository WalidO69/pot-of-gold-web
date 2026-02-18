'use client';

import { useEffect, useState } from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for transition
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-[#1A1A1A] border-4 border-[#855DCD] p-6 max-w-sm w-full shadow-[0_0_20px_rgba(133,93,205,0.4)] transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
                {/* Decorative Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#855DCD]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#855DCD]" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#855DCD]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#855DCD]" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white/60 hover:text-white hover:scale-110 transition-all"
                >
                    ✕
                </button>

                <div className="text-center space-y-4">
                    <div className="text-3xl animate-bounce">🍀</div>

                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                        You're in the Pot!
                    </h2>

                    <p className="text-white/80 text-sm leading-relaxed">
                        You've successfully joined the round. <br />
                        Invite others to join and fill the pot faster!
                    </p>

                    <div className="pt-4">
                        <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="
                                group relative inline-flex items-center justify-center gap-2
                                w-full py-3 px-6 
                                bg-[#855DCD] hover:bg-[#966de3]
                                text-white font-bold uppercase tracking-widest
                                border-b-4 border-[#5a3a91] active:border-b-0 active:translate-y-1
                                transition-all
                            "
                        >
                            <span>Share</span>
                            <span className="group-hover:rotate-12 transition-transform">📢</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
