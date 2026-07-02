import { useEffect, useState } from 'react';
import logo from '../logo.png';

const DATA = {
  BWS: {
    label: 'BWS (Bevers, Welpen, Scouts)',
    tasks: [
      {
        id: 'leidinggeven',
        label: 'Leidinggeven aan de groep',
        competencies: [
          'Een vergadering leiden',
          'Taken delegeren aan anderen',
          'Een team motiveren en inspireren',
          'Beslissingen nemen onder druk',
          'Feedback geven aan teamleden',
          'Een activiteitenplanning maken',
          'Een coachinggesprek voeren',
          'Een evaluatiebijeenkomst leiden',
          'Een opkomst voorbereiden en organiseren'
        ]
      },
      {
        id: 'samenwerken',
        label: 'Samenwerken met anderen',
        competencies: [
          'Samenwerken met andere leiding',
          'Een groep begeleiden bij activiteiten',
          'Een veilige groepsdynamiek creëren',
          'Een groepsgesprek leiden',
          'Conflicten oplossen binnen de groep',
          'Een teamoverleg effectief leiden',
          'De groep aansturen tijdens activiteiten',
          'Een project coördineren met meerdere leiding',
          'Een hecht team bouwen en onderhouden'
        ]
      },
      {
        id: 'pedagogisch',
        label: 'Pedagogisch handelen',
        competencies: [
          'Individuele kinderen begeleiden',
          'Activiteiten aanpassen aan leeftijdsgroepen',
          'Een veilige en vertrouwde sfeer creëren',
          'Kinderen motiveren en enthousiasmeren',
          'Opbouwende complimenten geven',
          'Kinderen op een positieve manier corrigeren',
          'Kinderen coachen in hun ontwikkeling',
          'Kinderen actief betrekken bij keuzes',
          'Kinderen zelfstandigheid en verantwoordelijkheid geven'
        ]
      }
    ]
  },
  ER: {
    label: 'ER (Explorers, Roverscouts)',
    tasks: [
      {
        id: 'leidinggeven',
        label: 'Leidinggeven aan de groep',
        competencies: [
          'Een strategische vergadering leiden',
          'Complexe taken delegeren en monitoren',
          'Een team inspireren tot eigen initiatief',
          'Beslissingen nemen met oog op lange termijn',
          'Constructieve feedback geven en ontvangen',
          'Een meerjarenplanning opstellen',
          'Diepgaande coachinggesprekken voeren',
          'Een kritische evaluatie leiden',
          'Een kamp of groot evenement organiseren'
        ]
      },
      {
        id: 'samenwerken',
        label: 'Samenwerken met anderen',
        competencies: [
          'Samenwerken met meerdere teams',
          'Zelfsturende groepen begeleiden',
          'Een inclusieve en veilige omgeving waarborgen',
          'Een dialoog met de groep leiden',
          'Conflicten bemiddelen op groepsniveau',
          'Een intervisiebijeenkomst leiden',
          'De groep coachen naar meer eigenaarschap',
          'Een meervoudig project coördineren',
          'Een duurzaam team bouwen met oog voor diversiteit'
        ]
      },
      {
        id: 'pedagogisch',
        label: 'Pedagogisch handelen',
        competencies: [
          'Individuele jongeren begeleiden in hun groei',
          'Activiteiten differentiëren naar ontwikkelingsfase',
          'Een veilige leefomgeving creëren',
          'Jongeren motiveren tot zelfontplooiing',
          'Waarderende feedback geven',
          'Jongeren coachen bij tegenslagen',
          'Mentorschap bieden aan jongeren',
          'Jongeren betrekken bij beleidskeuzes',
          'Jongeren eigen verantwoordelijkheid geven'
        ]
      }
    ]
  }
};

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

function StarRating({ value, onChange }) {
  return (
    <div className="star-row" role="radiogroup" aria-label="score">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          className={`star-btn ${value >= n ? 'active' : ''}`}
          onClick={() => onChange(n)}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="progress-shell" aria-label="voortgang">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function RadarChart({ data, labels }) {
  const size = 220;
  const center = size / 2;
  const radius = 80;
  const points = data.map((score, index) => {
    const angle = (Math.PI / 2) + (2 * Math.PI * index) / data.length;
    const pointRadius = (score / 100) * radius;
    const x = center + Math.cos(angle) * pointRadius;
    const y = center - Math.sin(angle) * pointRadius;
    return `${x},${y}`;
  });

  return (
    <div className="radar-card">
      <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg">
        {[1, 2, 3, 4, 5].map((ring) => (
          <circle key={ring} cx={center} cy={center} r={(radius / 5) * ring} className="radar-ring" />
        ))}
        <polygon points={points.join(' ')} className="radar-polygon" />
        {labels.map((label, index) => {
          const angle = (Math.PI / 2) + (2 * Math.PI * index) / labels.length;
          const x = center + Math.cos(angle) * (radius + 22);
          const y = center - Math.sin(angle) * (radius + 22);
          return (
            <text key={label} x={x} y={y} className="radar-label">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function StartPage({ onStart, savedProgress }) {
  const [selected, setSelected] = useState(savedProgress?.type || 'BWS');
  const hasProgress = savedProgress?.answers && Object.keys(savedProgress.answers).length > 0;

  return (
    <div className="fade-in">
      <div className="hero">
        <div className="hero-brand">
          <img src={logo} alt="Scouting logo" className="hero-logo" />
        </div>
        <h1>Competentieroos</h1>
        <p>Beoordeel jezelf op 27 competenties en krijg snel inzicht in je sterke punten en ontwikkelkansen.</p>
      </div>

      <div className="panel panel-soft">
        <p className="intro-copy">Kies de groep die het best past bij jouw leidingservaring. Daarna ga je door 27 competenties en krijg je direct een overzicht van je sterke punten en ontwikkelkansen.</p>
        <p className="intro-copy">BWS is voor de jongere groepen binnen Scouting: Bevers, Welpen en Scouts. ER is voor de oudere groepen: Explorers en Roverscouts. Kies de optie die het best past bij de groep waarin jij werkt of leiding geeft.</p>
      </div>

      <div className="grid-2">
        {['BWS', 'ER'].map((key) => {
          const info = DATA[key];
          return (
            <label key={key} className={`choice-card ${selected === key ? 'selected' : ''}`}>
              <input
                type="radio"
                name="type"
                value={key}
                checked={selected === key}
                onChange={() => setSelected(key)}
              />
              <div>
                <strong>{info.label}</strong>
                <p>3 taken · 27 competenties</p>
              </div>
            </label>
          );
        })}
      </div>

      {hasProgress && (
        <div className="notice">
          Je hebt een vorige sessie. Klik op “Verder gaan” of “Opnieuw” om te starten.
        </div>
      )}

      <div className="actions">
        <button className="btn-primary" onClick={() => onStart(selected, false)}>
          {hasProgress ? 'Verder gaan' : 'Start vragenlijst'}
        </button>
        {hasProgress && (
          <button
            className="btn-secondary"
            onClick={() => {
              if (window.confirm('Weet je zeker dat je opnieuw wilt beginnen?')) {
                onStart(selected, true);
              }
            }}
          >
            Opnieuw starten
          </button>
        )}
      </div>
    </div>
  );
}

function Questionnaire({ type, initialAnswers, onComplete, onBack }) {
  const info = DATA[type];
  const allCompetencies = info.tasks.flatMap((task) => task.competencies);
  const total = allCompetencies.length;
  const flatItems = info.tasks.flatMap((task, taskIdx) =>
    task.competencies.map((comp, compIdx) => ({
      taskIdx,
      compIdx,
      taskId: task.id,
      taskLabel: task.label,
      label: comp,
      key: `${task.id}-${compIdx}`
    }))
  );

  const [answers, setAnswers] = useState(() => {
    const init = {};
    flatItems.forEach((item) => {
      init[item.key] = initialAnswers?.[item.key] || 0;
    });
    return init;
  });

  const [currentIdx, setCurrentIdx] = useState(() => {
    const idx = flatItems.findIndex((item) => (answers[item.key] || 0) === 0);
    return idx >= 0 ? idx : 0;
  });

  const current = flatItems[currentIdx];
  const answeredCount = Object.values(answers).filter((val) => val > 0).length;
  const task = info.tasks[current.taskIdx];

  function handleScore(val) {
    const next = { ...answers, [current.key]: val };
    setAnswers(next);
  }

  function goNext() {
    if (currentIdx < flatItems.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(answers);
    }
  }

  function goPrev() {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  }

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault();
        if ((answers[current?.key] || 0) > 0) goNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key >= '1' && event.key <= '5') {
        handleScore(Number(event.key));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answers, current, currentIdx]);

  return (
    <div className="fade-in">
      <div className="step-top">
        <div>
          <strong>{task.label}</strong>
          <span>Vraag {currentIdx + 1} van {total}</span>
        </div>
        <span>{Math.round((currentIdx / total) * 100)}%</span>
      </div>
      <ProgressBar current={currentIdx} total={total} />

      <div className="panel">
        <div className="badge">Taak {current.taskIdx + 1}</div>
        <h3>{current.label}</h3>
        <p>Geef jezelf een score:</p>
        <StarRating value={answers[current.key] || 0} onChange={handleScore} />
        <div className="actions between">
          <button className="btn-secondary" onClick={goPrev} disabled={currentIdx === 0}>
            ← Vorige
          </button>
          <button className="btn-primary" onClick={goNext} disabled={(answers[current.key] || 0) === 0}>
            {currentIdx === total - 1 ? 'Bekijk resultaten →' : 'Volgende →'}
          </button>
        </div>
      </div>

      <div className="footer-meta">
        <span>Gebruik ← → of 1 – 5 op je toetsenbord</span>
        <span>{answeredCount} / {total} beantwoord</span>
      </div>
    </div>
  );
}

function ResultsPage({ type, answers, onBack, onExport }) {
  const info = DATA[type];
  const tasks = info.tasks;
  const taskScores = tasks.map((task) => {
    const scores = task.competencies.map((_, ci) => answers[`${task.id}-${ci}`] || 0);
    const sum = scores.reduce((a, b) => a + b, 0);
    const max = task.competencies.length * 5;
    const pct = max > 0 ? Math.round((sum / max) * 100) : 0;
    return { label: task.label, pct };
  });
  const overallPct = Math.round(taskScores.reduce((a, item) => a + item.pct, 0) / taskScores.length);
  const radarLabels = tasks.map((task) => task.label.replace(/^.{1,8}\s/, ''));

  return (
    <div className="fade-in">
      <div className="hero small">
        <div className="eyebrow">🧭 Jouw competentieroos</div>
        <h2>{info.label}</h2>
        <p>Totaalscore <strong>{overallPct}%</strong></p>
      </div>

      <div className="panel">
        <RadarChart data={taskScores.map((item) => item.pct)} labels={radarLabels} />
      </div>

      <div className="grid-3">
        {taskScores.map((item, index) => (
          <div key={item.label} className={`result-card ${item.pct >= 70 ? 'good' : item.pct >= 45 ? 'warn' : 'bad'}`}>
            <div className="result-top">
              <span>{item.label}</span>
              <strong>{item.pct}%</strong>
            </div>
            <div className="mini-bar"><div style={{ width: `${item.pct}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={onBack}>← Terug naar vragen</button>
        <button className="btn-primary" onClick={() => onExport(type, answers)}>📄 Opslaan als PDF</button>
      </div>
    </div>
  );
}

function App() {
  const [step, setStep] = useState('start');
  const [type, setType] = useState('BWS');
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useLocalStorage('competentieroos_progress', null);
  const [exporting, setExporting] = useState(false);

  function handleStart(selectedType, reset) {
    setType(selectedType);
    if (reset) {
      const empty = {};
      DATA[selectedType].tasks.forEach((task) => {
        task.competencies.forEach((_, ci) => {
          empty[`${task.id}-${ci}`] = 0;
        });
      });
      setAnswers(empty);
      setSaved({ type: selectedType, answers: empty });
    } else if (saved?.type === selectedType && saved.answers) {
      setAnswers(saved.answers);
    } else {
      const empty = {};
      DATA[selectedType].tasks.forEach((task) => {
        task.competencies.forEach((_, ci) => {
          empty[`${task.id}-${ci}`] = 0;
        });
      });
      setAnswers(empty);
      setSaved({ type: selectedType, answers: empty });
    }
    setStep('question');
  }

  function handleQuestionComplete(finalAnswers) {
    setAnswers(finalAnswers);
    setSaved({ type, answers: finalAnswers });
    setStep('results');
  }

  function handleBackToQuestion() {
    setStep('question');
  }

  function handleExport(typeKey, currentAnswers) {
    setExporting(true);
    window.print();
    setTimeout(() => setExporting(false), 800);
  }

  return (
    <main className="page-shell">
      <section className="card">
        {step === 'start' && <StartPage onStart={handleStart} savedProgress={saved} />}
        {step === 'question' && (
          <Questionnaire
            type={type}
            initialAnswers={answers}
            onComplete={handleQuestionComplete}
            onBack={() => setStep('start')}
          />
        )}
        {step === 'results' && (
          <ResultsPage type={type} answers={answers} onBack={handleBackToQuestion} onExport={handleExport} />
        )}
      </section>
      {exporting && <div className="overlay">PDF wordt voorbereid…</div>}
    </main>
  );
}

export default App;
