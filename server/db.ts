import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { 
  UserProfile, 
  UserRole, 
  EventItem, 
  NewsItem, 
  Announcement, 
  PrayerRequest, 
  SuggestionItem, 
  Challenge, 
  ChallengeSubmission, 
  SystemNotification, 
  AccessLog 
} from "../src/types";

// Database filepath
const DB_FILE = path.join(process.cwd(), "database.json");

interface DatabaseSchema {
  users: Array<UserProfile & { passwordHash: string; createdBy: string | null; createdAt: string }>;
  news: NewsItem[];
  events: EventItem[];
  announcements: Announcement[];
  prayerRequests: PrayerRequest[];
  suggestions: SuggestionItem[];
  challenges: Challenge[];
  submissions: ChallengeSubmission[];
  notifications: SystemNotification[];
  accessLogs: AccessLog[];
}

// Default Seed Data
const getInitialData = (): DatabaseSchema => {
  const salt = bcrypt.genSaltSync(10);
  
  // Seed Users
  const users = [
    {
      id: "admin-1",
      name: "Nauham",
      email: "nauham86@gmail.com",
      passwordHash: bcrypt.hashSync("admin280220", salt),
      phone: "(11) 99999-9999",
      birthDate: "1995-02-28",
      cellGroup: "Sede",
      role: UserRole.ADMIN,
      avatarUrl: "",
      points: 0,
      medals: { gold: 0, silver: 0, bronze: 0 },
      achievements: [],
      createdBy: null,
      createdAt: new Date().toISOString()
    },
    {
      id: "user-1",
      name: "Gabriel Santos",
      email: "gabriel.santos@huios.com",
      passwordHash: bcrypt.hashSync("123456", salt),
      phone: "(11) 98765-4321",
      birthDate: "2002-05-15",
      cellGroup: "Célula Koinonia",
      role: UserRole.ADMIN,
      avatarUrl: "",
      points: 450,
      medals: { gold: 3, silver: 2, bronze: 1 },
      achievements: [
        { id: "ach-1", title: "Primeiros Passos", description: "Completou o primeiro desafio", icon: "Compass", unlockedAt: "2026-06-10" },
        { id: "ach-2", title: "Discipulado Fiel", description: "Leitura diária por 7 dias seguidos", icon: "BookOpen", unlockedAt: "2026-06-18" },
        { id: "ach-3", title: "Evangelista Ativo", description: "Trouxe 3 amigos para a Célula", icon: "Users", unlockedAt: "2026-06-25" }
      ],
      createdBy: "admin-1",
      createdAt: new Date().toISOString()
    },
    {
      id: "user-2",
      name: "Beatriz Oliveira",
      email: "beatriz.oliveira@gmail.com",
      passwordHash: bcrypt.hashSync("123456", salt),
      phone: "(11) 99123-4567",
      birthDate: "2004-09-22",
      cellGroup: "Célula Emanuel",
      role: UserRole.LEADER,
      avatarUrl: "",
      points: 380,
      medals: { gold: 2, silver: 3, bronze: 0 },
      achievements: [
        { id: "ach-1", title: "Primeiros Passos", description: "Completou o primeiro desafio", icon: "Compass", unlockedAt: "2026-06-11" },
        { id: "ach-2", title: "Discipulado Fiel", description: "Leitura diária por 7 dias seguidos", icon: "BookOpen", unlockedAt: "2026-06-15" }
      ],
      createdBy: "admin-1",
      createdAt: new Date().toISOString()
    },
    {
      id: "user-3",
      name: "Lucas Mendonça",
      email: "lucas.m@yahoo.com.br",
      passwordHash: bcrypt.hashSync("123456", salt),
      phone: "(11) 97766-5544",
      birthDate: "2005-01-30",
      cellGroup: "Célula Kerigma",
      role: UserRole.MEMBER,
      avatarUrl: "",
      points: 290,
      medals: { gold: 1, silver: 1, bronze: 2 },
      achievements: [
        { id: "ach-1", title: "Primeiros Passos", description: "Completou o primeiro desafio", icon: "Compass", unlockedAt: "2026-06-12" }
      ],
      createdBy: "user-2",
      createdAt: new Date().toISOString()
    },
    {
      id: "user-4",
      name: "Mariana Costa",
      email: "mari.costa@hotmail.com",
      passwordHash: bcrypt.hashSync("123456", salt),
      phone: "(11) 96543-2109",
      birthDate: "2003-12-05",
      cellGroup: "Célula Koinonia",
      role: UserRole.MEMBER,
      avatarUrl: "",
      points: 150,
      medals: { gold: 0, silver: 1, bronze: 1 },
      achievements: [
        { id: "ach-1", title: "Primeiros Passos", description: "Completou o primeiro desafio", icon: "Compass", unlockedAt: "2026-06-20" }
      ],
      createdBy: "user-2",
      createdAt: new Date().toISOString()
    }
  ];

  // News Seed
  const news: NewsItem[] = [
    {
      id: "news-1",
      title: "Como manter a fé na faculdade: guia de sobrevivência espiritual",
      subtitle: "Dicas fundamentais e práticas para permanecer firme na Palavra em ambientes desafiadores.",
      content: `Estudar em uma universidade é um dos momentos mais estimulantes da vida, repleto de novos conhecimentos, amizades e independência. No entanto, é também um período de intensos questionamentos e desafios para a vida de fé cristã. Muitos jovens se deparam com visões de mundo contrastantes e questionamentos intelectuais que podem abalar as estruturas espirituais se não estiverem bem fundamentados.

Aqui estão algumas práticas cruciais para continuar crescendo espiritualmente neste ambiente:

1. **Estabeleça uma Rotina de Devoção Matinal**: Não saia de casa sem passar tempo com Deus. Ler as Escrituras e orar pela manhã prepara o seu coração e a sua mente para as influências do dia.
2. **Crie ou Participe de uma Célula**: Estar conectado semanalmente a outros jovens cristãos cria um ecossistema de apoio e prestação de contas. Na faculdade, procure ou forme um grupo de oração no intervalo.
3. **Mantenha a Humildade Intelectual**: Compreenda que a ciência e a filosofia não anulam o Criador; pelo contrário, revelam Sua complexidade. Estude teologia e apologética para responder com sabedoria às suas próprias dúvidas e às de seus colegas.

Lembre-se sempre de Daniel na Babilônia: ele foi excelente nos estudos acadêmicos e fiel ao Senhor acima de qualquer circunstância.`,
      coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
      author: "Pastor Daniel Lemos",
      authorRole: "Pastor Geral de Jovens",
      date: "2026-06-28",
      likes: 42,
      likedBy: ["user-2", "user-3"],
      category: "Espiritual",
      comments: [
        { id: "c-1", userName: "Lucas Mendonça", userAvatar: "", content: "Esse texto veio na hora certa! Começo meu semestre de engenharia na próxima semana e já estava apreensivo.", date: "2026-06-28" },
        { id: "c-2", userName: "Beatriz Oliveira", userAvatar: "", content: "Daniel é realmente um exemplo maravilhoso de excelência acadêmica com integridade!", date: "2026-06-29" }
      ]
    },
    {
      id: "news-2",
      title: "Inscrições abertas para o Acampamento de Inverno HUIOS 2026",
      subtitle: "Prepare-se para três dias de imersão espiritual intensa, comunhão genuína e aventuras radicais.",
      content: `Vem aí o maior evento do nosso grupo de jovens deste ano! O **Acampamento de Inverno HUIOS 2026: Profundezas** acontecerá entre os dias 17 e 19 de julho no Sítio Recanto da Paz, em Mairiporã. 

Teremos a presença de ministros renomados, gincanas temáticas com nosso sistema de pontuação, momentos profundos de busca ao Espírito Santo e uma fogueira inesquecível de adoração na última noite.

**Informações Importantes:**
* **Data**: 17 a 19 de julho.
* **Local**: Sítio Recanto da Paz (Transporte em ônibus fretado incluído).
* **Investimento**: R$ 250,00 (pode ser parcelado em até 4x no boleto ou cartão).
* **Vagas limitadas**: Apenas 120 participantes.

Para se inscrever, clique no botão no painel administrativo ou fale diretamente com o líder de sua célula. Os primeiros 50 inscritos ganharão a camiseta oficial do acampamento!`,
      coverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800",
      author: "Beatriz Oliveira",
      authorRole: "Líder de Comunicação",
      date: "2026-06-25",
      likes: 87,
      likedBy: ["user-1", "user-3", "user-4"],
      category: "Acampamento",
      comments: [
        { id: "c-3", userName: "Gabriel Santos", userAvatar: "", content: "Eu já garanti minha vaga e a camiseta! Vai ser histórico!", date: "2026-06-25" }
      ]
    },
    {
      id: "news-3",
      title: "A relevância do serviço social na juventude da igreja",
      subtitle: "Como o evangelho prático transforma vidas nas comunidades periféricas e no nosso próprio coração.",
      content: `Muitas vezes resumimos nossa fé a comparecer aos cultos no final de semana e ler alguns versículos rápidos. No entanto, o evangelho de Jesus Cristo é eminentemente prático e compassivo. Ao olharmos para as Escrituras, vemos Jesus curando, alimentando e restaurando os necessitados e marginalizados da sociedade.

No próximo sábado, o ministério HUIOS Social estará promovendo uma ação de distribuição de cestas básicas, roupas e atendimento recreativo para crianças na comunidade do Jacarezinho. 

Participar desse tipo de ação não é apenas fazer o bem para o próximo; é um poderoso antídoto contra o orgulho e o consumismo que tanto assolam nossa geração. Quando servimos ativamente, nossos olhos se abrem para as reais carências das pessoas e nosso coração se expande com o verdadeiro amor de Cristo.

Para participar da equipe de voluntários, basta se inscrever no formulário de contato ou procurar o setor de Ações Sociais.`,
      coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
      author: "Gabriel Santos",
      authorRole: "Líder de Ação Social",
      date: "2026-06-22",
      likes: 35,
      likedBy: ["user-2"],
      category: "Geral",
      comments: []
    }
  ];

  // Events Seed
  const events: EventItem[] = [
    {
      id: "event-1",
      title: "Encontro Geral HUIOS - Start 2026",
      description: "Nosso grande culto de jovens com muito louvor, adoração e uma palavra poderosa de Deus para as nossas vidas. Traga mais um amigo e venha viver algo extraordinário!",
      date: "2026-07-04",
      time: "19:30",
      address: "Auditório Principal - Av. Nações Unidas, 1500, Pinheiros, São Paulo - SP",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.065830021516!2d-46.699026!3d-23.56606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce570be0b2d69f%3A0x600f14d8ff2bc3cc!2sAv.%20das%20Na%C3%A7%C3%B5es%20Unidas%2C%201500%20-%20Pinheiros%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1680000000000!5m2!1spt-BR!2sbr",
      responsible: "Pastor Daniel Lemos",
      category: "Culto",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "event-2",
      title: "Célula HUIOS Koinonia",
      description: "Comunhão semanal, estudo da palavra em grupo menor, partilha e lanche. O lugar ideal para criar conexões profundas e amizades verdadeiras em Cristo.",
      date: "2026-07-02",
      time: "20:00",
      address: "Casa do Gabriel - Rua dos Pinheiros, 450, Ap 122, Pinheiros, São Paulo - SP",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.2181467472283!2d-46.684534!3d-23.560613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce57a6b8c82343%3A0xebc36ff04ff7a884!2sR.%20dos%20Pinheiros%2C%20450%20-%20Pinheiros%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1680000000001!5m2!1spt-BR!2sbr",
      responsible: "Gabriel Santos",
      category: "Célula",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "event-3",
      title: "Conferência Jovem Metamorfose 2026",
      description: "Dois dias imersivos de ativação espiritual, painéis de discussão sobre cultura e fé, preletores convidados e workshops temáticos. Tema: Renovando a Mente.",
      date: "2026-08-14",
      time: "14:00",
      address: "Arena da Igreja - Av. das Nações Unidas, 3000, Pinheiros, São Paulo - SP",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.789230129012!2d-46.702334!3d-23.571401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce570e6e7313bf%3A0xe67db4d28fe7974e!2sAv.%20das%20Na%C3%A7%C3%B5es%20Unidas%2C%203000%20-%20Pinheiros%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1680000000002!5m2!1spt-BR!2sbr",
      responsible: "Liderança HUIOS",
      category: "Conferência",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800"
    }
  ];

  // Announcements Seed
  const announcements: Announcement[] = [
    {
      id: "ann-1",
      title: "Mudança Excepcional de Horário - Culto de 04/07",
      content: "Atenção a todos! Excepcionalmente no dia 04/07 nosso culto iniciará às 19:30 (meia hora mais tarde) devido à formatura do seminário teológico que ocorrerá no templo principal.",
      date: "2026-06-29",
      category: "Mudança de Horário",
      important: true,
      createdBy: "Gabriel Santos"
    },
    {
      id: "ann-2",
      title: "Período de Jejum e Oração Coletiva",
      content: "Iniciaremos na próxima segunda-feira um período de 10 dias de consagração e jejum de mídias sociais em preparação para o nosso Acampamento. Vamos juntos buscar um despertamento profundo!",
      date: "2026-06-27",
      category: "Jejum",
      important: false,
      createdBy: "Daniel Lemos"
    }
  ];

  // Prayers Seed
  const prayerRequests: PrayerRequest[] = [
    {
      id: "prayer-1",
      name: "Mariana Costa",
      request: "Peço oração pela restauração da saúde de minha avó que está internada com pneumonia grave. Cremos no milagre da cura divina.",
      isAnonymous: false,
      date: "2026-06-29",
      status: "Em oração",
      prayedCount: 14,
      prayedBy: ["user-1", "user-2", "user-3"]
    },
    {
      id: "prayer-2",
      name: "Anônimo",
      request: "Estou enfrentando uma fase de profundas decisões profissionais e crises de ansiedade sobre o meu futuro. Peço sabedoria, paz de espírito e discernimento de Deus.",
      isAnonymous: true,
      date: "2026-06-28",
      status: "Novo",
      prayedCount: 8,
      prayedBy: ["user-1"]
    }
  ];

  // Suggestions Seed
  const suggestions: SuggestionItem[] = [
    {
      id: "sug-1",
      name: "Lucas Mendonça",
      email: "lucas.m@yahoo.com.br",
      suggestion: "Poderíamos fazer uma sessão de cinema cristão com debate e pipoca no salão menor, talvez uma vez a cada dois meses no sábado à tarde. Seria muito legal para aproximar os visitantes.",
      category: "Eventos",
      date: "2026-06-27",
      status: "Aceita",
      adminResponse: "Ideia sensacional, Lucas! Vamos planejar a primeira edição para o início de Agosto. A equipe de comunicação entrará em contato com você para organizarmos juntos."
    }
  ];

  // Challenges Seed
  const challenges: Challenge[] = [
    {
      id: "chal-1",
      title: "Leitura de Atos dos Apóstolos",
      description: "Leia integralmente os primeiros 10 capítulos do livro de Atos e escreva uma reflexão pessoal sobre o poder do Espírito Santo na igreja primitiva.",
      imageUrl: "https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&q=80&w=600",
      startDate: "2026-06-20",
      endDate: "2026-07-03",
      prize: "Bíblia de Estudos Thompson e Camiseta Oficial HUIOS",
      maxWinners: 3,
      points: 150,
      active: true
    },
    {
      id: "chal-2",
      title: "Evangelismo Prático e Conexão",
      description: "Convide um colega de sala, faculdade ou trabalho que não frequente igreja para assistir ao nosso Culto HUIOS e tire uma foto sorridente com ele na recepção do templo.",
      imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600",
      startDate: "2026-06-25",
      endDate: "2026-07-10",
      prize: "Ingresso VIP para a Conferência Metamorfose 2026",
      maxWinners: 5,
      points: 200,
      active: true
    }
  ];

  // Submissions Seed
  const submissions: ChallengeSubmission[] = [
    {
      id: "sub-1",
      challengeId: "chal-1",
      challengeTitle: "Leitura de Atos dos Apóstolos",
      userId: "user-3",
      userName: "Lucas Mendonça",
      userAvatar: "",
      date: "2026-06-26",
      text: "Atos 2 me marcou de forma extraordinária. O derramamento do Espírito Santo não foi para autopromoção, mas sim para capacitação ao testemunho global. A união deles nas casas, partilhando tudo, é o maior exemplo para nossas células hoje.",
      fileUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
      mediaType: "text",
      status: "Aprovado",
      feedback: "Excelente reflexão, Lucas! Sua percepção sobre o propósito evangelístico do Pentecostes está perfeita. Continue assim!"
    }
  ];

  // Notifications Seed
  const notifications: SystemNotification[] = [
    {
      id: "not-1",
      title: "Novo Desafio Ativo!",
      message: "O desafio 'Evangelismo Prático e Conexão' está liberado. Convide amigos e acumule 200 pontos no ranking!",
      date: "2026-06-25",
      type: "desafio",
      read: false
    },
    {
      id: "not-2",
      title: "Nova Notícia Publicada",
      message: "O pastor Daniel publicou o artigo: 'Como manter a fé na faculdade: guia de sobrevivência espiritual'. Confira!",
      date: "2026-06-28",
      type: "noticia",
      read: false
    }
  ];

  // AccessLogs Seed
  const accessLogs: AccessLog[] = [
    { id: "log-1", userName: "Nauham", email: "nauham86@gmail.com", role: "ADMIN", action: "Sistema de Produção Inicializado", timestamp: new Date().toLocaleString() }
  ];

  return {
    users,
    news,
    events,
    announcements,
    prayerRequests,
    suggestions,
    challenges,
    submissions,
    notifications,
    accessLogs
  };
};

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(fileContent);
        
        // Ensure nauham admin is always correct and present
        const salt = bcrypt.genSaltSync(10);
        const hasAdmin = parsed.users.some((u: any) => u.email === "nauham86@gmail.com");
        if (!hasAdmin) {
          parsed.users.unshift({
            id: "admin-1",
            name: "Nauham",
            email: "nauham86@gmail.com",
            passwordHash: bcrypt.hashSync("admin280220", salt),
            phone: "(11) 99999-9999",
            birthDate: "1995-02-28",
            cellGroup: "Sede",
            role: UserRole.ADMIN,
            avatarUrl: "",
            points: 0,
            medals: { gold: 0, silver: 0, bronze: 0 },
            achievements: [],
            createdBy: null,
            createdAt: new Date().toISOString()
          });
          fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
        }
        return parsed;
      }
    } catch (e) {
      console.error("Erro ao ler banco de dados JSON, usando dados padrão:", e);
    }

    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Erro ao gravar banco de dados JSON:", e);
    }
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public save() {
    this.saveData(this.data);
  }

  public logAction(userName: string, email: string, role: string, action: string) {
    const log: AccessLog = {
      id: "log-" + Math.random().toString(36).substr(2, 9),
      userName,
      email,
      role,
      action,
      timestamp: new Date().toLocaleString("pt-BR")
    };
    this.data.accessLogs.unshift(log);
    if (this.data.accessLogs.length > 100) {
      this.data.accessLogs.pop();
    }
    this.save();
  }
}

export const db = new Database();
