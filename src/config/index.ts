import { base, baseSepolia } from 'viem/chains';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pot-of-gold-web.vercel.app';
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000';

// Network specific configuration
export const IS_MAINNET = process.env.NEXT_PUBLIC_CHAIN === 'base';
export const ACTIVE_CHAIN = IS_MAINNET ? base : baseSepolia;

export const USDC_ADDRESS = IS_MAINNET
    ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    : '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

export const EXPLORER_URL = ACTIVE_CHAIN.blockExplorers.default.url;

export const DEPLOYMENT_BLOCK = IS_MAINNET ? BigInt(0) : BigInt(37800000);
// Note: User will need to provide the actual deployment block for Mainnet to optimize log queries
