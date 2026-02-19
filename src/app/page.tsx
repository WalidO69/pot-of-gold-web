'use client';

import GamePot from '@/components/GamePot';
import Leaderboard from '@/components/Leaderboard';
import NotificationManager from '@/components/NotificationManager';
import MegaPotDisplay from '@/components/MegaPotDisplay';
import PlayerHeader from '@/components/PlayerHeader';
import WinnersHistory from '@/components/WinnersHistory';
import ProvablyFairModal from '@/components/ProvablyFairModal';
import LastRoundsModal from '@/components/LastRoundsModal';
import DailyShareButton from '@/components/DailyShareButton';
import AddMiniAppButton from '@/components/AddMiniAppButton';

export default function Home() {

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

        <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-5 py-6">
          {/* Header / Title */}
          <div className="text-center w-full mb-2">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-400 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase tracking-tighter whitespace-nowrap"
            >
              Pot of Gold
            </h1>

            <div className="mt-6 flex flex-col items-center gap-4">
              {/* Main Prize Badge */}
              <div className="bg-yellow-500/10 border-2 border-yellow-500/50 px-6 py-2 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <p
                  className="text-yellow-400 text-xl md:text-2xl font-black uppercase tracking-tight"
                  style={{ textShadow: '2px 2px 0 #000' }}
                >
                  🏆 WIN 5$
                </p>
              </div>

              {/* Info Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                <div className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">💸 1$ Entry</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">👥 6 Players</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">🥇 1 Takes it all</span>
                </div>
              </div>

              {/* Ticket Mention */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] text-purple-300 font-bold uppercase tracking-[0.15em] drop-shadow-sm">
                  Every play gets a <span className="text-white">MegaPot Ticket</span> 🎟️
                </p>
                <p className="text-[10px] text-white uppercase tracking-widest opacity-80 font-bold">
                  0.5$ of each bet fuels the weekly draw
                </p>
              </div>
            </div>
          </div>

          {/* Mega Pot HUD */}
          <MegaPotDisplay />


          {/* GamePot & Action */}
          <div className="w-full flex flex-col items-center gap-5">
            <GamePot />



            {/* Daily Share Button */}
            <DailyShareButton />

            {/* Leaderboard & History */}
            <Leaderboard />
            <WinnersHistory />
          </div>

          {/* Footer */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 px-2 sm:px-0">
            <AddMiniAppButton />
            <ProvablyFairModal />
            <LastRoundsModal />
          </div>

          <div className="text-center text-[10px] font-mono flex flex-col items-center gap-3">
            <p className="text-white opacity-40 uppercase tracking-widest" style={{ textShadow: '1px 1px 0 #000' }}>
              Powered by Base & Chainlink VRF
            </p>
          </div>
        </div>
      </div>
    </main >
  );
}
