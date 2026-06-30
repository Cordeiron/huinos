import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./server/db";
import { UserRole } from "../src/types";

const JWT_SECRET = process.env.JWT_SECRET || "huios-production-secret-key-2026-987241";

const app = express();

// Middlewares essenciais para a Vercel Serverless
app.use(cors());
app.use(express.json());

// --- AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de autenticação não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.user = decoded;
    next();
  });
};

// --- HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- AUTH ROUTES ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await db.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { passwordHash, ...userProfile } = user;

    await db.logAction(user.name, user.email, user.role, "Fez login no sistema");

    res.json({
      token,
      user: userProfile
    });
  } catch (err: any) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req: any, res: any) => {
  try {
    const user = await db.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { passwordHash, ...userProfile } = user;
    res.json(userProfile);
  } catch (err: any) {
    console.error("Erro no auth/me:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// --- USER MANAGEMENT (RBAC SERVER-SIDE PROTECTION) ---
app.get("/api/users", authenticateToken, async (req: any, res: any) => {
  try {
    const { id, role } = req.user;
    const allUsers = await db.getUsers();

    const profiles = allUsers.map(({ passwordHash, ...profile }) => profile);

    if (role === UserRole.ADMIN) {
      return res.json(profiles);
    } else if (role === UserRole.LEADER) {
      const filtered = profiles.filter(
        u => u.id === id || (u.createdBy === id && u.role === UserRole.MEMBER)
      );
      return res.json(filtered);
    } else {
      const filtered = profiles.filter(u => u.id === id);
      return res.json(filtered);
    }
  } catch (err: any) {
    console.error("Erro ao obter usuários:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.post("/api/users", authenticateToken, async (req: any, res: any) => {
  try {
    const { id: creatorId, role: creatorRole, name: creatorName, email: creatorEmail } = req.user;
    const { name, email, password, role, phone, birthDate, cellGroup } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Este email já está cadastrado" });
    }

    let finalRole = role;
    if (creatorRole === UserRole.LEADER) {
      finalRole = UserRole.MEMBER;
    } else if (creatorRole !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Acesso negado: permissão insuficiente" });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || "",
      birthDate: birthDate || "",
      cellGroup: cellGroup || "",
      role: finalRole,
      avatarUrl: "",
      points: 0,
      medals: { gold: 0, silver: 0, bronze: 0 },
      achievements: [],
      createdBy: creatorId,
      createdAt: new Date().toISOString()
    };

    const createdUser = await db.createUser(newUser);

    await db.logAction(
      creatorName,
      creatorEmail,
      creatorRole,
      `Criou usuário: ${name} (${finalRole})`
    );

    const { passwordHash: _, ...userProfile } = createdUser;
    res.status(201).json(userProfile);
  } catch (err: any) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Nota: Adicione aqui o fechamento da rota PUT que foi cortada na sua mensagem se achar necessário

// OBRIGATÓRIO PARA A VERCEL: Exporte a instância do express
export default app;
