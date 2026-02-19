import { createPublicClient, http } from 'viem';
import { ACTIVE_CHAIN } from '../config';

export const publicClient = createPublicClient({
    chain: ACTIVE_CHAIN,
    transport: http(),
});
