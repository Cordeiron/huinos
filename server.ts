import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./server/db";
import { UserRole } from "./src/types";

const JWT_SECRET = process.env.JWT_SECRET || "huios-production-secret-key-2026-987241";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads
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

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Remove passwordHash from return object
      const { passwordHash, ...userProfile } = user;

      // Log action
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
  
  // 1. Get Users
  app.get("/api/users", authenticateToken, async (req: any, res: any) => {
    try {
      const { id, role } = req.user;
      const allUsers = await db.getUsers();

      // Map profiles to omit password hashes
      const profiles = allUsers.map(({ passwordHash, ...profile }) => profile);

      if (role === UserRole.ADMIN) {
        // Admin sees everyone
        return res.json(profiles);
      } else if (role === UserRole.LEADER) {
        // Leader sees all members + themselves
        const filtered = profiles.filter(
          u => u.id === id || u.role === UserRole.MEMBER
        );
        return res.json(filtered);
      } else {
        // Member can only see themselves
        const filtered = profiles.filter(u => u.id === id);
        return res.json(filtered);
      }
    } catch (err: any) {
      console.error("Erro ao obter usuários:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // 2. Create User
  app.post("/api/users", authenticateToken, async (req: any, res: any) => {
    try {
      const { id: creatorId, role: creatorRole, name: creatorName, email: creatorEmail } = req.user;
      const { name, email, password, role, phone, birthDate, cellGroup } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }
      
      // Check if email already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Este email já está cadastrado" });
      }

      // Role-Based Validation rules
      let finalRole = role;
      if (creatorRole === UserRole.LEADER) {
        // Leaders can only create Member accounts
        finalRole = UserRole.MEMBER;
      } else if (creatorRole !== UserRole.ADMIN) {
        // Members cannot create users
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

  // 3. Edit User
  app.put("/api/users/:id", authenticateToken, async (req: any, res: any) => {
    try {
      const { id: editorId, role: editorRole, name: editorName, email: editorEmail } = req.user;
      const { id: targetId } = req.params;
      const { name, email, password, role, phone, birthDate, cellGroup, points, medals } = req.body;

      const targetUser = await db.getUserById(targetId);

      if (!targetUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const updates: any = {};

      // Authorization Guard
      if (editorRole === UserRole.ADMIN) {
        // Admin has complete power
        if (role && Object.values(UserRole).includes(role)) {
          updates.role = role;
        }
      } else if (editorRole === UserRole.LEADER) {
        // Leader can only edit members created by themselves
        if (targetUser.createdBy !== editorId || targetUser.role !== UserRole.MEMBER) {
          return res.status(403).json({ error: "Acesso negado: Você só pode editar membros criados por você" });
        }
        // Leader cannot change access roles
        if (role && role !== UserRole.MEMBER) {
          return res.status(403).json({ error: "Acesso negado: Líderes não podem alterar níveis de acesso" });
        }
      } else {
        // Members can only edit their own personal profiles (excluding points, medals, roles, etc)
        if (editorId !== targetId) {
          return res.status(403).json({ error: "Acesso negado: Você só pode editar seu próprio perfil" });
        }
      }

      // Update permissible fields
      if (name) updates.name = name;
      if (email) updates.email = email.toLowerCase();
      if (phone !== undefined) updates.phone = phone;
      if (birthDate !== undefined) updates.birthDate = birthDate;
      if (cellGroup !== undefined) updates.cellGroup = cellGroup;

      if (password) {
        const salt = bcrypt.genSaltSync(10);
        updates.passwordHash = bcrypt.hashSync(password, salt);
      }

      // Score / medals updates (Admins and Leaders only, Leaders only for their own members)
      if (editorRole === UserRole.ADMIN || (editorRole === UserRole.LEADER && targetUser.createdBy === editorId)) {
        if (points !== undefined) updates.points = Number(points);
        if (medals) {
          updates.medals = {
            gold: Number(medals.gold ?? targetUser.medals.gold),
            silver: Number(medals.silver ?? targetUser.medals.silver),
            bronze: Number(medals.bronze ?? targetUser.medals.bronze)
          };
        }
      }

      const updatedUser = await db.updateUser(targetId, updates);

      await db.logAction(
        editorName,
        editorEmail,
        editorRole,
        `Editou o perfil do usuário: ${updatedUser.name}`
      );

      const { passwordHash: _, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // 4. Delete User
  app.delete("/api/users/:id", authenticateToken, async (req: any, res: any) => {
    try {
      const { id: editorId, role: editorRole, name: editorName, email: editorEmail } = req.user;
      const { id: targetId } = req.params;

      if (editorId === targetId) {
        return res.status(400).json({ error: "Você não pode excluir a sua própria conta" });
      }

      const targetUser = await db.getUserById(targetId);

      if (!targetUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Authorization Guard
      if (editorRole !== UserRole.ADMIN) {
        if (editorRole === UserRole.LEADER) {
          // Leader can only delete members created by themselves
          if (targetUser.createdBy !== editorId || targetUser.role !== UserRole.MEMBER) {
            return res.status(403).json({ error: "Acesso negado: você só pode excluir membros criados por você" });
          }
        } else {
          return res.status(403).json({ error: "Acesso negado: permissão insuficiente" });
        }
      }

      await db.deleteUser(targetId);

      await db.logAction(
        editorName,
        editorEmail,
        editorRole,
        `Excluiu o usuário: ${targetUser.name} (${targetUser.role})`
      );

      res.json({ success: true, message: "Usuário removido com sucesso" });
    } catch (err: any) {
      console.error("Erro ao deletar usuário:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // --- ANNOUNCEMENTS ---
  app.get("/api/announcements", async (req, res) => {
    try {
      const list = await db.getAnnouncements();
      res.json(list);
    } catch (err: any) {
      console.error("Erro ao buscar comunicados:", err);
      res.status(500).json({ error: "Erro ao buscar comunicados" });
    }
  });

  app.post("/api/announcements", authenticateToken, async (req: any, res: any) => {
    try {
      const { role, name } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Permissão insuficiente" });
      }

      const { title, content, category, important } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const newAnn = {
        id: "ann-" + Math.random().toString(36).substr(2, 9),
        title,
        content,
        category,
        important: !!important,
        date: new Date().toISOString().split("T")[0],
        createdBy: name
      };

      const created = await db.createAnnouncement(newAnn);
      
      // Add a system notification
      const newNotif = {
        id: "not-" + Math.random().toString(36).substr(2, 9),
        title: important ? "⚠️ AVISO IMPORTANTE!" : "Novo Aviso publicado",
        message: title,
        date: new Date().toISOString().split("T")[0],
        type: "aviso",
        read: false
      };
      await db.createNotification(newNotif);

      res.status(201).json(created);
    } catch (err: any) {
      console.error("Erro ao criar comunicado:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.delete("/api/announcements/:id", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Permissão insuficiente" });
      }

      await db.deleteAnnouncement(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao deletar comunicado:", err);
      res.status(500).json({ error: "Erro ao deletar comunicado" });
    }
  });

  // --- NEWS / BLOG ARTICLES ---
  app.get("/api/news", async (req, res) => {
    try {
      const list = await db.getNews();
      res.json(list);
    } catch (err: any) {
      console.error("Erro ao buscar notícias:", err);
      res.status(500).json({ error: "Erro ao buscar notícias" });
    }
  });

  app.post("/api/news", authenticateToken, async (req: any, res: any) => {
    try {
      const { role, name } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Permissão insuficiente" });
      }

      const { title, subtitle, content, coverImage, category } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const newNews = {
        id: "news-" + Math.random().toString(36).substr(2, 9),
        title,
        subtitle: subtitle || "",
        content,
        coverImage: coverImage || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
        category,
        author: name,
        authorRole: role === UserRole.ADMIN ? "Administrador" : "Líder",
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        likedBy: [],
        comments: []
      };

      const created = await db.createNews(newNews);

      // Notification
      const newNotif = {
        id: "not-" + Math.random().toString(36).substr(2, 9),
        title: "Nova Notícia publicada",
        message: title,
        date: new Date().toISOString().split("T")[0],
        type: "noticia",
        read: false
      };
      await db.createNotification(newNotif);

      res.status(201).json(created);
    } catch (err: any) {
      console.error("Erro ao criar notícia:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.post("/api/news/:id/like", authenticateToken, async (req: any, res: any) => {
    try {
      const { id: userId } = req.user;
      const article = await db.getNewsById(req.params.id);

      if (!article) {
        return res.status(404).json({ error: "Artigo não encontrado" });
      }

      const likedBy = article.likedBy || [];
      const likedIndex = likedBy.indexOf(userId);
      if (likedIndex === -1) {
        likedBy.push(userId);
      } else {
        likedBy.splice(likedIndex, 1);
      }

      const updated = await db.updateNews(req.params.id, {
        likedBy,
        likes: likedBy.length
      });

      res.json(updated);
    } catch (err: any) {
      console.error("Erro ao curtir notícia:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.post("/api/news/:id/comment", authenticateToken, async (req: any, res: any) => {
    try {
      const { name: userName } = req.user;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "O conteúdo do comentário é obrigatório" });
      }

      const article = await db.getNewsById(req.params.id);

      if (!article) {
        return res.status(404).json({ error: "Artigo não encontrado" });
      }

      const comments = article.comments || [];
      const newComment = {
        id: "c-" + Math.random().toString(36).substr(2, 9),
        userName,
        content,
        date: new Date().toISOString().split("T")[0]
      };

      comments.push(newComment);
      const updated = await db.updateNews(req.params.id, { comments });
      res.status(201).json(updated);
    } catch (err: any) {
      console.error("Erro ao comentar notícia:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.delete("/api/news/:id", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Permissão insuficiente" });
      }

      await db.deleteNews(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao deletar notícia:", err);
      res.status(500).json({ error: "Erro ao deletar notícia" });
    }
  });

  // --- EVENTS ---
  app.get("/api/events", async (req, res) => {
    try {
      const list = await db.getEvents();
      res.json(list);
    } catch (err: any) {
      console.error("Erro ao buscar eventos:", err);
      res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  });

  app.post("/api/events", authenticateToken, async (req: any, res: any) => {
    try {
      const { role, name } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Permissão insuficiente" });
      }

      const { title, description, date, time, address, category, imageUrl } = req.body;
      if (!title || !description || !date || !time || !address || !category) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const newEvent = {
        id: "event-" + Math.random().toString(36).substr(2, 9),
        title,
        description,
        date,
        time,
        address,
        category,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
        responsible: name
      };

      const created = await db.createEvent(newEvent);

      // Notification
      const newNotif = {
        id: "not-" + Math.random().toString(36).substr(2, 9),
        title: "Novo Evento agendado",
        message: `${title} - ${date} às ${time}`,
        date: new Date().toISOString().split("T")[0],
        type: "evento",
        read: false
      };
      await db.createNotification(newNotif);

      res.status(201).json(created);
    } catch (err: any) {
      console.error("Erro ao criar evento:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.delete("/api/events/:id", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Permissão insuficiente" });
      }

      await db.deleteEvent(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao deletar evento:", err);
      res.status(500).json({ error: "Erro ao deletar evento" });
    }
  });

  // --- PRAYER REQUESTS ---
  app.get("/api/prayer-requests", authenticateToken, async (req, res) => {
    try {
      const list = await db.getPrayers();
      res.json(list);
    } catch (err: any) {
      console.error("Erro ao buscar orações:", err);
      res.status(500).json({ error: "Erro ao buscar orações" });
    }
  });

  app.post("/api/prayer-requests", authenticateToken, async (req: any, res: any) => {
    try {
      const { name: userName } = req.user;
      const { request, isAnonymous } = req.body;

      if (!request) {
        return res.status(400).json({ error: "O pedido de oração é obrigatório" });
      }

      const newRequest = {
        id: "prayer-" + Math.random().toString(36).substr(2, 9),
        name: isAnonymous ? "Anônimo" : userName,
        request,
        isAnonymous: !!isAnonymous,
        date: new Date().toISOString().split("T")[0],
        status: "Novo",
        prayedCount: 0,
        prayedBy: []
      };

      const created = await db.createPrayer(newRequest);
      res.status(201).json(created);
    } catch (err: any) {
      console.error("Erro ao criar oração:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.post("/api/prayer-requests/:id/pray", authenticateToken, async (req: any, res: any) => {
    try {
      const { id: userId } = req.user;
      const prayer = await db.getPrayerById(req.params.id);

      if (!prayer) {
        return res.status(404).json({ error: "Pedido de oração não encontrado" });
      }

      const prayedBy = prayer.prayedBy || [];
      const prayedIndex = prayedBy.indexOf(userId);
      if (prayedIndex === -1) {
        prayedBy.push(userId);
      } else {
        prayedBy.splice(prayedIndex, 1);
      }

      const updated = await db.updatePrayer(req.params.id, {
        prayedBy,
        prayedCount: prayedBy.length
      });

      res.json(updated);
    } catch (err: any) {
      console.error("Erro ao curtir oração:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.put("/api/prayer-requests/:id/response", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Apenas administradores podem responder a pedidos" });
      }

      const { status, adminResponse } = req.body;
      const prayer = await db.getPrayerById(req.params.id);

      if (!prayer) {
        return res.status(404).json({ error: "Pedido de oração não encontrado" });
      }

      const updates: any = {};
      if (status) updates.status = status;
      if (adminResponse !== undefined) updates.adminResponse = adminResponse;

      const updated = await db.updatePrayer(req.params.id, updates);
      res.json(updated);
    } catch (err: any) {
      console.error("Erro ao moderar oração:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // --- SUGGESTIONS ---
  app.get("/api/suggestions", authenticateToken, async (req: any, res: any) => {
    try {
      const { role, email } = req.user;
      const allSuggestions = await db.getSuggestions();

      if (role === UserRole.ADMIN) {
        return res.json(allSuggestions);
      } else {
        // Members/Leaders can only see suggestions they created (by email/name match)
        const filtered = allSuggestions.filter(s => s.email === email);
        return res.json(filtered);
      }
    } catch (err: any) {
      console.error("Erro ao buscar sugestões:", err);
      res.status(500).json({ error: "Erro ao buscar sugestões" });
    }
  });

  app.post("/api/suggestions", authenticateToken, async (req: any, res: any) => {
    try {
      const { name, email } = req.user;
      const { suggestion, category } = req.body;

      if (!suggestion || !category) {
        return res.status(400).json({ error: "Sugestão e categoria são obrigatórios" });
      }

      const newSug = {
        id: "sug-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        suggestion,
        category,
        date: new Date().toISOString().split("T")[0],
        status: "Pendente"
      };

      const created = await db.createSuggestion(newSug);
      res.status(201).json(created);
    } catch (err: any) {
      console.error("Erro ao criar sugestão:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.put("/api/suggestions/:id/status", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Apenas administradores podem gerenciar sugestões" });
      }

      const { status, adminResponse } = req.body;
      const sug = await db.getSuggestionById(req.params.id);

      if (!sug) {
        return res.status(404).json({ error: "Sugestão não encontrada" });
      }

      const updates: any = {};
      if (status) updates.status = status;
      if (adminResponse !== undefined) updates.adminResponse = adminResponse;

      const updated = await db.updateSuggestion(req.params.id, updates);
      res.json(updated);
    } catch (err: any) {
      console.error("Erro ao moderar sugestão:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // --- CHALLENGES ---
  app.get("/api/challenges", authenticateToken, async (req, res) => {
    try {
      const list = await db.getChallenges();
      res.json(list);
    } catch (err: any) {
      console.error("Erro ao buscar desafios:", err);
      res.status(500).json({ error: "Erro ao buscar desafios" });
    }
  });

  app.post("/api/challenges", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Permissão insuficiente" });
      }

      const { title, description, imageUrl, startDate, endDate, prize, maxWinners, points, active } = req.body;
      if (!title || !description || !startDate || !endDate || !points) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const newChallenge = {
        id: "chal-" + Math.random().toString(36).substr(2, 9),
        title,
        description,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&q=80&w=600",
        startDate,
        endDate,
        prize: prize || "Nenhum",
        maxWinners: Number(maxWinners || 5),
        points: Number(points),
        active: active !== undefined ? !!active : true
      };

      const created = await db.createChallenge(newChallenge);

      // Notification
      const newNotif = {
        id: "not-" + Math.random().toString(36).substr(2, 9),
        title: "🏆 Novo Desafio Ativo!",
        message: `${title} - Participe e ganhe ${points} pontos!`,
        date: new Date().toISOString().split("T")[0],
        type: "desafio",
        read: false
      };
      await db.createNotification(newNotif);

      res.status(201).json(created);
    } catch (err: any) {
      console.error("Erro ao criar desafio:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // --- CHALLENGE SUBMISSIONS ---
  app.get("/api/submissions", authenticateToken, async (req: any, res: any) => {
    try {
      const { role, id: userId } = req.user;
      const allSubmissions = await db.getSubmissions();

      if (role === UserRole.ADMIN || role === UserRole.LEADER) {
        // Admin or Leader sees all submissions
        return res.json(allSubmissions);
      } else {
        // Members only see their own submissions
        const filtered = allSubmissions.filter(s => s.userId === userId);
        return res.json(filtered);
      }
    } catch (err: any) {
      console.error("Erro ao buscar comprovações:", err);
      res.status(500).json({ error: "Erro ao buscar comprovações" });
    }
  });

  app.post("/api/submissions", authenticateToken, async (req: any, res: any) => {
    try {
      const { id: userId, name: userName, role } = req.user;
      if (role !== UserRole.MEMBER && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Apenas membros cadastrados participam das gincanas" });
      }

      const { challengeId, text, fileUrl, mediaType } = req.body;
      let { challengeTitle } = req.body;

      if (!challengeId) {
        return res.status(400).json({ error: "ID do desafio é obrigatório" });
      }

      // Retrieve challenge to get title if not provided by client
      const challenge = await db.getChallengeById(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Desafio não encontrado" });
      }
      if (!challengeTitle) {
        challengeTitle = challenge.title;
      }

      // Check if member already has a submission for this challenge
      const allSubmissions = await db.getSubmissions();
      const existingSub = allSubmissions.find(s => s.challengeId === challengeId && s.userId === userId);
      if (existingSub) {
        return res.status(400).json({ error: "Você já enviou uma resposta para este desafio!" });
      }

      const newSub = {
        id: "sub-" + Math.random().toString(36).substr(2, 9),
        challengeId,
        challengeTitle,
        userId,
        userName,
        userAvatar: "",
        date: new Date().toISOString(), // Save full ISO timestamp to display date and time
        text: text || "",
        fileUrl: fileUrl || "",
        mediaType: mediaType || "text",
        status: "Pendente de Aprovação"
      };

      const created = await db.createSubmission(newSub);
      res.status(201).json(created);
    } catch (err: any) {
      console.error("Erro ao enviar comprovação:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.put("/api/submissions/:id/review", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
        return res.status(403).json({ error: "Apenas Administradores ou Líderes podem revisar envios" });
      }

      const { status, feedback } = req.body;
      if (!status || !["Aprovado", "Reprovado", "Rejeitado"].includes(status)) {
        return res.status(400).json({ error: "Status inválido. Deve ser Aprovado, Reprovado ou Rejeitado" });
      }

      const submission = await db.getSubmissionById(req.params.id);

      if (!submission) {
        return res.status(404).json({ error: "Envio de desafio não encontrado" });
      }

      const updated = await db.updateSubmission(req.params.id, {
        status,
        feedback: feedback || ""
      });

      // If approved, give points to user!
      if (status === "Aprovado") {
        const user = await db.getUserById(submission.userId);
        const challenge = await db.getChallengeById(submission.challengeId);
        if (user && challenge) {
          const currentPoints = (user.points || 0) + challenge.points;
          const medals = { ...user.medals };
          
          // Add a medal occasionally or systematically
          if (currentPoints >= 400 && medals.gold === 0) {
            medals.gold += 1;
          } else if (currentPoints >= 200 && medals.silver === 0) {
            medals.silver += 1;
          } else {
            medals.bronze += 1;
          }

          await db.updateUser(user.id, {
            points: currentPoints,
            medals
          });
        }
      }

      res.json(updated);
    } catch (err: any) {
      console.error("Erro ao analisar comprovação:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // --- NOTIFICATIONS ---
  app.get("/api/notifications", authenticateToken, async (req, res) => {
    try {
      const list = await db.getNotifications();
      res.json(list);
    } catch (err: any) {
      console.error("Erro ao buscar notificações:", err);
      res.status(500).json({ error: "Erro ao buscar notificações" });
    }
  });

  app.post("/api/notifications/read-all", authenticateToken, async (req, res) => {
    try {
      await db.markAllNotificationsRead();
      res.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao limpar notificações:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // --- ABOUT PAGE (LEADERS & GALLERY) ---
  app.get("/api/about", async (req, res) => {
    try {
      const p = path.join(process.cwd(), "server/about_data.json");
      if (fs.existsSync(p)) {
        const data = fs.readFileSync(p, "utf-8");
        return res.json(JSON.parse(data));
      }
      return res.status(404).json({ error: "Dados do Sobre não encontrados" });
    } catch (err) {
      console.error("Erro ao carregar sobre:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.put("/api/about", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      const { leaders, gallery } = req.body;
      const p = path.join(process.cwd(), "server/about_data.json");

      let currentData = { leaders: [], gallery: [] };
      if (fs.existsSync(p)) {
        currentData = JSON.parse(fs.readFileSync(p, "utf-8"));
      }

      if (leaders !== undefined) {
        if (role !== UserRole.ADMIN) {
          return res.status(403).json({ error: "Apenas Administradores podem alterar as informações de liderança" });
        }
        currentData.leaders = leaders;
      }

      if (gallery !== undefined) {
        if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
          return res.status(403).json({ error: "Apenas Administradores ou Líderes podem gerenciar a galeria" });
        }
        currentData.gallery = gallery;
      }

      fs.writeFileSync(p, JSON.stringify(currentData, null, 2), "utf-8");
      res.json(currentData);
    } catch (err) {
      console.error("Erro ao atualizar sobre:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // --- ACCESS LOGS ---
  app.get("/api/logs", authenticateToken, async (req: any, res: any) => {
    try {
      const { role } = req.user;
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Acesso restrito ao Administrador" });
      }
      const logs = await db.getLogs();
      res.json(logs);
    } catch (err: any) {
      console.error("Erro ao buscar logs de auditoria:", err);
      res.status(500).json({ error: "Erro ao buscar logs de auditoria" });
    }
  });

  // --- VITE DEV OR STATIC MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Erro fatal ao iniciar o servidor backend:", err);
});
