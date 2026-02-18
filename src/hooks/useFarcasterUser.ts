import { useQuery } from '@tanstack/react-query';

export interface FarcasterUser {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    follower_count: number;
    following_count: number;
    verifications: string[];
    profile: {
        bio: {
            text: string;
        }
    }
}

interface NeynarUserResponse {
    [address: string]: FarcasterUser[];
}

export function useFarcasterUsers(addresses: string[]) {
    return useQuery({
        queryKey: ['farcasterUsers', addresses.sort().join(',')],
        queryFn: async () => {
            if (!addresses.length) return {};

            const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
            if (!apiKey) {
                console.warn('NEXT_PUBLIC_NEYNAR_API_KEY is missing');
                return {};
            }

            // efficient dedup
            const uniqueAddresses = Array.from(new Set(addresses.filter(a => a))).join(',');
            if (!uniqueAddresses) return {};

            try {
                const response = await fetch(
                    `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${uniqueAddresses}`,
                    {
                        headers: {
                            'accept': 'application/json',
                            'api_key': apiKey
                        }
                    }
                );

                if (!response.ok) {
                    console.error('Failed to fetch Farcaster users', response.statusText);
                    return {};
                }

                const data = await response.json();
                // Neynar returns { [address]: [user, ...] }
                // We want to flatten this to { [address]: user }
                const userMap: Record<string, FarcasterUser> = {};
                Object.entries(data).forEach(([addr, users]) => {
                    if (Array.isArray(users) && users.length > 0) {
                        userMap[addr.toLowerCase()] = users[0] as FarcasterUser;
                    }
                });
                return userMap;
            } catch (error) {
                console.error('Error fetching Farcaster users:', error);
                return {};
            }
        },
        enabled: addresses.length > 0,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useFarcasterUser(address: string | undefined | null) {
    const { data } = useFarcasterUsers(address ? [address] : []);
    return {
        user: address ? data?.[address.toLowerCase()] : undefined,
        isLoading: !data && !!address
    };
}
