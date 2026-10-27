import express from "express";
import cors from "cors";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scrypt = promisify(scryptCallback);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(usersFile, "utf8");
  } catch {
    await writeFile(usersFile, "[]\n", "utf8");
  }
}

async function readUsers() {
  await ensureStore();
  return JSON.parse(await readFile(usersFile, "utf8"));
}

async function writeUsers(users) {
  await ensureStore();
  await writeFile(usersFile, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

function safeUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const derived = await scrypt(password, salt, 64);
  return { salt, passwordHash: derived.toString("hex") };
}

async function verifyPassword(password, user) {
  const derived = await scrypt(password, user.salt, 64);
  const expected = Buffer.from(user.passwordHash, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Nexora API is running" });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!cleanName || !cleanEmail || typeof password !== "string" || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields." });
    }
    if (cleanName.length > 80) {
      return res.status(400).json({ success: false, message: "Name must be 80 characters or fewer." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }
    if (password.length > 128) {
      return res.status(400).json({ success: false, message: "Password must be 128 characters or fewer." });
    }

    const users = await readUsers();
    if (users.some((user) => user.email === cleanEmail)) {
      return res.status(409).json({ success: false, message: "An account with this email already exists. Please sign in." });
    }

    const { salt, passwordHash } = await hashPassword(password);
    const user = {
      id: randomBytes(12).toString("hex"),
      name: cleanName,
      email: cleanEmail,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await writeUsers(users);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: randomBytes(24).toString("hex"),
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!cleanEmail || typeof password !== "string" || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const users = await readUsers();
    const user = users.find((item) => item.email === cleanEmail);
    if (!user || !(await verifyPassword(password, user))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.json({
      success: true,
      message: "Welcome back!",
      token: randomBytes(24).toString("hex"),
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

app.listen(PORT, async () => {
  await ensureStore();
  console.log(`Nexora backend running at http://localhost:${PORT}`);
});
