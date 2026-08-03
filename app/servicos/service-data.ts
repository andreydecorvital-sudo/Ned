export type ServiceSlug = "sites" | "automacoes" | "trafego-pago" | "marketplaces";

export type ServiceData = {
  slug: ServiceSlug;
  number: string;
  shortName: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  metaDescription: string;
  heroPoints: string[];
  problemTitle: string;
  problemIntro: string;
  problems: Array<{ title: string; text: string }>;
  deliverables: string[];
  process: Array<{ number: string; title: string; text: string }>;
  audience: string[];
  faqs: Array<{ question: string; answer: string }>;
  whatsappMessage: string;
  related: ServiceSlug[];
};

export const serviceOrder: ServiceSlug[] = [
  "sites",
  "automacoes",
  "trafego-pago",
  "marketplaces",
];

export const services: Record<ServiceSlug, ServiceData> = {
  sites: {
    slug: "sites",
    number: "01",
    shortName: "Sites",
    eyebrow: "SITES E LANDING PAGES",
    title: "Seu site precisa",
    accent: "trabalhar pela venda.",
    description:
      "Criamos sites e landing pages que deixam a oferta clara, conduzem o visitante e transformam interesse em conversa com contexto.",
    metaDescription:
      "Criação de sites e landing pages estratégicas, responsivas e integradas ao WhatsApp para empresas que querem gerar oportunidades com clareza.",
    heroPoints: ["Estratégia e arquitetura", "Design responsivo", "Conversão e mensuração"],
    problemTitle: "Um site bonito não resolve uma jornada confusa.",
    problemIntro:
      "Quando a pessoa não entende o que a empresa oferece, por que deveria escolher e qual é o próximo passo, o site vira apenas uma apresentação cara.",
    problems: [
      {
        title: "Oferta escondida",
        text: "O visitante precisa procurar demais para entender o serviço, a diferença e a ação esperada.",
      },
      {
        title: "Contato sem contexto",
        text: "O site manda todo mundo para o mesmo WhatsApp, sem preparar a conversa ou identificar a necessidade.",
      },
      {
        title: "Experiência fraca no celular",
        text: "Texto apertado, carregamento lento e botões ruins interrompem a jornada onde a maior parte do público navega.",
      },
    ],
    deliverables: [
      "Diagnóstico da oferta e do público",
      "Arquitetura de páginas e jornada",
      "Copy orientada à ação",
      "Design visual exclusivo e responsivo",
      "Desenvolvimento em tecnologia moderna",
      "Integração com WhatsApp e formulários",
      "SEO técnico essencial",
      "Analytics e eventos de conversão",
      "Publicação e configuração de domínio",
    ],
    process: [
      {
        number: "01",
        title: "Diagnóstico",
        text: "Entendemos o negócio, a oferta, o público, os concorrentes e a ação principal esperada.",
      },
      {
        number: "02",
        title: "Estrutura",
        text: "Organizamos a narrativa, as páginas, os argumentos e os caminhos de conversão.",
      },
      {
        number: "03",
        title: "Design e construção",
        text: "Criamos a interface e desenvolvemos a experiência para desktop e celular.",
      },
      {
        number: "04",
        title: "Lançamento",
        text: "Publicamos, medimos os eventos principais e deixamos a base pronta para evolução.",
      },
    ],
    audience: [
      "Empresas com site antigo ou genérico",
      "Negócios que dependem apenas de redes sociais",
      "Profissionais que precisam apresentar melhor seus serviços",
      "Campanhas que precisam de uma landing page específica",
    ],
    faqs: [
      {
        question: "O site será feito a partir de um modelo pronto?",
        answer:
          "A estrutura parte das necessidades do negócio. Podemos usar componentes consolidados para acelerar a construção, mas o conteúdo, a hierarquia e a experiência são definidos para o projeto.",
      },
      {
        question: "Vocês também fazem o texto do site?",
        answer:
          "Sim. A organização da oferta e a copy fazem parte do trabalho, com validação das informações técnicas e comerciais pelo cliente.",
      },
      {
        question: "O site funciona bem no celular?",
        answer:
          "Sim. A experiência mobile é tratada como parte central do projeto, não como uma adaptação feita no final.",
      },
      {
        question: "Depois de publicado, consigo atualizar o conteúdo?",
        answer:
          "A forma de atualização depende do projeto. Podemos entregar áreas editáveis ou cuidar das alterações e evoluções conforme a necessidade.",
      },
    ],
    whatsappMessage:
      "Olá, Ned! Vi a página de sites e landing pages e quero conversar sobre um projeto para minha empresa.",
    related: ["automacoes", "trafego-pago"],
  },
  automacoes: {
    slug: "automacoes",
    number: "02",
    shortName: "Automações",
    eyebrow: "AUTOMAÇÕES E INTELIGÊNCIA ARTIFICIAL",
    title: "Menos tarefa repetitiva.",
    accent: "Mais operação inteligente.",
    description:
      "Mapeamos processos e conectamos ferramentas para reduzir trabalho manual, acelerar o atendimento e dar mais contexto para as decisões.",
    metaDescription:
      "Automações empresariais e soluções com inteligência artificial para atendimento, integração de processos e redução de tarefas repetitivas.",
    heroPoints: ["Processos conectados", "Atendimento com contexto", "IA aplicada ao trabalho real"],
    problemTitle: "Automatizar não é colocar um robô em tudo.",
    problemIntro:
      "A automação funciona quando existe um processo claro, uma regra útil e uma passagem segura para a equipe humana. Sem isso, ela apenas acelera a confusão.",
    problems: [
      {
        title: "Mensagens sem triagem",
        text: "Contatos detalhados, dúvidas vagas e solicitações urgentes chegam na mesma fila e consomem o mesmo esforço.",
      },
      {
        title: "Informação espalhada",
        text: "Dados ficam divididos entre planilhas, sistemas, e-mails e conversas, sem uma visão confiável do processo.",
      },
      {
        title: "Trabalho que depende de memória",
        text: "Tarefas importantes só acontecem quando alguém lembra, copia uma informação ou cobra manualmente.",
      },
    ],
    deliverables: [
      "Mapeamento do processo atual",
      "Definição de regras e exceções",
      "Integrações entre sistemas e canais",
      "Triagem e qualificação de mensagens",
      "Assistentes com IA para tarefas específicas",
      "Alertas, notificações e acompanhamentos",
      "Painéis e registros de operação",
      "Documentação do fluxo",
      "Testes, limites e passagem para atendimento humano",
    ],
    process: [
      {
        number: "01",
        title: "Mapeamento",
        text: "Identificamos tarefas repetitivas, dependências, riscos e pontos onde a equipe perde tempo.",
      },
      {
        number: "02",
        title: "Desenho do fluxo",
        text: "Definimos o que será automático, o que precisa de aprovação e quando uma pessoa deve assumir.",
      },
      {
        number: "03",
        title: "Integração e testes",
        text: "Conectamos as ferramentas, simulamos cenários reais e tratamos erros e exceções.",
      },
      {
        number: "04",
        title: "Acompanhamento",
        text: "Medimos o uso, corrigimos gargalos e evoluímos o fluxo conforme a operação aprende.",
      },
    ],
    audience: [
      "Equipes que respondem muitas mensagens repetidas",
      "Operações que dependem de planilhas e cópia manual",
      "Empresas que precisam organizar leads e solicitações",
      "Negócios que querem aplicar IA sem perder controle",
    ],
    faqs: [
      {
        question: "Toda automação precisa usar inteligência artificial?",
        answer:
          "Não. Muitas vezes, regras simples e integrações bem feitas são mais rápidas, previsíveis e econômicas. A IA entra quando realmente melhora interpretação, classificação ou produção de conteúdo.",
      },
      {
        question: "A automação pode responder clientes sozinha?",
        answer:
          "Pode atender etapas específicas, mas definimos limites, mensagens de transparência e critérios para encaminhar a conversa para uma pessoa.",
      },
      {
        question: "Vocês integram WhatsApp e Instagram?",
        answer:
          "A viabilidade depende das APIs, permissões e ferramentas disponíveis em cada conta. O projeto começa verificando exatamente o que pode ser integrado de forma estável.",
      },
      {
        question: "É possível começar pequeno?",
        answer:
          "Sim. A melhor abordagem normalmente é resolver primeiro um fluxo de alto impacto, medir e depois expandir.",
      },
    ],
    whatsappMessage:
      "Olá, Ned! Vi a página de automações e inteligência artificial e quero analisar um processo da minha empresa.",
    related: ["sites", "marketplaces"],
  },
  "trafego-pago": {
    slug: "trafego-pago",
    number: "03",
    shortName: "Tráfego pago",
    eyebrow: "TRÁFEGO PAGO E AQUISIÇÃO",
    title: "Anúncio sem estrutura",
    accent: "vira desperdício.",
    description:
      "Planejamos campanhas conectadas à oferta, à página e ao atendimento para transformar investimento em aprendizado e oportunidades reais.",
    metaDescription:
      "Gestão de tráfego pago com estratégia, mensuração, páginas de conversão e integração ao atendimento para empresas que querem crescer com dados.",
    heroPoints: ["Campanhas com objetivo", "Mensuração útil", "Otimização contínua"],
    problemTitle: "O anúncio é apenas uma parte da máquina.",
    problemIntro:
      "Não adianta comprar atenção quando a oferta está confusa, a página não convence ou o atendimento demora. O tráfego precisa estar conectado ao restante da jornada.",
    problems: [
      {
        title: "Métrica de vaidade",
        text: "Cliques, alcance e visualizações parecem bons, mas não explicam se a campanha gerou uma oportunidade relevante.",
      },
      {
        title: "Oferta desconectada",
        text: "O anúncio promete uma coisa, a página apresenta outra e o atendimento começa sem contexto.",
      },
      {
        title: "Otimização sem aprendizado",
        text: "Campanhas são alteradas por ansiedade, sem hipótese, histórico ou critérios claros de decisão.",
      },
    ],
    deliverables: [
      "Diagnóstico da oferta e do funil",
      "Definição de públicos e objetivos",
      "Estrutura de campanhas",
      "Plano de criativos e mensagens",
      "Configuração de pixels e eventos",
      "Integração com landing pages",
      "Acompanhamento de leads e conversões",
      "Relatórios com decisões e próximos testes",
      "Otimização baseada em dados",
    ],
    process: [
      {
        number: "01",
        title: "Base de conversão",
        text: "Revisamos oferta, página, rastreamento e capacidade de atendimento antes de aumentar investimento.",
      },
      {
        number: "02",
        title: "Hipóteses",
        text: "Definimos públicos, mensagens, criativos e objetivos que podem ser testados de forma organizada.",
      },
      {
        number: "03",
        title: "Execução",
        text: "Publicamos as campanhas, acompanhamos a entrega e corrigimos problemas de configuração e jornada.",
      },
      {
        number: "04",
        title: "Aprendizado",
        text: "Comparamos custo, qualidade das oportunidades e comportamento para decidir os próximos testes.",
      },
    ],
    audience: [
      "Empresas que querem começar a anunciar com estrutura",
      "Negócios que já investem, mas não entendem os resultados",
      "Campanhas que precisam de página e rastreamento melhores",
      "Operações preparadas para atender novas oportunidades",
    ],
    faqs: [
      {
        question: "Existe um valor mínimo de investimento?",
        answer:
          "O orçamento depende do mercado, objetivo, região e maturidade da estrutura. A recomendação é definida após o diagnóstico, sem prometer volume antes dos testes.",
      },
      {
        question: "Vocês garantem vendas?",
        answer:
          "Não. Tráfego pago aumenta distribuição e gera dados, mas o resultado também depende da oferta, preço, concorrência, página, atendimento e operação.",
      },
      {
        question: "Os criativos estão incluídos?",
        answer:
          "O escopo pode incluir direção, roteiro, peças estáticas e adaptação de materiais. A necessidade é definida conforme o plano de campanha.",
      },
      {
        question: "Como os resultados são acompanhados?",
        answer:
          "Acompanhamos eventos de conversão, custo, qualidade dos contatos e sinais do processo comercial, não apenas métricas da plataforma.",
      },
    ],
    whatsappMessage:
      "Olá, Ned! Vi a página de tráfego pago e quero entender como estruturar campanhas para minha empresa.",
    related: ["sites", "marketplaces"],
  },
  marketplaces: {
    slug: "marketplaces",
    number: "04",
    shortName: "Marketplaces",
    eyebrow: "MERCADO LIVRE, SHOPEE, AMAZON E TIKTOK SHOP",
    title: "Marketplace exige",
    accent: "operação, não improviso.",
    description:
      "Organizamos catálogo, anúncios, dados e rotinas para transformar marketplaces em canais mais previsíveis e sustentáveis.",
    metaDescription:
      "Gestão e estruturação de marketplaces com catálogo, anúncios, operação e dados para Mercado Livre, Shopee, Amazon e TikTok Shop.",
    heroPoints: ["Catálogo organizado", "Anúncios mais claros", "Operação acompanhada"],
    problemTitle: "Vender mais pode aumentar o problema quando a operação não acompanha.",
    problemIntro:
      "Nos marketplaces, catálogo, preço, prazo, reputação e atendimento funcionam juntos. Um anúncio forte não compensa uma operação desorganizada por muito tempo.",
    problems: [
      {
        title: "Catálogo inconsistente",
        text: "Títulos, atributos, fotos e variações não seguem um padrão e dificultam busca, comparação e manutenção.",
      },
      {
        title: "Anúncios sem prioridade",
        text: "A equipe distribui esforço igualmente, sem identificar produtos estratégicos, gargalos ou oportunidades.",
      },
      {
        title: "Operação reativa",
        text: "Prazos, estoque, dúvidas e problemas são tratados apenas quando já ameaçam a experiência e a reputação.",
      },
    ],
    deliverables: [
      "Diagnóstico da conta e da operação",
      "Organização de catálogo e atributos",
      "Padronização de títulos e descrições",
      "Direção de imagens e criativos",
      "Estratégia de anúncios e produtos prioritários",
      "Acompanhamento de preço, prazo e reputação",
      "Integrações com ERP quando viáveis",
      "Rotinas operacionais e indicadores",
      "Plano de crescimento por canal",
    ],
    process: [
      {
        number: "01",
        title: "Leitura da operação",
        text: "Analisamos conta, catálogo, estoque, prazos, reputação, anúncios e ferramentas já utilizadas.",
      },
      {
        number: "02",
        title: "Organização",
        text: "Definimos padrões, prioridades, responsáveis e rotinas para reduzir retrabalho e risco.",
      },
      {
        number: "03",
        title: "Execução",
        text: "Ajustamos catálogo, comunicação, campanhas e processos conforme o escopo definido.",
      },
      {
        number: "04",
        title: "Gestão por dados",
        text: "Acompanhamos os indicadores que ajudam a decidir preço, investimento, estoque e próximos produtos.",
      },
    ],
    audience: [
      "Empresas começando a vender em marketplaces",
      "Operações com catálogo desorganizado",
      "Lojas que vendem, mas perdem eficiência e margem",
      "Negócios que precisam integrar comercial e operação",
    ],
    faqs: [
      {
        question: "Vocês atendem quais marketplaces?",
        answer:
          "Trabalhamos principalmente com Mercado Livre, Shopee, Amazon e TikTok Shop. O escopo considera as regras e recursos disponíveis em cada canal.",
      },
      {
        question: "Vocês cadastram todos os produtos?",
        answer:
          "O cadastro e a revisão podem fazer parte do projeto. Antes, avaliamos volume, qualidade das informações, variações e prioridade comercial.",
      },
      {
        question: "A gestão inclui anúncios patrocinados?",
        answer:
          "Pode incluir. A estratégia de mídia é conectada ao catálogo, à margem, ao estoque e à capacidade operacional.",
      },
      {
        question: "É possível integrar com ERP?",
        answer:
          "Sim, quando o ERP e o marketplace oferecem APIs ou conectores adequados. A integração é avaliada tecnicamente antes de entrar no escopo.",
      },
    ],
    whatsappMessage:
      "Olá, Ned! Vi a página de marketplaces e quero analisar minha operação e meus anúncios.",
    related: ["automacoes", "trafego-pago"],
  },
};

export function getService(slug: string) {
  return services[slug as ServiceSlug];
}
