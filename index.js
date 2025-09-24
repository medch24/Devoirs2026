import { firebaseConfig } from './firebase-config.js';

// Initialiser Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Données statiques
const STUDENTS = { "PEI1": ["Faysal", "Bilal", "Jad", "Manaf"], "PEI2": ["Ahmed", "Yasser", "Ali"] };
const HOMEWORK = { // Les devoirs seront lus de la BDD
    "2025-09-28": { "PEI1": {
        "Sciences": "Faire les exercices 1 et 2 page 14.",
        "Maths": "Faire les exercices 12-13 page 115.",
        "Anglais": "Workbook Page 16."
    }}
};

// Éléments du DOM
const classSelect = document.getElementById('classSelect');
const studentSelect = document.getElementById('studentSelect');
const dateSelect = document.getElementById('dateSelect');
const dailyView = document.getElementById('daily-view');

// --- Fonctions ---

function populateFilters() {
    dateSelect.valueAsDate = new Date();
    Object.keys(STUDENTS).forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls; opt.textContent = cls;
        classSelect.appendChild(opt);
    });
    classSelect.dispatchEvent(new Event('change'));
}

function populateStudents() {
    const classe = classSelect.value;
    const students = STUDENTS[classe] || [];
    studentSelect.innerHTML = '';
    students.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name; opt.textContent = name;
        studentSelect.appendChild(opt);
    });
}

async function renderDailyView() {
    const classe = classSelect.value;
    const student = studentSelect.value;
    const date = dateSelect.value;

    if (!classe || !student || !date) {
        dailyView.innerHTML = `<p class="muted">Veuillez sélectionner une classe, un élève et une date.</p>`;
        return;
    }

    // 1. Récupérer les devoirs
    const homework = HOMEWORK[date]?.[classe] || {};
    let homeworkHtml = '<h4>Devoirs :</h4>';
    if (Object.keys(homework).length > 0) {
        homeworkHtml += Object.entries(homework)
            .map(([subject, task]) => `<div class="subject"><strong>${subject}:</strong> ${task}</div>`)
            .join('');
    } else {
        homeworkHtml += '<p class="muted">Aucun devoir pour ce jour.</p>';
    }

    // 2. Récupérer les évaluations
    const docId = `${date}_${classe}_${student}`;
    const doc = await db.collection('evaluations').doc(docId).get();
    let evalHtml = `<h4>Évaluation de l'enseignant (${doc.exists ? doc.data().teacher : 'N/A'}) :</h4>`;
    if (doc.exists) {
        const data = doc.data();
        evalHtml += `
            <div class="eval-grid">
                <div><strong>Statut devoirs:</strong> ${data.statut || '-'}</div>
                <div><strong>Participation:</strong> ${data.participation || '-'}/7</div>
                <div><strong>Comportement:</strong> ${data.comportement || '-'}/7</div>
                <div class="eval-comment"><strong>Commentaire:</strong> ${data.commentaire || 'Aucun'}</div>
            </div>
        `;
    } else {
        evalHtml += '<p class="muted">Aucune évaluation disponible pour ce jour.</p>';
    }

    dailyView.innerHTML = homeworkHtml + '<hr style="margin: 20px 0; border-color: var(--border);">' + evalHtml;
}

// --- Écouteurs d'événements ---
classSelect.addEventListener('change', () => {
    populateStudents();
    renderDailyView();
});
studentSelect.addEventListener('change', renderDailyView);
dateSelect.addEventListener('change', renderDailyView);

// --- Initialisation ---
populateFilters();
renderDailyView();
