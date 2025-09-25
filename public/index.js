import { firebaseConfig } from './firebase-config.js';

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const STUDENTS = { "PEI1": ["Faysal", "Bilal", "Jad", "Manaf"], "PEI2": ["Ahmed", "Yasser", "Ali"] };
const HOMEWORK = { "2025-09-28": { "PEI1": { "Sciences": "Faire les exercices 1 et 2 page 14.", "Maths": "Faire les exercices 12-13 page 115.", "Anglais": "Workbook Page 16.", "Français": "Lire le chapitre 2." } } };

const classSelect = document.getElementById('classSelect'), studentSelect = document.getElementById('studentSelect');
const dateSelect = document.getElementById('dateSelect'), dailyView = document.getElementById('daily-view');

function populateFilters() {
    dateSelect.valueAsDate = new Date();
    Object.keys(STUDENTS).forEach(cls => { const opt = document.createElement('option'); opt.value = cls; opt.textContent = cls; classSelect.appendChild(opt); });
    classSelect.dispatchEvent(new Event('change'));
}

function populateStudents() {
    const classe = classSelect.value, students = STUDENTS[classe] || [];
    studentSelect.innerHTML = '';
    students.forEach(name => { const opt = document.createElement('option'); opt.value = name; opt.textContent = name; studentSelect.appendChild(opt); });
}

async function renderDailyView() {
    const classe = classSelect.value, student = studentSelect.value, date = dateSelect.value;
    if (!classe || !student || !date) { dailyView.innerHTML = `<p class="muted">Veuillez sélectionner une classe, un élève et une date.</p>`; return; }

    const homework = HOMEWORK[date]?.[classe] || {};
    let homeworkHtml = '<h4>Devoirs :</h4>';
    homeworkHtml += (Object.keys(homework).length > 0) ? Object.entries(homework).map(([sub, task]) => `<div class="subject" style="padding:10px; margin-bottom:5px;"><strong>${sub}:</strong> ${task}</div>`).join('') : '<p class="muted">Aucun devoir pour ce jour.</p>';
    
    const docId = `${date}_${classe}_${student}`;
    const doc = await db.collection('evaluations').doc(docId).get();
    let evalHtml = `<h4>Évaluation de l'enseignant :</h4>`;
    if (doc.exists) {
        const data = doc.data();
        evalHtml += `<div class="eval-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Statut devoirs:</strong> ${data.statut || '-'}</div>
            <div><strong>Participation:</strong> ${data.participation || '-'}/7</div>
            <div><strong>Comportement:</strong> ${data.comportement || '-'}/7</div>
            <div style="grid-column: 1 / -1;"><strong>Commentaire (${data.teacher}):</strong> ${data.commentaire || 'Aucun'}</div>
        </div>`;
    } else {
        evalHtml += '<p class="muted">Aucune évaluation disponible pour ce jour.</p>';
    }

    dailyView.innerHTML = homeworkHtml + '<hr style="margin: 20px 0; border-color: var(--border);">' + evalHtml;
}

classSelect.addEventListener('change', () => { populateStudents(); renderDailyView(); });
studentSelect.addEventListener('change', renderDailyView);
dateSelect.addEventListener('change', renderDailyView);

populateFilters();
renderDailyView();
