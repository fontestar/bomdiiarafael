import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { imageAssets, slideNames, videoSources } from './content';

const TOTAL_SLIDES = slideNames.length;

function Arrow({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return (
    <svg className={`arrow-icon arrow-icon-${direction}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2v28M2 16h28M6.1 6.1l19.8 19.8M25.9 6.1 6.1 25.9" stroke="currentColor" strokeWidth="3.4" />
    </svg>
  );
}

function SectionLabel({ number, children, detail }: { number: string; children: ReactNode; detail?: string }) {
  return (
    <div className="section-label">
      <div><span className="section-number">{number}</span><span className="section-dash" />{children}</div>
      {detail && <span className="section-detail">{detail}</span>}
    </div>
  );
}

function ScriptBlock({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <section className={`script-block ${className}`} aria-label={label}>
      <h3 className="script-label">{label}</h3>
      <div className="script-copy">{children}</div>
    </section>
  );
}

function IntroductionSlide() {
  return (
    <section className="slide introduction-slide" aria-labelledby="slide-title-1">
      <span className="sr-only">Ilustração de pessoas ajudando outras em uma rua escura durante um apagão.</span>
      <div className="introduction-layout">
        <div className="introduction-heading">
          <p className="intro-kicker"><span /> SOCIOLOGIA + FILOSOFIA / INTRODUÇÃO DO TEMA</p>
          <h1 id="slide-title-1" className="intro-title">COMO AS<br />PESSOAS SE<br />COMPORTAM<br />DIANTE DO<br /><span>CAOS?</span></h1>
        </div>
        <div className="introduction-script script-stack">
          <ScriptBlock label="Afirmação"><p>Diante do caos, as pessoas podem reagir de maneiras muito diferentes.</p></ScriptBlock>
          <ScriptBlock label="Por exemplo"><p>Em um apagão, algumas pessoas ajudam quem está por perto, enquanto outras pensam primeiro em garantir o próprio conforto.</p></ScriptBlock>
          <ScriptBlock label="Objetivo"><p>Apresentar a questão central: por que reagimos de maneiras diferentes diante da mesma situação?</p></ScriptBlock>
        </div>
      </div>
    </section>
  );
}

function PhilosophySlide() {
  return (
    <section className="slide editorial-slide philosophy-script-slide" aria-labelledby="slide-title-2">
      <SectionLabel number="02" detail="FILOSOFIA / O SUJEITO">CONCEITOS FILOSÓFICOS</SectionLabel>
      <div className="philosophy-script-layout">
        <div className="philosophy-script-main">
          <h2 id="slide-title-2" className="display-title philosophy-heading">CONCEITOS<br /><span>FILOSÓFICOS.</span></h2>
          <div className="script-stack">
            <ScriptBlock label="Afirmação"><p>Mesmo em situações difíceis, nossas escolhas envolvem liberdade e responsabilidade.</p></ScriptBlock>
            <ScriptBlock label="Por exemplo"><p>Em uma emergência, uma pessoa pode escolher ajudar alguém desconhecido, mesmo que ninguém esteja obrigando-a a fazer isso.</p></ScriptBlock>
            <ScriptBlock label="Conceitos"><p>Liberdade de escolha, responsabilidade moral e individualismo.</p></ScriptBlock>
          </div>
        </div>
        <figure className="framed-photo philosophy-photo">
          <img src={imageAssets.care} alt="Ilustração de uma pessoa ajudando uma pessoa idosa a atravessar a rua." />
          <figcaption>IMAGEM ILUSTRATIVA / CRÉDITO EM FONTES</figcaption>
        </figure>
      </div>
    </section>
  );
}

function getVideoEmbed(source: string) {
  try {
    const url = new URL(source, window.location.origin);
    const host = url.hostname.replace(/^www\./, '');
    const time = url.searchParams.get('t') || url.searchParams.get('start');
    const parts = time?.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    const seconds = time && /^\d+$/.test(time) ? Number(time) : parts ? Number(parts[1] || 0) * 3600 + Number(parts[2] || 0) * 60 + Number(parts[3] || 0) : 0;
    const end = url.searchParams.get('end');
    const params = new URLSearchParams();
    if (seconds > 0) params.set('start', String(seconds));
    if (end && /^\d+$/.test(end) && Number(end) > seconds) params.set('end', end);
    const query = params.toString();
    const playerParams = query ? `?${query}` : '';
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}${playerParams}` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}${playerParams}` : null;
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.match(/(?:video\/)?(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function VideoSpace({ label, source, variant, detail }: { label: string; source: string; variant: 'light' | 'dark' | 'film'; detail?: string }) {
  const embed = source ? getVideoEmbed(source) : null;
  const isVideoFile = /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(source);
  const youtubeId = embed?.match(/^https:\/\/www\.youtube-nocookie\.com\/embed\/([^?]+)/)?.[1];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPlayer = () => {
    setIsOpen(true);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  const playerSrc = embed ? `${embed}${embed.includes('?') ? '&' : '?'}autoplay=1&playsinline=1` : '';

  return (
    <div className={`video-space video-space-${variant}`}>
      {embed || isVideoFile ? (
        <>
          <button className="video-trigger" type="button" onClick={openPlayer} aria-label={`Assistir ${label}`}>
            {youtubeId && <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />}
            <span className="video-play" aria-hidden="true"><span /></span>
          </button>
          <dialog className="video-dialog" ref={dialogRef} onClose={() => setIsOpen(false)} aria-label={label}>
            <div className="video-dialog-heading">
              <div><span>ASSISTIR</span><h3>{label}</h3>{detail && <p>{detail}</p>}</div>
              <button type="button" className="video-close" onClick={() => dialogRef.current?.close()} aria-label="Fechar vídeo">×</button>
            </div>
            <div className="video-player">
              {isOpen && (embed ? (
                <iframe src={playerSrc} title={label} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              ) : (
                <video src={source} controls autoPlay playsInline preload="metadata" aria-label={label} />
              ))}
            </div>
            <a className="video-external" href={source} target="_blank" rel="noreferrer">ABRIR VÍDEO EM NOVA ABA <span>↗</span></a>
          </dialog>
        </>
      ) : source ? (
        <a className="video-placeholder video-link" href={source} target="_blank" rel="noreferrer">
          <span className="play-symbol" aria-hidden="true"><span /></span>
          <strong>ABRIR VÍDEO</strong><small>em uma nova aba</small>
        </a>
      ) : (
        <div className="video-placeholder" aria-label={`Espaço reservado: ${label}`}>
          <span className="play-symbol" aria-hidden="true"><span /></span>
          <strong>LINK DO VÍDEO A INSERIR</strong>
          {variant === 'film' && <small>imagem ilustrativa</small>}
        </div>
      )}
    </div>
  );
}

function Flag({ country }: { country: 'japan' | 'brazil' }) {
  return country === 'japan' ? (
    <svg className="flag" viewBox="0 0 30 20" aria-label="Japão" role="img"><rect width="30" height="20" fill="#fff" /><circle cx="15" cy="10" r="5" fill="#c71930" /></svg>
  ) : (
    <svg className="flag" viewBox="0 0 30 20" aria-label="Brasil" role="img"><rect width="30" height="20" fill="#208448" /><path d="M15 2.2 27 10 15 17.8 3 10Z" fill="#f4d345" /><circle cx="15" cy="10" r="4.3" fill="#25477b" /></svg>
  );
}

function SocietySlide() {
  return (
    <section className="slide editorial-slide society-script-slide" aria-labelledby="slide-title-3">
      <SectionLabel number="03" detail="SOCIOLOGIA / O COLETIVO">CONCEITOS SOCIOLÓGICOS</SectionLabel>
      <h2 id="slide-title-3" className="display-title society-heading">ÉMILE <span>DURKHEIM.</span></h2>
      <div className="society-script-grid">
        <ScriptBlock label="Afirmação" className="society-statement"><p>A sociedade influencia nosso comportamento por meio de regras, valores e costumes, que podem variar entre diferentes culturas.</p></ScriptBlock>
        <ScriptBlock label="Por exemplo" className="society-comparison">
          <p className="comparison-title">Japão <Flag country="japan" /> <span>x</span> Brasil <Flag country="brazil" /></p>
          <div className="country-grid">
            <div className="country-example">
              <p><strong>Japão:</strong> vídeo mostrando como as pessoas reagem diante de uma situação de emergência.</p>
              <VideoSpace label="Vídeo do Japão" source={videoSources.japan} variant="light" />
            </div>
            <div className="country-example">
              <p><strong>Brasil:</strong> vídeo mostrando como as pessoas reagem diante de uma situação semelhante.</p>
              <VideoSpace label="Vídeo do Brasil" source={videoSources.brazil} variant="dark" detail="Trecho: 1:00 a 1:46" />
              <span className="clip-label">TRECHO: 1:00 A 1:46</span>
            </div>
          </div>
        </ScriptBlock>
        <ScriptBlock label="Ligação com Durkheim" className="society-connection"><p>Os fatos sociais são maneiras de agir, pensar e sentir que existem na sociedade e influenciam os indivíduos. A comparação permite observar como normas sociais, valores culturais e preparação para emergências podem influenciar as reações coletivas.</p></ScriptBlock>
        <ScriptBlock label="Conceitos" className="society-concepts"><p>Sociedade, normas sociais, fatos sociais, consciência coletiva e anomia.</p></ScriptBlock>
        <ScriptBlock label="Observação" className="society-observation"><p>a comparação não deve afirmar que todos os japoneses ou brasileiros agem da mesma forma. O objetivo é analisar os casos apresentados, considerando também as circunstâncias de cada situação.</p></ScriptBlock>
      </div>
    </section>
  );
}

function ArtSlide() {
  return (
    <section className="slide editorial-slide art-script-slide" aria-labelledby="slide-title-4">
      <SectionLabel number="04" detail="CINEMA / POLÍTICA / SOCIEDADE">A VIDA IMITA A ARTE</SectionLabel>
      <h2 id="slide-title-4" className="display-title art-heading">A VIDA IMITA <span>A ARTE.</span></h2>
      <div className="art-script-layout">
        <div className="art-case script-stack">
          <ScriptBlock label="Afirmação"><p>Em uma crise coletiva, decisões individuais e interesses políticos podem entrar em conflito com as necessidades da sociedade.</p></ScriptBlock>
          <ScriptBlock label="Por exemplo">
            <p>Brasil durante a pandemia de COVID-19.</p>
            <p className="group-text">Em 2020, durante o governo de Jair Bolsonaro, houve demora nas negociações para a aquisição da vacina da Pfizer. A empresa apresentou propostas em agosto daquele ano, mas não houve aceitação nem rejeição conclusiva inicial, porque o atual presidente da República <em>individualmente</em> estava incerto sobre a eficácia da vacina, entrando em conflito com o desejo de milhões de brasileiros em obter a vacina. O contrato foi concretizado em março de 2021.</p>
            <p>O caso permite discutir como decisões políticas durante uma crise sanitária podem afetar os interesses coletivos, como a necessidade de acesso à vacinação.</p>
          </ScriptBlock>
          <p className="review-note"><strong>NOTA DE REVISÃO:</strong> a fonte confirma as datas, mas não estabelece a motivação individual atribuída no roteiro. A expressão “atual presidente” também precisa de revisão temporal.</p>
        </div>
        <div className="art-reference script-stack">
          <ScriptBlock label="Referências artísticas" className="film-reference">
            <div className="film-example">
              <p className="film-example-title">Não olhe pra cima.</p>
              <VideoSpace label="Trailer de Não Olhe para Cima" source={videoSources.film} variant="film" />
            </div>
            <div className="film-example">
              <p className="film-example-title">Guerra Mundial Z.</p>
              <VideoSpace label="Trailer de Guerra Mundial Z" source={videoSources.worldWarZ} variant="film" />
            </div>
          </ScriptBlock>
          <ScriptBlock label="Por que essas referências?"><p>Os filmes mostram sociedades diante de ameaças coletivas, enquanto interesses políticos, econômicos e midiáticos influenciam as respostas aos problemas.</p></ScriptBlock>
          <ScriptBlock label="Relação com o tema"><p>quando interesses particulares ganham prioridade, decisões importantes para o bem coletivo podem ser prejudicadas.</p></ScriptBlock>
          <ScriptBlock label="Pergunta para a turma" className="class-question"><p>Até que ponto as decisões de quem está no poder devem priorizar os interesses coletivos durante uma crise?</p></ScriptBlock>
        </div>
      </div>
    </section>
  );
}

function ConclusionSlide() {
  return (
    <section className="slide editorial-slide conclusion-script-slide" aria-labelledby="slide-title-5">
      <SectionLabel number="05" detail="CONCLUSÃO / SOCIEDADE ATUAL">CONCLUSÃO E SOCIEDADE ATUAL</SectionLabel>
      <div className="conclusion-script-layout">
        <div className="conclusion-script-main">
          <h2 id="slide-title-5" className="display-title conclusion-heading">CONCLUSÃO<br /><span>E SOCIEDADE ATUAL.</span></h2>
          <div className="script-stack">
            <ScriptBlock label="Afirmação"><p>A maneira como enfrentamos o caos pode fortalecer ou prejudicar a convivência social.</p></ScriptBlock>
            <ScriptBlock label="Por exemplo"><p>Em desastres naturais, a mobilização de voluntários demonstra como a solidariedade e a cooperação podem ajudar uma comunidade. Por outro lado, a desinformação, o preconceito e a desumanização de grupos podem contribuir para perseguições e até genocídios.</p></ScriptBlock>
            <ScriptBlock label="Conclusão" className="conclusion-final"><p>O caos não faz todos agirem da mesma maneira. Nossas atitudes resultam de escolhas individuais, influências sociais e das circunstâncias em que estamos.</p></ScriptBlock>
          </div>
        </div>
        <div className="conclusion-images">
          <figure className="framed-photo"><img src={imageAssets.solidarity} alt="Ilustração de voluntários carregando caixas de doações." /><figcaption>APOIO COMUNITÁRIO</figcaption></figure>
          <figure className="framed-photo"><img src={imageAssets.tension} alt="Ilustração de pessoas diante de uma linha de policiais." /><figcaption>TENSÕES COLETIVAS</figcaption></figure>
        </div>
      </div>
    </section>
  );
}

const slides = [IntroductionSlide, PhilosophySlide, SocietySlide, ArtSlide, ConclusionSlide];
const themes = ['hero', 'paper', 'red', 'night', 'paper'];

function CreditsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog className="credits-dialog" ref={dialogRef} onClose={onClose} aria-labelledby="credits-title">
      <div className="credits-top"><span>NOTAS DE EDIÇÃO / 01</span><button type="button" onClick={onClose} aria-label="Fechar fontes e créditos">×</button></div>
      <h2 id="credits-title">FONTES &<br /><em>CRÉDITOS.</em></h2>
      <p>As imagens foram geradas por IA para esta apresentação. São ilustrações e não registros dos exemplos ou vídeos citados no roteiro.</p>
      <h3>ARTE E CONTEXTO</h3>
      <p>A imagem do céu no espaço para a cena do filme foi gerada por IA. É uma ilustração original, não uma cena ou um pôster oficial de <em>Não olhe pra cima</em>.</p>
      <p>A fonte do Senado registra as propostas de agosto de 2020 e o contrato de março de 2021. Ela não estabelece que a demora ocorreu por uma incerteza individual do presidente; esse trecho do roteiro precisa de fonte específica. A expressão “atual presidente” também deve ser revista em relação à data da apresentação.</p>
      <p><a href="https://www12.senado.leg.br/noticias/materias/2021/05/13/representante-da-pfizer-confirma-governo-nao-respondeu-ofertas-feitas-em-agosto-de-2020" target="_blank" rel="noreferrer">Senado Federal: propostas da Pfizer e contrato de 2021 ↗</a></p>
      <h3>VÍDEOS</h3>
      <ul>
        <li><a href={videoSources.japan} target="_blank" rel="noreferrer">Japão: Euronews <span>↗</span></a></li>
        <li><a href={videoSources.brazil} target="_blank" rel="noreferrer">Brasil: Plano de Evacuação <span>↗</span></a></li>
        <li><a href={videoSources.film} target="_blank" rel="noreferrer">Não Olhe para Cima: Trailers em Português <span>↗</span></a></li>
        <li><a href={videoSources.worldWarZ} target="_blank" rel="noreferrer">Guerra Mundial Z: TeleFilms Plus <span>↗</span></a></li>
      </ul>
      <h3>TIPOGRAFIA</h3>
      <p>Archivo Black, Space Grotesk e Instrument Serif, via <a href="https://fonts.google.com/" target="_blank" rel="noreferrer">Google Fonts ↗</a>.</p>
    </dialog>
  );
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const viewportRef = useRef<HTMLElement>(null);
  const Slide = slides[current];

  const goToSlide = useCallback((change: number) => {
    setCurrent((previous) => Math.max(0, Math.min(TOTAL_SLIDES - 1, previous + change)));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (creditsOpen || document.querySelector('dialog[open]') || event.altKey || event.ctrlKey || event.metaKey || target?.closest('input, textarea, select, video, iframe, [contenteditable="true"]')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToSlide(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [creditsOpen, goToSlide]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = 0;
    const update = () => setCanScrollMore(viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop > 2);
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    viewport.addEventListener('scroll', update);
    const timer = window.setTimeout(update, 450);
    update();
    return () => { observer.disconnect(); viewport.removeEventListener('scroll', update); window.clearTimeout(timer); };
  }, [current]);

  return (
    <div className={`app-shell theme-${themes[current]}`} style={{ '--hero-image': `url("${imageAssets.hero}")`, '--film-image': `url("${imageAssets.filmIllustration}")` } as CSSProperties}>
      <header className="site-header">
        <div className="masthead"><BrandMark /><span>VIVA A<br />DEMOCRACIA!</span></div>
        <p className="header-center">UM EXERCÍCIO DE PENSAMENTO COLETIVO</p>
        <div className="header-right"><span>SOCIOLOGIA <i>+</i> FILOSOFIA</span><button type="button" onClick={() => setCreditsOpen(true)}>FONTES <span>&</span> CRÉDITOS <span>↗</span></button></div>
      </header>

      <main className="slide-viewport" aria-label="Apresentação de Sociologia e Filosofia" ref={viewportRef} tabIndex={0}>
        <div className="slide-frame" key={current} role="region" aria-roledescription="slide" aria-label={`${current + 1} de ${TOTAL_SLIDES}: ${slideNames[current]}`}>
          <Slide />
        </div>
      </main>

      <footer className="deck-footer">
        <div className="deck-counter"><span className="footer-label">APRESENTAÇÃO</span><span className="counter-number">{String(current + 1).padStart(2, '0')} <span>/</span> <span className="counter-total">{String(TOTAL_SLIDES).padStart(2, '0')}</span></span></div>
        <div className="deck-progress"><div className="progress-top"><span>{canScrollMore ? 'ROLE PARA LER ↓' : slideNames[current]}</span><span className="keyboard-hint">USE AS SETAS DO TECLADO</span></div><div className="progress-track"><span style={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }} /></div></div>
        <nav className="deck-controls" aria-label="Navegação da apresentação">
          <button className="control control-prev" type="button" onClick={() => goToSlide(-1)} disabled={current === 0} aria-label="Slide anterior"><span className="control-icon"><Arrow direction="left" /></span><span className="control-text">ANTERIOR</span></button>
          <button className="control control-next" type="button" onClick={() => goToSlide(1)} disabled={current === TOTAL_SLIDES - 1} aria-label="Próximo slide"><span className="control-text">PRÓXIMO</span><span className="control-icon"><Arrow /></span></button>
        </nav>
      </footer>
      <p className="sr-only" role="status" aria-live="polite">Slide {current + 1} de {TOTAL_SLIDES}: {slideNames[current]}</p>
      <CreditsDialog open={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </div>
  );
}