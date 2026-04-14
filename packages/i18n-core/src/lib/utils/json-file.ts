import fs from "node:fs";
import path from "node:path";

export function loadJsonFile<T = unknown>(pathname: string): T | undefined {
  try {
    if (!fs.existsSync(pathname)) {
      return undefined;
    }
    const raw = fs.readFileSync(pathname, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function saveJsonFile(pathname: string, data: unknown): void {
  const dir = path.dirname(pathname);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  fs.writeFileSync(pathname, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.chmodSync(pathname, 0o600);
}

export function jsonFileExists(pathname: string): boolean {
  try {
    return fs.existsSync(pathname);
  } catch {
    return false;
  }
}

export function deleteJsonFile(pathname: string): boolean {
  try {
    if (fs.existsSync(pathname)) {
      fs.unlinkSync(pathname);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
