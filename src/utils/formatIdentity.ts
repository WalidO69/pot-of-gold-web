export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// In a real app, this would be a hook wrapping useEnsName
export function formatIdentity(address: string, ensName?: string | null): string {
    if (ensName) return ensName;
    return formatAddress(address);
}
