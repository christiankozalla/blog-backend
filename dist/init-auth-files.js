var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
export const initAuthFileSystem = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataDir = join(process.cwd(), "data", "cms");
        const createDir = yield mkdir(dataDir, { recursive: true });
        console.log(`created ${createDir === undefined && "successfully"}`);
        const content = yield readdir(dataDir);
        const requiredFiles = ["sessions.txt", "users.txt"];
        for (let file of requiredFiles) {
            if (content.includes(file)) {
                console.log(`${file} already exits. Ok.`);
            }
            else {
                console.log(`${file} does not exist, but needed for DB. Creating ${file}...`);
                yield writeFile(join(dataDir, file), "", { encoding: "utf8" });
            }
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        else
            console.error(err);
    }
});
