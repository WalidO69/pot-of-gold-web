'use client';

export default function PixelLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
            </span>
        </div>
    );
}

// Alternative: A bouncing coin pixel art animation
export function PixelCoinLoader() {
    return (
        <div className="flex gap-1 items-center justify-center">
            <div className="w-2 h-2 bg-yellow-400 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-yellow-400 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-yellow-400 animate-bounce"></div>
        </div>
    );
}
