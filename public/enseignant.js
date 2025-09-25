import { firebaseConfig } from './firebase-config.js';

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const TEACHERS = { "M. Abas": { password: "1234", subjects: ["Sciences", "Maths"] }, "Mme. Fatima": { password: "5678", subjects: ["Français", "Anglais"] } };
const STUDENTS = { "PEI1": ["Faysal", "Bilal", "Jad", "Manaf"], "PEI2": ["Ahmed", "Yasser", "Ali"] };
const HOMEWORK = { "2025-09-28": { "PEI1": { "Sciences": "Faire les exercices 1 et 2 page 14.", "Maths": "Faire les exercices 12-13 page 115.", "Anglais": "Workbook Page 16.", "Français": "Lire le chapitre 2." } } };

const loginPanel = document.getElementById('login-panel'), dashboardPanel = document.getElementById('dashboard-panel');
const teacherSelect = document.getElementById('teacher-select'), passwordInput = document.getElementById('password'), loginBtn = document.getElementById('login-btn');
const evalDate = document.getElementById('eval-date'), evalClass = document.getElementById('eval-class');
const evalTableBody = document.getElementById('eval-table-body'), homeworkDisplay = document.getElementById('homework-display');
const saveBtn = document.getElementById('save-evals-btn'), teacherNameDisplay = document.getElementById('teacher-name-display');

let currentTeacher = null;

function populateTeacherSelect() { Object.keys(TEACHERS).forEach(name => { const opt = document.createElement('option'); opt.value = name; opt.textContent = name; teacherSelect.appendChild(opt); }); }
function handleLogin() { const name = teacherSelect.value, pass = passwordInput.value, teacher = TEACHERS[name]; if (teacher && teacher.password === pass) { currentTeacher = { name, subjects: teacher.subjects }; loginPanel.classList.add('hidden'); dashboardPanel.classList.remove('hidden'); teacherNameDisplay.textContent = name; initDashboard(); } else { alert('Nom ou mot de passe incorrect.'); } }
function initDashboard() { evalDate.valueAsDate = new Date(); Object.keys(STUDENTS).forEach(cls => { const opt = document.createElement('option'); opt.value = cls; opt.textContent = cls; evalClass.appendChild(opt); }); loadDataForFilters(); }

async function loadDataForFilters() {
    const date = evalDate.value, classe = evalClass.value;
    if (!date || !classe) return;
    const homework = HOMEWORK[date]?.[classe] || {};
    homeworkDisplay.innerHTML = currentTeacher.subjects
        .filter(sub => homework[sub])
        .map(sub => `<div><strong>${sub}:</strong> ${homework[sub]}</div>`)
        .join('') || `<p>Aucun devoir à afficher pour vos matières (${currentTeacher.subjects.join(', ')}) ce jour-là.</p>`;
    
    const students = STUDENTS[classe] || [];
    evalTableBody.innerHTML = '';
    for (const student of students) {
        const docId = `${date}_${classe}_${student}`;
        const doc = await db.collection('evaluations').doc(docId).get();
        const data = doc.exists ? doc.data() : {};
        const row = document.createElement('tr');
        row.dataset.student = student;
        row.innerHTML = `
            <td>${student}</td>
            <td><select class="status-select"><option>Fait</option><option>Partiel</option><option>Non Fait</option></select></td>
            <td><input type="number" class="participation-input" value="${data.participation || 7}" min="1" max="7"></td>
            <td><input type="number" class="comportement-input" value="${data.comportement || 7}" min="1" max="7"></td>
            <td><input type="text" class="commentaire-input" placeholder="Commentaire..." value="${data.commentaire || ''}"></td>`;
        row.querySelector('.status-select').value = data.statut || 'Fait';
        evalTableBody.appendChild(row);
    }
}

async function saveEvaluations() {
    const date = evalDate.value, classe = evalClass.value;
    if (!date || !classe) return alert("Veuillez sélectionner une date et une classe.");
    const batch = db.batch();
    evalTableBody.querySelectorAll('tr').forEach(row => {
        const student = row.dataset.student, docId = `${date}_${classe}_${student}`;
        const docRef = db.collection('evaluations').doc(docId);
        const data = { date, classe, student, teacher: currentTeacher.name, statut: row.querySelector('.status-select').value, participation: parseInt(row.querySelector('.participation-input').value, 10), comportement: parseInt(row.querySelector('.comportement-input').value, 10), commentaire: row.querySelector('.commentaire-input').value.trim() };
        batch.set(docRef, data, { merge: true });
    });
    try { await batch.commit(); alert('Évaluations enregistrées avec succès !'); } catch (error) { console.error("Erreur: ", error); alert("Une erreur s'est produite."); }
}

loginBtn.addEventListener('click', handleLogin);
evalDate.addEventListener('change', loadDataForFilters);
evalClass.addEventListener('change', loadDataForFilters);
saveBtn.addEventListener('click', saveEvaluations);

populateTeacherSelect();
