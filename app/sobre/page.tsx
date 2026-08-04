import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "./about-story.module.css";

export const metadata: Metadata = {
  title: "Sobre Andrey — a história por trás da NED Marketing",
  description:
    "Conheça a trajetória de Andrey, criador da NED Marketing: atendimento, vendas, liderança, restaurantes, marketplaces e a construção de uma visão prática sobre marketing.",
  alternates: { canonical: "/sobre" },
};

const timeline = [
  {
    age: "16",
    label: "O PRIMEIRO TRABALHO",
    title: "Tudo começou no atendimento.",
    story:
      "Eu queria muito começar a trabalhar, e um tio me ajudou a conseguir uma oportunidade no McDonald’s. Logo na primeira semana, participei de vários treinamentos. Um deles, chamado Influenciadores de Vendas, despertou algo diferente em mim. Comecei a perceber que vender não era apenas oferecer um produto: era observar, entender a pessoa, comunicar valor e ajudar alguém a tomar uma decisão.",
    lesson: "Marketing começa antes da campanha. Começa na forma como uma pessoa é recebida, ouvida e orientada.",
  },
  {
    age: "17",
    label: "TREINAMENTO E LIDERANÇA",
    title: "Ensinar também era aprender.",
    story:
      "Eu me destaquei em vendas e atendimento e, aos 17 anos, passei a atuar como gerente de treinamento. Além de executar meu trabalho, precisava ajudar outras pessoas a entender processos, ganhar confiança e atender melhor. Foi uma fase importante para aprender que comunicação não é apenas falar bem: é conseguir tornar uma ideia clara para pessoas diferentes.",
    lesson: "Um processo só funciona de verdade quando as pessoas entendem por que ele existe e conseguem executá-lo.",
  },
  {
    age: "18",
    label: "OPERAÇÃO E RESPONSABILIDADE",
    title: "A promessa precisava funcionar na prática.",
    story:
      "Aos 18 anos, tornei-me gerente de plantão. Passei a lidar com equipe, organização, metas, experiência do cliente e problemas que precisavam ser resolvidos rapidamente. Ainda muito novo, entendi que uma boa comunicação perde valor quando a operação não consegue cumprir o que foi prometido.",
    lesson: "Não basta atrair alguém. A empresa precisa estar preparada para atender e entregar.",
  },
  {
    age: "19",
    label: "UMA NOVA DIREÇÃO",
    title: "Eu queria crescer e encontrar meu caminho.",
    story:
      "Aos 19 anos, eu buscava aumentar minha renda e ter mais possibilidades profissionais. Trabalhei no Outback e, depois, passei por outros restaurantes, como Abbraccio e Steak Factory. O ambiente mudou, mas continuei desenvolvendo habilidades que mais tarde se tornariam fundamentais para o marketing: leitura de pessoas, relacionamento, percepção de valor e experiência.",
    lesson: "Cada atendimento era uma oportunidade de entender comportamento, expectativa e decisão.",
  },
  {
    age: "→",
    label: "A CONVERSA QUE MUDOU O CAMINHO",
    title: "Uma oportunidade surgiu em uma mesa de restaurante.",
    story:
      "Foi trabalhando como garçom que aconteceu uma das conversas mais importantes da minha trajetória. Durante um atendimento comum, conheci um empresário. Sem nenhuma pretensão, aquela conversa terminou com um convite para trabalhar na empresa dele como analista de marketplace. Finalmente, eu estava perto da área em que desejava construir minha carreira.",
    lesson: "Oportunidades também nascem da maneira como tratamos as pessoas quando não esperamos nada em troca.",
  },
  {
    age: "NED",
    label: "MARKETPLACES E MARKETING",
    title: "A porta de entrada virou uma visão mais ampla.",
    story:
      "Comecei a trabalhar com catálogo, anúncios, vendas e operação em marketplaces. Ao mesmo tempo, comecei a cursar Marketing e passei a estudar não apenas as plataformas de venda, mas posicionamento, conteúdo, tráfego, comportamento do consumidor, experiência, conversão e atendimento. Quanto mais aprendia, mais percebia que essas áreas não deveriam funcionar separadas.",
    lesson: "Foi dessa união entre vendas, atendimento, operação e marketing que nasceu a forma como penso a NED.",
  },
];

const principles = [
  {
    number: "01",
    title: "Entender pessoas antes de escolher ferramentas",
    text: "Público, momento, necessidade e percepção de valor vêm antes do formato, da plataforma ou da tecnologia.",
  },
  {
    number: "02",
    title: "Conectar marketing à realidade da operação",
    text: "Campanha e conteúdo precisam considerar atendimento, capacidade de entrega e o que acontece depois do primeiro contato.",
  },
  {
    number: "03",
    title: "Transformar interesse em um próximo passo claro",
    text: "Atenção sozinha não sustenta crescimento. A pessoa precisa entender a oferta e saber o que fazer em seguida.",
  },
  {
    number: "04",
    title: "Aprender com cada execução",
    text: "Nem toda ação funciona perfeitamente na primeira tentativa. O importante é registrar, entender e melhorar a próxima decisão.",
  },
];

const people = [
  {
    number: "01",
    title: "Equipes que me ensinaram",
    text: "Liderar, treinar e trabalhar sob pressão me mostrou que resultado também depende de comunicação interna e responsabilidade.",
  },
  {
    number: "02",
    title: "Pessoas que abriram portas",
    text: "Minha trajetória mudou porque pessoas confiaram em mim e enxergaram potencial em momentos que pareciam comuns.",
  },
  {
    number: "03",
    title: "Profissionais que continuam por perto",
    text: "Durante essa jornada, conheci pessoas incríveis que contribuíram para minha evolução e continuam próximas até hoje.",
  },
];

export default function AboutPage() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>SOBRE / ANDREY E A NED</span>
          <h1>
            Minha história com marketing começou antes de eu saber que aquilo era <span>marketing.</span>
          </h1>
          <p className={styles.heroLead}>
            Olá, eu sou Andrey, tenho 23 anos e sou o criador da NED Marketing. Antes de trabalhar com campanhas, sites ou marketplaces, aprendi sobre vendas, pessoas, liderança e operação — e foi essa trajetória que formou a maneira como penso marketing hoje.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#trajetoria">
              Conhecer minha trajetória <ArrowRight size={17} />
            </a>
            <a className={styles.secondary} href="/portfolio">Ver trabalhos da NED</a>
          </div>
          <div className={styles.heroMeta}>
            <span>Andrey</span>
            <span>23 anos</span>
            <span>Criador da NED Marketing</span>
          </div>
        </div>

        <aside className={styles.monogramCard} aria-label="Andrey, criador da NED Marketing">
          <div className={styles.cardTop}>
            <span>ATENDIMENTO • VENDAS • MARKETING</span>
            <span>2026</span>
          </div>
          <div className={styles.monogram}>
            A<small>ANDREY / NED</small>
          </div>
          <div className={styles.cardBottom}>
            <span>SEM FOTO. SEM PERSONAGEM.</span>
            <strong>UMA HISTÓRIA REAL.</strong>
          </div>
        </aside>
      </section>

      <section className={styles.quoteBand}>
        <blockquote>
          Marketing não é apenas fazer alguém prestar atenção. É comunicar valor, conduzir uma decisão e garantir que a empresa esteja preparada para <span>cumprir o que prometeu.</span>
        </blockquote>
      </section>

      <section className={styles.timelineSection} id="trajetoria">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>MINHA TRAJETÓRIA</span>
            <h2 className={styles.sectionTitle}>Do primeiro atendimento ao nascimento da <span>NED.</span></h2>
          </div>
          <p>
            Minha entrada no marketing não aconteceu por um caminho linear. Cada trabalho acrescentou uma parte da visão que uso hoje para analisar marcas, ofertas, atendimento e oportunidades.
          </p>
        </div>

        <div className={styles.timeline}>
          {timeline.map((item) => (
            <article className={styles.timelineItem} key={`${item.age}-${item.title}`}>
              <div className={styles.timelineAge}>
                <strong>{item.age}</strong>
                <span>{item.label}</span>
              </div>
              <div className={styles.timelineStory}>
                <h3>{item.title}</h3>
                <p>{item.story}</p>
              </div>
              <aside className={styles.timelineLesson}>
                <span>O QUE FICOU DESSA FASE</span>
                <p>{item.lesson}</p>
              </aside>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.originWrap}>
        <section className={styles.originSection}>
          <div className={styles.originVisual} aria-hidden="true">
            <span className={styles.originWord}>NED</span>
            <div className={styles.originPath}>
              <span>Vendas</span>
              <span>Atendimento</span>
              <span>Operação</span>
              <span>Marketing</span>
            </div>
          </div>

          <div className={styles.originCopy}>
            <span className={styles.eyebrow}>POR QUE CRIEI A NED</span>
            <h2>Marketing precisa funcionar fora da <span>apresentação.</span></h2>
            <p>
              A NED nasceu da união entre tudo o que aprendi com vendas, atendimento, liderança, operação, marketplaces e marketing. Não acredito em marketing baseado apenas em quantidade de posts, tendências passageiras ou ferramentas usadas sem uma razão clara.
            </p>
            <p>
              Antes de recomendar conteúdo, campanha, site, tráfego ou automação, procuro entender o que a empresa vende, para quem vende, por que alguém deveria escolhê-la, onde as oportunidades estão sendo perdidas e o que precisa ser melhorado primeiro.
            </p>

            <div className={styles.principles}>
              {principles.map((principle) => (
                <div className={styles.principle} key={principle.number}>
                  <span>{principle.number}</span>
                  <div>
                    <strong>{principle.title}</strong>
                    <small>{principle.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className={styles.peopleWrap}>
        <section className={styles.peopleSection}>
          <div className={styles.peopleCopy}>
            <span className={styles.eyebrow}>PESSOAS FIZERAM PARTE DESSA JORNADA</span>
            <h2>Nenhuma trajetória é construída <span>sozinha.</span></h2>
            <p>
              Cada equipe, liderança, cliente, parceiro e conversa me ensinou algo sobre pessoas, negócios e comunicação. Durante esse caminho, conheci pessoas incríveis que contribuíram para minha evolução profissional e pessoal — e muitas delas continuam comigo até hoje.
            </p>
            <p>
              A NED carrega esses aprendizados. Ela não nasceu apenas de cursos ou ferramentas, mas das relações, responsabilidades e oportunidades que encontrei ao longo do caminho.
            </p>
            <div className={styles.signature}>
              <strong>Andrey</strong>
              <span>Criador da NED Marketing</span>
            </div>
          </div>

          <div className={styles.peopleBoard}>
            {people.map((item) => (
              <div className={styles.peopleNote} key={item.number}>
                <span>{item.number}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.finalSection}>
        <div>
          <span className={styles.eyebrow}>A NED HOJE</span>
          <h2>A NED não nasceu dentro de uma <span>agência.</span></h2>
        </div>
        <div>
          <p>
            Ela nasceu no atendimento, na operação, nas vendas e na vontade de entender por que algumas empresas conseguem transformar interesse em relacionamento enquanto outras perdem oportunidades pelo caminho.
          </p>
          <p>
            Hoje, uso esses aprendizados para ajudar marcas a comunicarem melhor o que fazem, organizarem sua presença e tomarem decisões de marketing com mais direção.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/analise-gratuita">
              Solicitar análise <ArrowRight size={17} />
            </a>
            <a className={styles.secondary} href="/portfolio">Ver trabalhos da NED</a>
          </div>
        </div>
      </section>
    </CommercialPage>
  );
}
