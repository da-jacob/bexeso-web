function randomSegment(length: number): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function generateCode(): string {
    return `${randomSegment(3)}-${randomSegment(3)}-${randomSegment(3)}`;
}
