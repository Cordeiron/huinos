-- ====================================================================
-- HUIOS SYSTEM - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS access_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS suggestions CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT DEFAULT '',
  birth_date TEXT DEFAULT '',
  cell_group TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'MEMBER',
  avatar_url TEXT DEFAULT '',
  points INTEGER DEFAULT 0,
  medals JSONB DEFAULT '{"gold": 0, "silver": 0, "bronze": 0}'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_by TEXT,
  created_at TEXT NOT NULL
);

-- 2. ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  important BOOLEAN DEFAULT false,
  date TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. NEWS TABLE
CREATE TABLE news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  content TEXT NOT NULL,
  cover_image TEXT DEFAULT '',
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT DEFAULT '',
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  liked_by JSONB DEFAULT '[]'::jsonb, -- Array of user IDs who liked
  comments JSONB DEFAULT '[]'::jsonb, -- Array of comment objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EVENTS TABLE
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  address TEXT NOT NULL,
  map_embed_url TEXT DEFAULT '',
  responsible TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRAYER REQUESTS TABLE
CREATE TABLE prayer_requests (
  id TEXT PRIMARY KEY,
  name TEXT,
  request TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Novo',
  admin_response TEXT DEFAULT '',
  prayed_count INTEGER DEFAULT 0,
  prayed_by JSONB DEFAULT '[]'::jsonb, -- Array of user IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SUGGESTIONS TABLE
CREATE TABLE suggestions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  suggestion TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  admin_response TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CHALLENGES TABLE
CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  prize TEXT DEFAULT 'Nenhum',
  max_winners INTEGER DEFAULT 5,
  points INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. SUBMISSIONS TABLE
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  challenge_title TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT DEFAULT '',
  date TEXT NOT NULL,
  text TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  media_type TEXT DEFAULT 'text',
  status TEXT NOT NULL DEFAULT 'Pendente',
  feedback TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  target_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ACCESS LOGS TABLE
CREATE TABLE access_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ====================================================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ====================================================================

-- Index on users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Index on announcements
CREATE INDEX idx_announcements_important ON announcements(important);
CREATE INDEX idx_announcements_category ON announcements(category);

-- Index on news
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_date ON news(date);

-- Index on events
CREATE INDEX idx_events_date ON events(date);

-- Index on prayer requests
CREATE INDEX idx_prayer_requests_status ON prayer_requests(status);

-- Index on suggestions
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_suggestions_email ON suggestions(email);

-- Index on challenges
CREATE INDEX idx_challenges_active ON challenges(active);

-- Index on submissions
CREATE INDEX idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- Index on notifications
CREATE INDEX idx_notifications_read ON notifications(read);

-- Index on access logs
CREATE INDEX idx_access_logs_timestamp ON access_logs(timestamp);


-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

-- Password hashes are pre-computed using bcryptjs with 10 salt rounds:
-- 'admin280220' -> '$2a$10$wK1Wn.Xv6Fbe8TqVCOHqjuc6Diz6hO9tM7L8b7pUshYnF.KIdG3.e'
-- '123456'      -> '$2a$10$y58fB73Z3zI96gK5P7X7reF7VbeW.mI.9/M5pW7S0HnFzHmWw7D.y'

-- 1. SEED USERS
INSERT INTO users (id, name, email, password_hash, phone, birth_date, cell_group, role, avatar_url, points, medals, achievements, created_by, created_at)
VALUES 
(
  'admin-1', 
  'Nauham', 
  'nauham86@gmail.com', 
  '$2a$10$wK1Wn.Xv6Fbe8TqVCOHqjuc6Diz6hO9tM7L8b7pUshYnF.KIdG3.e', 
  '(11) 99999-9999', 
  '1995-02-28', 
  'Sede', 
  'ADMIN', 
  '', 
  0, 
  '{"gold": 0, "silver": 0, "bronze": 0}'::jsonb, 
  '[]'::jsonb, 
  NULL, 
  '2026-06-30T12:00:00.000Z'
),
(
  'user-1', 
  'Gabriel Santos', 
  'gabriel.santos@huios.com', 
  '$2a$10$y58fB73Z3zI96gK5P7X7reF7VbeW.mI.9/M5pW7S0HnFzHmWw7D.y', 
  '(11) 98765-4321', 
  '2002-05-15', 
  'Célula Koinonia', 
  'ADMIN', 
  '', 
  450, 
  '{"gold": 3, "silver": 2, "bronze": 1}'::jsonb, 
  '[{"id": "ach-1", "title": "Primeiros Passos", "description": "Completou o primeiro desafio", "icon": "Compass", "unlockedAt": "2026-06-10"}, {"id": "ach-2", "title": "Discipulado Fiel", "description": "Leitura diária por 7 dias seguidos", "icon": "BookOpen", "unlockedAt": "2026-06-18"}, {"id": "ach-3", "title": "Evangelista Ativo", "description": "Trouxe 3 amigos para a Célula", "icon": "Users", "unlockedAt": "2026-06-25"}]'::jsonb, 
  'admin-1', 
  '2026-06-30T12:00:00.000Z'
),
(
  'user-2', 
  'Beatriz Oliveira', 
  'beatriz.oliveira@gmail.com', 
  '$2a$10$y58fB73Z3zI96gK5P7X7reF7VbeW.mI.9/M5pW7S0HnFzHmWw7D.y', 
  '(11) 99123-4567', 
  '2004-09-22', 
  'Célula Emanuel', 
  'LEADER', 
  '', 
  380, 
  '{"gold": 2, "silver": 3, "bronze": 0}'::jsonb, 
  '[{"id": "ach-1", "title": "Primeiros Passos", "description": "Completou o primeiro desafio", "icon": "Compass", "unlockedAt": "2026-06-11"}, {"id": "ach-2", "title": "Discipulado Fiel", "description": "Leitura diária por 7 dias seguidos", "icon": "BookOpen", "unlockedAt": "2026-06-15"}]'::jsonb, 
  'admin-1', 
  '2026-06-30T12:00:00.000Z'
),
(
  'user-3', 
  'Lucas Mendonça', 
  'lucas.m@yahoo.com.br', 
  '$2a$10$y58fB73Z3zI96gK5P7X7reF7VbeW.mI.9/M5pW7S0HnFzHmWw7D.y', 
  '(11) 97766-5544', 
  '2005-01-30', 
  'Célula Kerigma', 
  'MEMBER', 
  '', 
  290, 
  '{"gold": 1, "silver": 1, "bronze": 2}'::jsonb, 
  '[{"id": "ach-1", "title": "Primeiros Passos", "description": "Completou o primeiro desafio", "icon": "Compass", "unlockedAt": "2026-06-12"}]'::jsonb, 
  'user-2', 
  '2026-06-30T12:00:00.000Z'
),
(
  'user-4', 
  'Mariana Costa', 
  'mari.costa@hotmail.com', 
  '$2a$10$y58fB73Z3zI96gK5P7X7reF7VbeW.mI.9/M5pW7S0HnFzHmWw7D.y', 
  '(11) 96543-2109', 
  '2003-12-05', 
  'Célula Koinonia', 
  'MEMBER', 
  '', 
  150, 
  '{"gold": 0, "silver": 1, "bronze": 1}'::jsonb, 
  '[{"id": "ach-1", "title": "Primeiros Passos", "description": "Completou o primeiro desafio", "icon": "Compass", "unlockedAt": "2026-06-20"}]'::jsonb, 
  'user-2', 
  '2026-06-30T12:00:00.000Z'
);

-- 2. SEED NEWS
INSERT INTO news (id, title, subtitle, content, cover_image, category, author, author_role, date, likes, liked_by, comments)
VALUES
(
  'news-1',
  'Como manter a fé na faculdade: guia de sobrevivência espiritual',
  'Dicas fundamentais e práticas para permanecer firme na Palavra em ambientes desafiadores.',
  'Estudar em uma universidade é um dos momentos mais estimulantes da vida, repleto de novos conhecimentos, amizades e independência. No entanto, é também um período de intensos questionamentos e desafios para a vida de fé cristã. Muitos jovens se deparam com visões de mundo contrastantes e questionamentos intelectuais que podem abalar as estruturas espirituais se não estiverem bem fundamentados.

Aqui estão algumas práticas cruciais para continuar crescendo espiritualmente neste ambiente:

1. **Estabeleça uma Rotina de Devoção Matinal**: Não saia de casa sem passar tempo com Deus. Ler as Escrituras e orar pela manhã prepara o seu coração e a sua mente para as influências do dia.
2. **Crie ou Participe de uma Célula**: Estar conectado semanalmente a outros jovens cristãos cria um ecossistema de apoio e prestação de contas. Na faculdade, procure ou forme um grupo de oração no intervalo.
3. **Mantenha a Humildade Intelectual**: Compreenda que a ciência e a filosofia não anulam o Criador; pelo contrário, revelam Sua complexidade. Estude teologia e apologética para responder com sabedoria às suas próprias dúvidas e às de seus colegas.

Lembre-se sempre de Daniel na Babilônia: ele foi excelente nos estudos acadêmicos e fiel ao Senhor acima de qualquer circunstância.',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
  'Espiritual',
  'Pastor Daniel Lemos',
  'Pastor Geral de Jovens',
  '2026-06-28',
  2,
  '["user-2", "user-3"]'::jsonb,
  '[{"id": "c-1", "userName": "Lucas Mendonça", "content": "Esse texto veio na hora certa! Começo meu semestre de engenharia na próxima semana e já estava apreensivo.", "date": "2026-06-28"}, {"id": "c-2", "userName": "Beatriz Oliveira", "content": "Daniel é realmente um exemplo maravilhoso de excelência acadêmica com integridade!", "date": "2026-06-29"}]'::jsonb
),
(
  'news-2',
  'Inscrições abertas para o Acampamento de Inverno HUIOS 2026',
  'Prepare-se para três dias de imersão espiritual intensa, comunhão genuína e aventuras radicais.',
  'Vem aí o maior evento do nosso grupo de jovens deste ano! O **Acampamento de Inverno HUIOS 2026: Profundezas** acontecerá entre os dias 17 e 19 de julho no Sítio Recanto da Paz, em Mairiporã. 

Teremos a presença de ministros renomados, gincanas temáticas com nosso sistema de pontuação, momentos profundos de busca ao Espírito Santo e uma fogueira inesquecível de adoração na última noite.

**Informações Importantes:**
* **Data**: 17 a 19 de julho.
* **Local**: Sítio Recanto da Paz (Transporte em ônibus fretado incluído).
* **Investimento**: R$ 250,00 (pode ser parcelado em até 4x no boleto ou cartão).
* **Vagas limitadas**: Apenas 120 participantes.

Para se inscrever, clique no botão no painel administrativo ou fale diretamente com o líder de sua célula. Os primeiros 50 inscritos ganharão a camiseta oficial do acampamento!',
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
  'Acampamento',
  'Beatriz Oliveira',
  'Líder de Comunicação',
  '2026-06-25',
  3,
  '["user-1", "user-3", "user-4"]'::jsonb,
  '[{"id": "c-3", "userName": "Gabriel Santos", "content": "Eu já garanti minha vaga e a camiseta! Vai ser histórico!", "date": "2026-06-25"}]'::jsonb
),
(
  'news-3',
  'A relevância do serviço social na juventude da igreja',
  'Como o evangelho prático transforma vidas nas comunidades periféricas e no nosso próprio coração.',
  'Muitas vezes resumimos nossa fé a comparecer aos cultos no final de semana e ler alguns versículos rápidos. No entanto, o evangelho de Jesus Cristo é eminentemente prático e compassivo. Ao olharmos para as Escrituras, vemos Jesus curando, alimentando e restaurando os necessitados e marginalizados da sociedade.

No próximo sábado, o ministério HUIOS Social estará promovendo uma ação de distribuição de cestas básicas, roupas e atendimento recreativo para crianças na comunidade do Jacarezinho. 

Participar desse tipo de ação não é apenas fazer o bem para o próximo; é um poderoso antídoto contra o orgulho e o consumismo que tanto assolam nossa geração. Quando servimos ativamente, nossos olhos se abrem para as reais carências das pessoas e nosso coração se expande com o verdadeiro amor de Cristo.

Para participar da equipe de voluntários, basta se inscrever no formulário de contato ou procurar o setor de Ações Sociais.',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
  'Geral',
  'Gabriel Santos',
  'Líder de Ação Social',
  '2026-06-22',
  1,
  '["user-2"]'::jsonb,
  '[]'::jsonb
);

-- 3. SEED EVENTS
INSERT INTO events (id, title, description, date, time, address, map_embed_url, responsible, category, image_url)
VALUES
(
  'event-1',
  'Encontro Geral HUIOS - Start 2026',
  'Nosso grande culto de jovens com muito louvor, adoração e uma palavra poderosa de Deus para as nossas vidas. Traga mais um amigo e venha viver algo extraordinário!',
  '2026-07-04',
  '19:30',
  'Auditório Principal - Av. Nações Unidas, 1500, Pinheiros, São Paulo - SP',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.065830021516!2d-46.699026!3d-23.56606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce570be0b2d69f%3A0x600f14d8ff2bc3cc!2sAv.%20das%20Na%C3%A7%C3%B5es%20Unidas%2C%201500%20-%20Pinheiros%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1680000000000!5m2!1spt-BR!2sbr',
  'Pastor Daniel Lemos',
  'Culto',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
),
(
  'event-2',
  'Célula HUIOS Koinonia',
  'Comunhão semanal, estudo da palavra em grupo menor, partilha e lanche. O lugar ideal para criar conexões profundas e amizades verdadeiras em Cristo.',
  '2026-07-02',
  '20:00',
  'Casa do Gabriel - Rua dos Pinheiros, 450, Ap 122, Pinheiros, São Paulo - SP',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.2181467472283!2d-46.684534!3d-23.560613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce57a6b8c82343%3A0xebc36ff04ff7a884!2sR.%20dos%20Pinheiros%2C%20450%20-%20Pinheiros%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1680000000001!5m2!1spt-BR!2sbr',
  'Gabriel Santos',
  'Célula',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800'
),
(
  'event-3',
  'Conferência Jovem Metamorfose 2026',
  'Dois dias imersivos de ativação espiritual, painéis de discussão sobre cultura e fé, preletores convidados e workshops temáticos. Tema: Renovando a Mente.',
  '2026-08-14',
  '14:00',
  'Arena da Igreja - Av. das Nações Unidas, 3000, Pinheiros, São Paulo - SP',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.789230129012!2d-46.702334!3d-23.571401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce570e6e7313bf%3A0xe67db4d28fe7974e!2sAv.%20das%20Na%C3%A7%C3%B5es%20Unidas%2C%203000%20-%20Pinheiros%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1680000000002!5m2!1spt-BR!2sbr',
  'Liderança HUIOS',
  'Conferência',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800'
);

-- 4. SEED ANNOUNCEMENTS
INSERT INTO announcements (id, title, content, category, important, date, created_by)
VALUES
(
  'ann-1',
  'Mudança Excepcional de Horário - Culto de 04/07',
  'Atenção a todos! Excepcionalmente no dia 04/07 nosso culto iniciará às 19:30 (meia hora mais tarde) devido à formatura do seminário teológico que ocorrerá no templo principal.',
  'Mudança de Horário',
  true,
  '2026-06-29',
  'Gabriel Santos'
),
(
  'ann-2',
  'Período de Jejum e Oração Coletiva',
  'Iniciaremos na próxima segunda-feira um período de 10 dias de consagração e jejum de mídias sociais em preparação para o nosso Acampamento. Vamos juntos buscar um despertamento profundo!',
  'Jejum',
  false,
  '2026-06-27',
  'Daniel Lemos'
);

-- 5. SEED PRAYERS
INSERT INTO prayer_requests (id, name, request, is_anonymous, date, status, admin_response, prayed_count, prayed_by)
VALUES
(
  'prayer-1',
  'Mariana Costa',
  'Peço oração pela restauração da saúde de minha avó que está internada com pneumonia grave. Cremos no milagre da cura divina.',
  false,
  '2026-06-29',
  'Em oração',
  '',
  14,
  '["user-1", "user-2", "user-3"]'::jsonb
),
(
  'prayer-2',
  'Anônimo',
  'Estou enfrentando uma fase de profundas decisões profissionais e crises de ansiedade sobre o meu futuro. Peço sabedoria, paz de espírito e discernimento de Deus.',
  true,
  '2026-06-28',
  'Novo',
  '',
  8,
  '["user-1"]'::jsonb
);

-- 6. SEED SUGGESTIONS
INSERT INTO suggestions (id, name, email, suggestion, category, date, status, admin_response)
VALUES
(
  'sug-1',
  'Lucas Mendonça',
  'lucas.m@yahoo.com.br',
  'Poderíamos fazer uma sessão de cinema cristão com debate e pipoca no salão menor, talvez uma vez a cada dois meses no sábado à tarde. Seria muito legal para aproximar os visitantes.',
  'Eventos',
  '2026-06-27',
  'Aceita',
  'Ideia sensacional, Lucas! Vamos planejar a primeira edição para o início de Agosto. A equipe de comunicação entrará em contato com você para organizarmos juntos.'
);

-- 7. SEED CHALLENGES
INSERT INTO challenges (id, title, description, image_url, start_date, end_date, prize, max_winners, points, active)
VALUES
(
  'chal-1',
  'Leitura de Atos dos Apóstolos',
  'Leia integralmente os primeiros 10 capítulos do livro de Atos e escreva uma reflexão pessoal sobre o poder do Espírito Santo na igreja primitiva.',
  'https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&q=80&w=600',
  '2026-06-20',
  '2026-07-03',
  'Bíblia de Estudos Thompson e Camiseta Oficial HUIOS',
  3,
  150,
  true
),
(
  'chal-2',
  'Evangelismo Prático e Conexão',
  'Convide um colega de sala, faculdade ou trabalho que não frequente igreja para assistir ao nosso Culto HUIOS e tire uma foto sorridente com ele na recepção do templo.',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600',
  '2026-06-25',
  '2026-07-10',
  'Ingresso VIP para a Conferência Metamorfose 2026',
  5,
  200,
  true
);

-- 8. SEED SUBMISSIONS
INSERT INTO submissions (id, challenge_id, challenge_title, user_id, user_name, user_avatar, date, text, file_url, media_type, status, feedback)
VALUES
(
  'sub-1',
  'chal-1',
  'Leitura de Atos dos Apóstolos',
  'user-3',
  'Lucas Mendonça',
  '',
  '2026-06-26',
  'Atos 2 me marcou de forma extraordinária. O derramamento do Espírito Santo não foi para autopromoção, mas sim para capacitação ao testemunho global. A união deles nas casas, partilhando tudo, é o maior exemplo para nossas células hoje.',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
  'text',
  'Aprovado',
  'Excelente reflexão, Lucas! Sua percepção sobre o propósito evangelístico do Pentecostes está perfeita. Continue assim!'
);

-- 9. SEED NOTIFICATIONS
INSERT INTO notifications (id, title, message, date, type, read, target_role)
VALUES
(
  'not-1',
  'Novo Desafio Ativo!',
  'O desafio ''Evangelismo Prático e Conexão'' está liberado. Convide amigos e acumule 200 pontos no ranking!',
  '2026-06-25',
  'desafio',
  false,
  NULL
),
(
  'not-2',
  'Nova Notícia Publicada',
  'O pastor Daniel publicou o artigo: ''Como manter a fé na faculdade: guia de sobrevivência espiritual''. Confira!',
  '2026-06-28',
  'noticia',
  false,
  NULL
);

-- 10. SEED ACCESS LOGS
INSERT INTO access_logs (id, user_name, email, role, action, timestamp)
VALUES
(
  'log-1',
  'Nauham',
  'nauham86@gmail.com',
  'ADMIN',
  'Sistema de Produção Inicializado',
  '30/06/2026 13:45:00'
);
