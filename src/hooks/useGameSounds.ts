import { Howl } from 'howler';
import { useCallback } from 'react';

export function useGameSounds() {
    const playCoin = useCallback(() => {
        const sound = new Howl({ src: ['/sounds/coin.mp3'] });
        sound.play();
    }, []);

    const playBubble = useCallback(() => {
        const sound = new Howl({ src: ['/sounds/bubble.mp3'] });
        sound.play();
    }, []);

    const playWin = useCallback(() => {
        const sound = new Howl({ src: ['/sounds/win.mp3'] });
        sound.play();
    }, []);

    const playFail = useCallback(() => {
        const sound = new Howl({ src: ['/sounds/fail.mp3'] });
        sound.play();
    }, []);

    return { playCoin, playBubble, playWin, playFail };
}
