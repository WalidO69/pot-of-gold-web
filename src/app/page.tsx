'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import GamePot from '@/components/GamePot';
import Leaderboard from '@/components/Leaderboard';
import NotificationManager from '@/components/NotificationManager';
import MegaPotDisplay from '@/components/MegaPotDisplay';
import PlayerHeader from '@/components/PlayerHeader';
import WinnersHistory from '@/components/WinnersHistory';
import ProvablyFairModal from '@/components/ProvablyFairModal';
import LastRoundsModal from '@/components/LastRoundsModal';
import { useTestMode } from '@/context/TestModeContext';
import DailyShareButton from '@/components/DailyShareButton';

export default function Home() {
  const { isConnected } = useAccount();
  const { isTestMode, toggleTestMode, actions } = useTestMode();

  return (
    <main className="min-h-screen flex flex-col items-center justify-start relative overflow-y-auto">
      <PlayerHeader />
      <NotificationManager />

      <div className="p-4 w-full flex flex-col items-center">

        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Overlay for readability */}
          <img
            src="/images/background.png"
            alt="Background"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-4 py-6">
          {/* Header / Title */}
          <div className="text-center w-full">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-400 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase tracking-tighter whitespace-nowrap"
            >
              Pot of Gold
            </h1>
            <div className="text-purple-300 mt-4 flex flex-col items-center gap-1 uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(26,26,26,1)] font-bold">
              <p
                className="text-white text-xl md:text-2xl mb-2"
                style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
              >
                ENTER THE POT TO WIN 5$
              </p>
              <p className="text-sm md:text-xl">6 PLAYERS BET 1$</p>
              <p className="text-[10px] md:text-sm">1 PLAYER WINS 5$</p>
              <p className="text-[10px] md:text-sm">0.5$ GOES TO THE MEGAPOT</p>
            </div>
          </div>

          {/* Mega Pot HUD */}
          <MegaPotDisplay />

          {/* Game Area & Leaderboard - Visible to everyone */}
          <div className="w-full flex flex-col items-center gap-6">
            <GamePot />

            <div className="flex flex-col items-center gap-4">
              {!isConnected && <p className="text-white text-xs blink">INSERT COIN TO JOIN LEADERBOARD</p>}
              <ConnectButton showBalance={false} accountStatus="full" chainStatus="icon" />
            </div>

            {/* Daily Share Button - Added Here */}
            <DailyShareButton />

            <Leaderboard />
            <WinnersHistory />
          </div>

          {/* Footer */}
          <div className="w-full grid grid-cols-2 gap-4 px-2 sm:px-0">
            <ProvablyFairModal />
            <LastRoundsModal />
          </div>

          <div className="text-center text-[10px] font-mono flex flex-col items-center gap-2">
            <p className="text-white drop-shadow-[1px_1px_0_rgba(0,0,0,1)] uppercase tracking-wider" style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>
              Powered by Base & Chainlink VRF
            </p>
          </div>
        </div>
      </div>
    </main >
  );
}
