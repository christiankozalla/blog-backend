export declare function authenticationHandler(cookies: Record<string, string>[]): Promise<{
    isValid: boolean;
    email: string;
} | {
    isValid: boolean;
    email: undefined;
}>;
