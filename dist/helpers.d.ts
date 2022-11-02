import type { Post } from "./types.js";
export declare type Cookie = Record<string, string>;
export declare function checkExistingUser(email: string, list: string): boolean;
export declare function getSession(email: string, list: string): string | undefined;
export declare function getUser(email: string, list: string): string | undefined;
export declare function purgeList(email: string, list: string[]): string[];
export declare function base64(string: string): string;
export declare function csv(...strings: string[]): string;
export declare function hasSemi(...strings: string[]): boolean;
export declare function createSession(emailBase64: string, expiryDateMs: number): string;
export declare function createExpiryDate(): number;
export declare function hasSuperUser(users: string): boolean;
export declare function parseCookies(cookies: string): Cookie[];
export declare function emptyPost(): Post;
export declare function slugify(title: string): string;
