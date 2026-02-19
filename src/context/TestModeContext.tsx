'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatUnits, parseUnits } from 'viem';

// Types
interface TestState {
    address: string;
    balance: bigint; // USDC (6 decimals)
    allowance: bigint;
    players: string[];
    megaPot: bigint; // USDC (6 decimals)
    consecutiveLosses: bigint;
    entryFee: bigint;
    discountedFee: bigint;
}

export type TestGameEvent =
    | { type: 'PLAYER_ENTERED', player: string }
    | { type: 'WINNER_SELECTED', winner: string, amount: bigint }
    | null;

interface TestContextType {
    isTestMode: boolean;
    toggleTestMode: () => void;
    state: TestState;
    actions: {
        joinPot: () => Promise<void>;
        approve: () => Promise<void>;
        addFakePlayer: () => void;
        resetGame: () => void;
    };
    lastEvent: TestGameEvent;
    isProcessing: boolean;
}

const DEFAULT_STATE: TestState = {
    address: '0xabc123...test',
    balance: parseUnits('100', 6), // Start with 100 fake USDC
    allowance: BigInt(0),
    players: [],
    megaPot: parseUnits('25.50', 6),
    consecutiveLosses: BigInt(0),
    entryFee: parseUnits('1', 6),
    discountedFee: parseUnits('0.5', 6),
};

const TestModeContext = createContext<TestContextType | undefined>(undefined);

export function TestModeProvider({ children }: { children: ReactNode }) {
    const [isTestMode, setIsTestMode] = useState(false);
    const [state, setState] = useState<TestState>(DEFAULT_STATE);
    const [lastEvent, setLastEvent] = useState<TestGameEvent>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Persist Test Mode preference
    // Persist Test Mode preference - DISABLED FOR PRODUCTION
    // useEffect(() => {
    //     const stored = localStorage.getItem('isTestMode');
    //     if (stored) setIsTestMode(JSON.parse(stored));
    // }, []);

    const toggleTestMode = () => {
        const newValue = !isTestMode;
        setIsTestMode(newValue);
        localStorage.setItem('isTestMode', JSON.stringify(newValue));
        if (newValue) {
            // Reset state on enter
            setState(DEFAULT_STATE);
        }
    };

    // Actions
    const approve = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake network delay
        setState(prev => ({ ...prev, allowance: parseUnits('1000', 6) }));
        setIsProcessing(false);
    };

    const joinPot = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Logic
        const hasDiscount = state.consecutiveLosses >= BigInt(5);
        const fee = hasDiscount ? state.discountedFee : state.entryFee;

        if (state.balance < fee) {
            alert("Not enough fake USDC!");
            setIsProcessing(false);
            return;
        }

        setState(prev => {
            const newPlayers = [...prev.players, prev.address];
            const newBalance = prev.balance - fee;

            setLastEvent({ type: 'PLAYER_ENTERED', player: prev.address });

            // Check for winner if we hit 6 players
            if (newPlayers.length >= 6) {
                setTimeout(() => resolveRound(newPlayers), 2000);
            }

            return {
                ...prev,
                players: newPlayers,
                balance: newBalance
            };
        });

        setIsProcessing(false);
    };

    const resolveRound = (currentPlayers: string[]) => {
        const winnerIndex = Math.floor(Math.random() * 6);
        const winner = currentPlayers[winnerIndex];
        const isUserWinner = winner === state.address;

        console.log("Winner:", winner);
        // alert handled by event listener now
        // alert(`Winner Selected: ${winner} \n${isUserWinner ? "YOU WON 5 USDC! 🏆" : "You lost. 😢"}`);

        setLastEvent({ type: 'WINNER_SELECTED', winner, amount: parseUnits('5', 6) });

        setState(prev => ({
            ...prev,
            players: [],
            balance: isUserWinner ? prev.balance + parseUnits('5', 6) : prev.balance,
            consecutiveLosses: isUserWinner ? BigInt(0) : prev.consecutiveLosses + BigInt(1),
            megaPot: prev.megaPot + parseUnits('0.5', 6) // Add to mega pot
        }));
    };

    const addFakePlayer = () => {
        if (state.players.length >= 6) return;

        const fakeAddress = `0xBot...${Math.floor(Math.random() * 9999)}`;
        setState(prev => {
            const newPlayers = [...prev.players, fakeAddress];

            setLastEvent({ type: 'PLAYER_ENTERED', player: fakeAddress });

            // Check for winner if we hit 6 players
            if (newPlayers.length >= 6) {
                setTimeout(() => resolveRound(newPlayers), 2000);
            }
            return { ...prev, players: newPlayers };
        });
    };

    const resetGame = () => {
        setState(DEFAULT_STATE);
    };

    return (
        <TestModeContext.Provider value={{ isTestMode, toggleTestMode, state, actions: { joinPot, approve, addFakePlayer, resetGame }, lastEvent, isProcessing }}>
            {children}
        </TestModeContext.Provider>
    );
}

export const useTestMode = () => {
    const context = useContext(TestModeContext);
    if (!context) throw new Error('useTestMode must be used within a TestModeProvider');
    return context;
};
