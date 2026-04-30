// ── Toggle day selection ──────────────────────────────────────────────────────
function toggleDay(btn) {
  btn.classList.toggle('active');
}

function getSelectedDays() {
  return [...document.querySelectorAll('.day-btn.active')].map(b => b.dataset.day);
}

// ── Exercise database ─────────────────────────────────────────────────────────
const EXERCISES = {
  aucun: {
    force:    ['Pompes', 'Tractions (assistées)', 'Dips sur chaise', 'Squat bulgare', 'Fentes avant', 'Gainage planche', 'Crunchs', 'Superman', 'Pont fessier', 'Pike push-up'],
    cardio:   ['Jumping jacks', 'Montées de genoux', 'Burpees', 'Squat sauté', 'Skipping', 'Course sur place', 'Bear crawl', 'Mountain climbers'],
    mobilite: ['Étirement quadriceps', 'Rotation hanches', 'Cat-cow', 'Pigeon yoga', 'Rotation épaules', 'Étirement mollets', 'Torsion dorsale', 'Hip flexor stretch']
  },
  basique: {
    force:    ['Curl biceps haltères', 'Développé épaules haltères', 'Rowing haltère', 'Squat haltères', 'Fentes haltères', 'Extension triceps', 'Élévations latérales', 'Deadlift haltères', 'Chest press sol', 'Shrugs'],
    cardio:   ['Corde à sauter', 'Burpees', 'Box step', 'Jumping jacks', 'Skipping rapide', 'Mountain climbers'],
    mobilite: ['Étirement complet', 'Foam roller dos', 'Rotation hanches', 'Étirement pectoraux', 'Pompes lentes', 'Étirements globaux']
  },
  salle: {
    force:    ['Développé couché barre', 'Squat barre', 'Soulevé de terre', 'Tractions lestées', 'Rowing barre', 'Développé militaire', 'Leg press', 'Curl pupitre', 'Extension triceps poulie', 'Tirage vertical', 'Pec deck', 'Leg curl', 'Leg extension', 'Calf raises'],
    cardio:   ['Tapis de course', 'Vélo elliptique', 'Rameur', 'Vélo stationnaire', 'StairMaster', 'HIIT tapis'],
    mobilite: ['Étirements complets', 'Foam roller', 'Yoga mobilité', 'Stretching global']
  }
};

// ── Program splits per objective & level ─────────────────────────────────────
const PROGRAMS = {
  perte: {
    debutant:      { split: ['Full body', 'Cardio', 'Full body', 'Repos actif'] },
    intermediaire: { split: ['Haut du corps', 'HIIT cardio', 'Bas du corps', 'Cardio modéré', 'Full body'] },
    avance:        { split: ['Push', 'HIIT', 'Pull', 'HIIT', 'Legs', 'Cardio'] }
  },
  muscle: {
    debutant:      { split: ['Full body A', 'Full body B', 'Full body C'] },
    intermediaire: { split: ['Pectoraux/Triceps', 'Dos/Biceps', 'Épaules/Trapèzes', 'Jambes/Fessiers'] },
    avance:        { split: ['Push', 'Pull', 'Legs', 'Push+', 'Pull+', 'Legs+'] }
  },
  cardio: {
    debutant:      { split: ['Cardio léger', 'Renfo léger', 'Cardio modéré', 'Mobilité'] },
    intermediaire: { split: ['Endurance', 'Fractionné', 'Renfo', 'Endurance longue', 'HIIT'] },
    avance:        { split: ['Seuil lactique', 'Fractionné court', 'Renfo fonctionnel', 'Endurance longue', 'HIIT avancé', 'Récup active'] }
  },
  forme: {
    debutant:      { split: ['Full body doux', 'Cardio', 'Mobilité', 'Full body'] },
    intermediaire: { split: ['Renfo', 'Cardio', 'Mobilité', 'Renfo', 'Cardio'] },
    avance:        { split: ['Fonctionnel', 'Cardio', 'Mobilité avancée', 'Fonctionnel', 'HIIT', 'Récup'] }
  },
  force: {
    debutant:      { split: ['Full body force', 'Full body force', 'Mobilité'] },
    intermediaire: { split: ['Squat/Jambes', 'Développé/Pecs', 'Deadlift/Dos', 'Overhead/Épaules'] },
    avance:        { split: ['Squat max', 'Développé max', 'Deadlift max', 'Overhead press', 'Accessoires'] }
  }
};

// ── Sets / reps / rest config ─────────────────────────────────────────────────
function getSetsReps(objectif, type) {
  const configs = {
    perte:   { force: { series: '3', reps: '15-20', repos: '45s'    }, cardio: { series: '4', reps: '30s effort / 15s repos', repos: '—'   } },
    muscle:  { force: { series: '4', reps: '8-12',  repos: '90s'    }, cardio: { series: '3', reps: '20 reps',                repos: '45s'  } },
    forme:   { force: { series: '3', reps: '12-15', repos: '60s'    }, cardio: { series: '3', reps: '40s effort',             repos: '20s'  } },
    force:   { force: { series: '5', reps: '3-6',   repos: '3-5min' }, cardio: { series: '3', reps: '10 reps',                repos: '60s'  } },
    cardio:  { force: { series: '3', reps: '15 reps',repos: '45s'   }, cardio: { series: '5', reps: '45s effort / 15s repos', repos: '—'   } }
  };
  return configs[objectif]?.[type] || { series: '3', reps: '12', repos: '60s' };
}

// ── Determine day type from split ─────────────────────────────────────────────
function getDayType(dayName, objectif, niveau) {
  const prog = PROGRAMS[objectif]?.[niveau];
  if (!prog) return 'Full body';
  const allDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const idx = allDays.indexOf(dayName) % prog.split.length;
  return prog.split[idx] || 'Full body';
}

// ── Build exercise list for a day ─────────────────────────────────────────────
function getExercicesForDay(dayType, equipement, objectif, duree) {
  const eq = EXERCISES[equipement] || EXERCISES.salle;
  const nb = duree <= 30 ? 4 : duree <= 45 ? 5 : duree <= 60 ? 6 : 8;

  const d = dayType.toLowerCase();
  const isCardio   = d.includes('cardio') || d.includes('hiit') || d.includes('endurance') || d.includes('fractionné') || d.includes('seuil');
  const isMobilite = d.includes('mobilité') || d.includes('récup') || d.includes('yoga');
  const isRepos    = d.includes('repos');

  if (isRepos) return null;

  let pool, type;
  if (isCardio)        { pool = eq.cardio;   type = 'cardio';   }
  else if (isMobilite) { pool = eq.mobilite;  type = 'mobilite'; }
  else                 { pool = [...eq.force]; type = 'force';   }

  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, nb);
  const cfg = getSetsReps(objectif, type === 'force' ? 'force' : 'cardio');

  return shuffled.map(name => ({
    name,
    detail: type === 'mobilite'
      ? 'Tenir 30-45 secondes × 2 séries'
      : `${cfg.series} séries × ${cfg.reps} — Repos : ${cfg.repos}`
  }));
}

// ── Tag CSS class ─────────────────────────────────────────────────────────────
function getTagClass(dayType) {
  const d = dayType.toLowerCase();
  if (d.includes('hiit'))                                                      return 'tag-hiit';
  if (d.includes('cardio') || d.includes('endurance') || d.includes('fractionné') || d.includes('seuil')) return 'tag-cardio';
  if (d.includes('repos') || d.includes('récup'))                              return 'tag-repos';
  if (d.includes('mobilité') || d.includes('yoga'))                            return 'tag-mobilite';
  return 'tag-force';
}

// ── BMI helpers ───────────────────────────────────────────────────────────────
function calcIMC(poids, taille) {
  return (poids / Math.pow(taille / 100, 2)).toFixed(1);
}
function imcLabel(imc) {
  if (imc < 18.5) return 'Insuffisance pondérale';
  if (imc < 25)   return 'Poids normal ✓';
  if (imc < 30)   return 'Surpoids';
  return 'Obésité';
}

// ── Main generation function ──────────────────────────────────────────────────
function generateProgram() {
  const prenom     = document.getElementById('prenom').value.trim() || 'Athlète';
  const age        = parseInt(document.getElementById('age').value)     || 25;
  const poids      = parseFloat(document.getElementById('poids').value) || 70;
  const taille     = parseFloat(document.getElementById('taille').value)|| 175;
  const objectif   = document.getElementById('objectif').value;
  const niveau     = document.getElementById('niveau').value;
  const equipement = document.getElementById('equipement').value        || 'salle';
  const duree      = parseInt(document.getElementById('duree').value)   || 60;
  const jours      = getSelectedDays();

  if (!objectif)       { alert('Choisis un objectif !');           return; }
  if (!niveau)         { alert('Choisis ton niveau !');            return; }
  if (!jours.length)   { alert('Sélectionne au moins un jour !'); return; }

  const imc     = calcIMC(poids, taille);
  const imcText = imcLabel(parseFloat(imc));

  // Profile bar
  document.getElementById('profileBar').innerHTML = `
    <div class="profile-stat"><div class="val">${prenom}</div><div class="lbl">Athlète</div></div>
    <div class="profile-stat"><div class="val">${age}</div><div class="lbl">Ans</div></div>
    <div class="profile-stat"><div class="val">${poids}kg</div><div class="lbl">Poids</div></div>
    <div class="profile-stat"><div class="val">${imc}</div><div class="lbl">IMC — ${imcText}</div></div>
    <div class="profile-stat"><div class="val">${jours.length}j</div><div class="lbl">Par semaine</div></div>
    <div class="profile-stat"><div class="val">${duree}min</div><div class="lbl">Par séance</div></div>
  `;

  const tips = [
    `<strong>Semaine 1 — Mise en route :</strong> Concentre-toi sur la technique plutôt que la charge. Note tes performances pour suivre ta progression.`,
    `<strong>Semaine 2 — Progression :</strong> Augmente légèrement les charges ou réduis les temps de repos de 10 secondes. Ton corps s'adapte.`,
    `<strong>Semaine 3 — Intensification :</strong> Pousse les séries jusqu'à l'échec sur la dernière répétition. C'est là que la progression se fait.`,
    `<strong>Semaine 4 — Décharge :</strong> Réduis le volume de 30-40%. La récupération est aussi importante que l'entraînement.`
  ];

  const allDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  let html = '';

  for (let week = 1; week <= 4; week++) {
    html += `
      <div class="week-title">SEMAINE <span>${week}/4</span></div>
      <div class="tip-box">${tips[week - 1]}</div>
      <div class="days-container">
    `;

    allDays.forEach(day => {
      const isTraining = jours.includes(day);
      const dayType    = isTraining ? getDayType(day, objectif, niveau) : 'Repos';
      const exercices  = isTraining ? getExercicesForDay(dayType, equipement, objectif, duree) : null;
      const tagClass   = getTagClass(dayType);

      html += `
        <div class="day-card">
          <div class="day-header">
            <span class="day-name">${day}</span>
            <span class="day-tag ${tagClass}">${dayType}</span>
          </div>
          <div class="day-body">
      `;

      if (!isTraining || !exercices) {
        html += `<div class="rest-day">😴 Récupération — Marche légère ou étirements</div>`;
      } else {
        exercices.forEach((ex, i) => {
          const num = String(i + 1).padStart(2, '0');
          html += `
            <div class="exercise">
              <span class="exercise-num">${num}</span>
              <div class="exercise-info">
                <div class="exercise-name">${ex.name}</div>
                <div class="exercise-detail">${ex.detail}</div>
              </div>
            </div>
          `;
        });
      }

      html += `</div></div>`;
    });

    html += `</div>`;
  }

  document.getElementById('programContent').innerHTML = html;

  const resultSection = document.getElementById('result');
  resultSection.classList.add('visible');
  setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}
