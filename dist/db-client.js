var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { appendFile, readdir, readFile, unlink, writeFile, } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { purgeList } from "./helpers";
const sessionsPath = join(process.cwd(), "data", "cms", "sessions.txt");
const blogDir = join(process.cwd(), "data", "blog");
export function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield readFile(join(process.cwd(), "data", "cms", "users.txt"), { encoding: "utf8" });
    });
}
export function readSessions() {
    return __awaiter(this, void 0, void 0, function* () {
        const strings = yield readFile(sessionsPath, { encoding: "utf8" });
        const sessions = strings.split("\n");
        return sessions;
    });
}
export function login(session) {
    return appendFile(sessionsPath, "\n" + session + "\n", { encoding: "utf8" });
}
// Delete all sessions with base64-encoded email
export function logout(emailBase64, sessions) {
    return writeFile(sessionsPath, purgeList(emailBase64, sessions).join("\n"), {
        encoding: "utf8",
    });
}
// // Display a list of published and draft posts in the dashboard
export function listPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const [published, drafts] = yield allPosts();
        // please forgive me...
        published.splice(published.indexOf("drafts"), 1);
        const posts = Array.from(new Set([...published, ...drafts])).map((file) => {
            return {
                fileName: file,
                slug: file.slice(0, file.indexOf(".md")),
                hasPublished: published.includes(file),
                hasDraft: drafts.includes(file),
            };
        });
        return posts;
    });
}
export function allPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all([
            readdir(blogDir),
            readdir(join(blogDir, "drafts")),
        ]);
    });
}
export function getPost(id, draft = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = `${id}.md`;
        const [posts, drafts] = yield allPosts();
        const response = { post: null, error: null, hasAlternative: "" };
        if (Array.isArray(posts) && posts.includes(fileName)) {
            const raw = yield readFile(join(blogDir, fileName), {
                encoding: "utf8",
            });
            response.post = parseFrontmatterAndMarkdown(raw);
        }
        if (Array.isArray(drafts) && drafts.includes(fileName)) {
            if (draft) {
                // alternative is the published post
                response.hasAlternative = `/admin/${id}`;
                const raw = yield readFile(join(blogDir, "drafts", fileName), {
                    encoding: "utf8",
                });
                response.post = parseFrontmatterAndMarkdown(raw);
            }
            else {
                response.hasAlternative = `/admin/${id}?draft`;
            }
        }
        if (response.post === null) {
            response.error = new Error(`${fileName} - Blog post not found.`);
        }
        return response;
    });
}
export function writePost(id, post, isDraft) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = `${id}.md`;
        let destination;
        if (isDraft) {
            destination = join(blogDir, "drafts", fileName);
        }
        else {
            destination = join(blogDir, fileName);
            try {
                const draftUrl = join(blogDir, "drafts", fileName);
                // and delete the draft before publishing
                yield unlink(draftUrl);
            }
            catch (err) {
                if (err instanceof Error) {
                    // file does not exist - log and move on
                    console.log(err.message);
                }
                else {
                    console.log(err);
                }
            }
        }
        return writeFile(destination, serializePost(post), { encoding: "utf8" });
    });
}
function parseFrontmatterAndMarkdown(raw) {
    const regex = /---\n([\S\s]*?)\n---/g;
    const result = regex.exec(raw);
    if (result === null) {
        return null;
    }
    else {
        const lines = result[1].split("\n").filter(Boolean).map((line) => {
            const [key, value] = line.split(": ");
            return `"${key}":${value}`;
        });
        const strigified = `{${lines.join(",")}}`;
        const frontMatter = JSON.parse(strigified);
        const html = marked.parse(raw.slice(raw.indexOf("---\n\n") + 5));
        const markdown = raw.slice(raw.indexOf("---\n\n") + 5);
        return {
            html,
            markdown,
            frontMatter,
        };
    }
}
function serializePost(post) {
    const yamlFrontMatter = `---\n${Object.entries(post.frontMatter).map(([key, value]) => `${key}: "${value}"`)
        .join("\n")}\n---\n\n`;
    return yamlFrontMatter + post.markdown;
}
