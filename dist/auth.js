var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile } from "node:fs/promises";
import { join } from "path";
import { getSession } from "./helpers";
export function authenticationHandler(cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if user has a cookie
        const cookie = cookies.find((cookie) => Object.prototype.hasOwnProperty.call(cookie, process.env.SESSION_NAME || "DEFAULT_SESSION"));
        if (cookie) {
            const sessionData = yield validateSession(cookie[process.env.SESSION_NAME || "DEFAULT_SESSION"]);
            return sessionData;
        }
        else {
            return { isValid: false, email: undefined };
        }
    });
}
function validateSession(cookie) {
    return __awaiter(this, void 0, void 0, function* () {
        const [email, token, expires] = decodeURIComponent(cookie).split(":::");
        const now = Date.now();
        if (now > Number(expires))
            return { isValid: false, email };
        const sessions = yield readFile(join(process.cwd(), "data", "cms", "sessions.txt"), { encoding: "utf8" });
        const session = getSession(email, sessions);
        if (!session)
            return { isValid: false, email };
        return { isValid: session.split(":::")[1] === token, email };
    });
}
