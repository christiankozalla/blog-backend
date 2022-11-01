declare function encrypt(text: string): {
    iv: string;
    content: string;
};
declare function decrypt(hash: {
    iv: string;
    content: string;
}): string;
export { decrypt, encrypt };
