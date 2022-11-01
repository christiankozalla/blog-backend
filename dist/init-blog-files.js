var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
export const initBlogFileSystem = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogDataDir = join(process.cwd(), "data", "blog");
        let createDir = yield mkdir(blogDataDir, { recursive: true });
        console.log(`created 'blog' ${createDir === undefined && "successfully"}`);
        createDir = yield mkdir(join(blogDataDir, "drafts"), {
            recursive: true,
        });
        console.log(`created 'drafts' ${createDir === undefined && "successfully"}`);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        else
            console.error(err);
    }
});
