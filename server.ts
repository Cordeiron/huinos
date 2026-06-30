import express from "express";
import path from "path";
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
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const database = db.get();
    const user = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());

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
    db.logAction(user.name, user.email, user.role, "Fez login no sistema");

    res.json({
      token,
      user: userProfile
    });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res: any) => {
    const database = db.get();
    const user = database.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { passwordHash, ...userProfile } = user;
    res.json(userProfile);
  });

  // --- USER MANAGEMENT (RBAC SEVERE-SIDE PROTECTION) ---
  
  // 1. Get Users
  app.get("/api/users", authenticateToken, (req: any, res: any) => {
    const { id, role } = req.user;
    const database = db.get();

    // Map profiles to omit password hashes
    const profiles = database.users.map(({ passwordHash, ...profile }) => profile);

    if (role === UserRole.ADMIN) {
      // Admin sees everyone
      return res.json(profiles);
    } else if (role === UserRole.LEADER) {
      // Leader sees members they created + themselves
      const filtered = profiles.filter(
        u => u.id === id || (u.createdBy === id && u.role === UserRole.MEMBER)
      );
      return res.json(filtered);
    } else {
      // Member can only see themselves
      const filtered = profiles.filter(u => u.id === id);
      return res.json(filtered);
    }
  });

  // 2. Create User
  app.post("/api/users", authenticateToken, (req: any, res: any) => {
    const { id: creatorId, role: creatorRole, name: creatorName, email: creatorEmail } = req.user;
    const { name, email, password, role, phone, birthDate, cellGroup } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const database = db.get();
    
    // Check if email already exists
    const emailExists = database.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
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

    database.users.push(newUser);
    db.save();

    db.logAction(
      creatorName,
      creatorEmail,
      creatorRole,
      `Criou usuário: ${name} (${finalRole})`
    );

    const { passwordHash: _, ...userProfile } = newUser;
    res.status(201).json(userProfile);
  });

  // 3. Edit User
  app.put("/api/users/:id", authenticateToken, (req: any, res: any) => {
    const { id: editorId, role: editorRole, name: editorName, email: editorEmail } = req.user;
    const { id: targetId } = req.params;
    const { name, email, password, role, phone, birthDate, cellGroup, points, medals } = req.body;

    const database = db.get();
    const userIndex = database.users.findIndex(u => u.id === targetId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const targetUser = database.users[userIndex];

    // Authorization Guard
    if (editorRole === UserRole.ADMIN) {
      // Admin has complete power
      if (role && Object.values(UserRole).includes(role)) {
        targetUser.role = role;
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
    if (name) targetUser.name = name;
    if (email) targetUser.email = email.toLowerCase();
    if (phone !== undefined) targetUser.phone = phone;
    if (birthDate !== undefined) targetUser.birthDate = birthDate;
    if (cellGroup !== undefined) targetUser.cellGroup = cellGroup;

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      targetUser.passwordHash = bcrypt.hashSync(password, salt);
    }

    // Score / medals updates (Admins and Leaders only, Leaders only for their own members)
    if (editorRole === UserRole.ADMIN || (editorRole === UserRole.LEADER && targetUser.createdBy === editorId)) {
      if (points !== undefined) targetUser.points = Number(points);
      if (medals) {
        targetUser.medals = {
          gold: Number(medals.gold ?? targetUser.medals.gold),
          silver: Number(medals.silver ?? targetUser.medals.silver),
          bronze: Number(medals.bronze ?? targetUser.medals.bronze)
        };
      }
    }

    db.save();

    db.logAction(
      editorName,
      editorEmail,
      editorRole,
      `Editou o perfil do usuário: ${targetUser.name}`
    );

    const { passwordHash: _, ...userProfile } = targetUser;
    res.json(userProfile);
  });

  // 4. Delete User
  app.delete("/api/users/:id", authenticateToken, (req: any, res: any) => {
    const { id: editorId, role: editorRole, name: editorName, email: editorEmail } = req.user;
    const { id: targetId } = req.params;

    if (editorId === targetId) {
      return res.status(400).json({ error: "Você não pode excluir a sua própria conta" });
    }

    const database = db.get();
    const userIndex = database.users.findIndex(u => u.id === targetId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const targetUser = database.users[userIndex];

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

    database.users.splice(userIndex, 1);
    db.save();

    db.logAction(
      editorName,
      editorEmail,
      editorRole,
      `Excluiu o usuário: ${targetUser.name} (${targetUser.role})`
    );

    res.json({ success: true, message: "Usuário removido com sucesso" });
  });

  // --- ANNOUNCEMENTS ---
  app.get("/api/announcements", (req, res) => {
    res.json(db.get().announcements);
  });

  app.post("/api/announcements", authenticateToken, (req: any, res: any) => {
    const { role, name } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Permissão insuficiente" });
    }

    const { title, content, category, important } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const database = db.get();
    const newAnn: any = {
      id: "ann-" + Math.random().toString(36).substr(2, 9),
      title,
      content,
      category,
      important: !!important,
      date: new Date().toISOString().split("T")[0],
      createdBy: name
    };

    database.announcements.unshift(newAnn);
    
    // Add a system notification
    const newNotif: any = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: important ? "⚠️ AVISO IMPORTANTE!" : "Novo Aviso publicado",
      message: title,
      date: new Date().toISOString().split("T")[0],
      type: "aviso",
      read: false
    };
    database.notifications.unshift(newNotif);

    db.save();
    res.status(201).json(newAnn);
  });

  app.delete("/api/announcements/:id", authenticateToken, (req: any, res: any) => {
    const { role } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Permissão insuficiente" });
    }

    const database = db.get();
    const index = database.announcements.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Aviso não encontrado" });
    }

    database.announcements.splice(index, 1);
    db.save();
    res.json({ success: true });
  });

  // --- NEWS / BLOG ARTICLES ---
  app.get("/api/news", (req, res) => {
    res.json(db.get().news);
  });

  app.post("/api/news", authenticateToken, (req: any, res: any) => {
    const { role, name } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Permissão insuficiente" });
    }

    const { title, subtitle, content, coverImage, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const database = db.get();
    const newNews: any = {
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

    database.news.unshift(newNews);

    // Notification
    const newNotif: any = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Nova Notícia publicada",
      message: title,
      date: new Date().toISOString().split("T")[0],
      type: "noticia",
      read: false
    };
    database.notifications.unshift(newNotif);

    db.save();
    res.status(201).json(newNews);
  });

  app.post("/api/news/:id/like", authenticateToken, (req: any, res: any) => {
    const { id: userId } = req.user;
    const database = db.get();
    const article = database.news.find(n => n.id === req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    const likedIndex = article.likedBy.indexOf(userId);
    if (likedIndex === -1) {
      article.likedBy.push(userId);
      article.likes += 1;
    } else {
      article.likedBy.splice(likedIndex, 1);
      article.likes = Math.max(0, article.likes - 1);
    }

    db.save();
    res.json(article);
  });

  app.post("/api/news/:id/comment", authenticateToken, (req: any, res: any) => {
    const { name: userName } = req.user;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "O conteúdo do comentário é obrigatório" });
    }

    const database = db.get();
    const article = database.news.find(n => n.id === req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    const newComment = {
      id: "c-" + Math.random().toString(36).substr(2, 9),
      userName,
      content,
      date: new Date().toISOString().split("T")[0]
    };

    article.comments.push(newComment);
    db.save();
    res.status(201).json(article);
  });

  app.delete("/api/news/:id", authenticateToken, (req: any, res: any) => {
    const { role } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Permissão insuficiente" });
    }

    const database = db.get();
    const index = database.news.findIndex(n => n.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    database.news.splice(index, 1);
    db.save();
    res.json({ success: true });
  });

  // --- EVENTS ---
  app.get("/api/events", (req, res) => {
    res.json(db.get().events);
  });

  app.post("/api/events", authenticateToken, (req: any, res: any) => {
    const { role, name } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Permissão insuficiente" });
    }

    const { title, description, date, time, address, category, imageUrl } = req.body;
    if (!title || !description || !date || !time || !address || !category) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const database = db.get();
    const newEvent: any = {
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

    database.events.push(newEvent);

    // Notification
    const newNotif: any = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Novo Evento agendado",
      message: `${title} - ${date} às ${time}`,
      date: new Date().toISOString().split("T")[0],
      type: "evento",
      read: false
    };
    database.notifications.unshift(newNotif);

    db.save();
    res.status(201).json(newEvent);
  });

  app.delete("/api/events/:id", authenticateToken, (req: any, res: any) => {
    const { role } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Permissão insuficiente" });
    }

    const database = db.get();
    const index = database.events.findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    database.events.splice(index, 1);
    db.save();
    res.json({ success: true });
  });

  // --- PRAYER REQUESTS ---
  app.get("/api/prayer-requests", authenticateToken, (req, res) => {
    res.json(db.get().prayerRequests);
  });

  app.post("/api/prayer-requests", authenticateToken, (req: any, res: any) => {
    const { name: userName } = req.user;
    const { request, isAnonymous } = req.body;

    if (!request) {
      return res.status(400).json({ error: "O pedido de oração é obrigatório" });
    }

    const database = db.get();
    const newRequest: any = {
      id: "prayer-" + Math.random().toString(36).substr(2, 9),
      name: isAnonymous ? "Anônimo" : userName,
      request,
      isAnonymous: !!isAnonymous,
      date: new Date().toISOString().split("T")[0],
      status: "Novo",
      prayedCount: 0,
      prayedBy: []
    };

    database.prayerRequests.unshift(newRequest);
    db.save();
    res.status(201).json(newRequest);
  });

  app.post("/api/prayer-requests/:id/pray", authenticateToken, (req: any, res: any) => {
    const { id: userId } = req.user;
    const database = db.get();
    const prayer = database.prayerRequests.find(p => p.id === req.params.id);

    if (!prayer) {
      return res.status(404).json({ error: "Pedido de oração não encontrado" });
    }

    const prayedIndex = prayer.prayedBy.indexOf(userId);
    if (prayedIndex === -1) {
      prayer.prayedBy.push(userId);
      prayer.prayedCount += 1;
    } else {
      prayer.prayedBy.splice(prayedIndex, 1);
      prayer.prayedCount = Math.max(0, prayer.prayedCount - 1);
    }

    db.save();
    res.json(prayer);
  });

  app.put("/api/prayer-requests/:id/response", authenticateToken, (req: any, res: any) => {
    const { role } = req.user;
    if (role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Apenas administradores podem responder a pedidos" });
    }

    const { status, adminResponse } = req.body;
    const database = db.get();
    const prayer = database.prayerRequests.find(p => p.id === req.params.id);

    if (!prayer) {
      return res.status(404).json({ error: "Pedido de oração não encontrado" });
    }

    if (status) prayer.status = status;
    if (adminResponse !== undefined) prayer.adminResponse = adminResponse;

    db.save();
    res.json(prayer);
  });

  // --- SUGGESTIONS ---
  app.get("/api/suggestions", authenticateToken, (req: any, res: any) => {
    const { role, email } = req.user;
    const database = db.get();

    if (role === UserRole.ADMIN) {
      return res.json(database.suggestions);
    } else {
      // Members/Leaders can only see suggestions they created (by email/name match)
      const filtered = database.suggestions.filter(s => s.email === email);
      return res.json(filtered);
    }
  });

  app.post("/api/suggestions", authenticateToken, (req: any, res: any) => {
    const { name, email } = req.user;
    const { suggestion, category } = req.body;

    if (!suggestion || !category) {
      return res.status(400).json({ error: "Sugestão e categoria são obrigatórios" });
    }

    const database = db.get();
    const newSug: any = {
      id: "sug-" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      suggestion,
      category,
      date: new Date().toISOString().split("T")[0],
      status: "Pendente"
    };

    database.suggestions.unshift(newSug);
    db.save();
    res.status(201).json(newSug);
  });

  app.put("/api/suggestions/:id/status", authenticateToken, (req: any, res: any) => {
    const { role } = req.user;
    if (role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Apenas administradores podem gerenciar sugestões" });
    }

    const { status, adminResponse } = req.body;
    const database = db.get();
    const sug = database.suggestions.find(s => s.id === req.params.id);

    if (!sug) {
      return res.status(404).json({ error: "Sugestão não encontrada" });
    }

    if (status) sug.status = status;
    if (adminResponse !== undefined) sug.adminResponse = adminResponse;

    db.save();
    res.json(sug);
  });

  // --- CHALLENGES ---
  app.get("/api/challenges", authenticateToken, (req, res) => {
    res.json(db.get().challenges);
  });

  app.post("/api/challenges", authenticateToken, (req: any, res: any) => {
    const { role } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Permissão insuficiente" });
    }

    const { title, description, imageUrl, startDate, endDate, prize, maxWinners, points, active } = req.body;
    if (!title || !description || !startDate || !endDate || !points) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const database = db.get();
    const newChallenge: any = {
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

    database.challenges.unshift(newChallenge);

    // Notification
    const newNotif: any = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "🏆 Novo Desafio Ativo!",
      message: `${title} - Participe e ganhe ${points} pontos!`,
      date: new Date().toISOString().split("T")[0],
      type: "desafio",
      read: false
    };
    database.notifications.unshift(newNotif);

    db.save();
    res.status(201).json(newChallenge);
  });

  // --- CHALLENGE SUBMISSIONS ---
  app.get("/api/submissions", authenticateToken, (req: any, res: any) => {
    const { role, id: userId } = req.user;
    const database = db.get();

    if (role === UserRole.ADMIN) {
      // Admin sees all submissions
      return res.json(database.submissions);
    } else if (role === UserRole.LEADER) {
      // Leader sees all submissions so they can review them
      return res.json(database.submissions);
    } else {
      // Members only see their own submissions
      const filtered = database.submissions.filter(s => s.userId === userId);
      return res.json(filtered);
    }
  });

  app.post("/api/submissions", authenticateToken, (req: any, res: any) => {
    const { id: userId, name: userName, role } = req.user;
    if (role !== UserRole.MEMBER && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Apenas membros cadastrados participam das gincanas" });
    }

    const { challengeId, challengeTitle, text, fileUrl, mediaType } = req.body;
    if (!challengeId || !challengeTitle) {
      return res.status(400).json({ error: "ID e título do desafio são obrigatórios" });
    }

    const database = db.get();

    // Check if member already has a submission for this challenge
    const existingSub = database.submissions.find(s => s.challengeId === challengeId && s.userId === userId);
    if (existingSub) {
      return res.status(400).json({ error: "Você já enviou uma resposta para este desafio!" });
    }

    const newSub: any = {
      id: "sub-" + Math.random().toString(36).substr(2, 9),
      challengeId,
      challengeTitle,
      userId,
      userName,
      userAvatar: "",
      date: new Date().toISOString().split("T")[0],
      text: text || "",
      fileUrl: fileUrl || "",
      mediaType: mediaType || "text",
      status: "Pendente"
    };

    database.submissions.unshift(newSub);
    db.save();
    res.status(201).json(newSub);
  });

  app.put("/api/submissions/:id/review", authenticateToken, (req: any, res: any) => {
    const { role, name: reviewerName } = req.user;
    if (role !== UserRole.ADMIN && role !== UserRole.LEADER) {
      return res.status(403).json({ error: "Apenas Administradores ou Líderes podem revisar envios" });
    }

    const { status, feedback } = req.body;
    if (!status || !["Aprovado", "Reprovado"].includes(status)) {
      return res.status(400).json({ error: "Status inválido. Deve ser Aprovado ou Reprovado" });
    }

    const database = db.get();
    const submission = database.submissions.find(s => s.id === req.params.id);

    if (!submission) {
      return res.status(404).json({ error: "Envio de desafio não encontrado" });
    }

    submission.status = status;
    submission.feedback = feedback || "";

    // If approved, give points to user!
    if (status === "Aprovado") {
      const user = database.users.find(u => u.id === submission.userId);
      const challenge = database.challenges.find(c => c.id === submission.challengeId);
      if (user && challenge) {
        user.points += challenge.points;
        
        // Add a medal occasionally or systematically
        if (user.points >= 400 && user.medals.gold === 0) {
          user.medals.gold += 1;
        } else if (user.points >= 200 && user.medals.silver === 0) {
          user.medals.silver += 1;
        } else {
          user.medals.bronze += 1;
        }
      }
    }

    db.save();
    res.json(submission);
  });

  // --- NOTIFICATIONS ---
  app.get("/api/notifications", authenticateToken, (req, res) => {
    res.json(db.get().notifications);
  });

  app.post("/api/notifications/read-all", authenticateToken, (req, res) => {
    const database = db.get();
    database.notifications.forEach(n => {
      n.read = true;
    });
    db.save();
    res.json({ success: true });
  });

  // --- ACCESS LOGS ---
  app.get("/api/logs", authenticateToken, (req: any, res: any) => {
    const { role } = req.user;
    if (role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Acesso restrito ao Administrador" });
    }
    res.json(db.get().accessLogs);
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
