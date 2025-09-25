import { firebaseConfig } from './firebase-config.js';

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const STUDENTS = { "PEI1": ["Faysal", "Bilal", "Jad", "Manaf"], "PEI2": ["Ahmed", "Yasser", "Ali"] };

// Éléments du DOM
const excelUpload = document.getElementById('excel-upload');
const uploadBtn = document.getElementById('upload-btn');
const uploadStatus = document.getElementById('upload-status');
const evalDate = document.getElementById('eval-date');
const evalClass = document.getElementById('eval-class');
const homeworkDisplay = document.getElementById('homework-display');
const evalTableBody = document.getElementById('eval-table-body');
const saveBtn = document.getElementById('save-evals-btn');

// --- FONCTIONS ---

// 1. GESTION DE L'IMPORT EXCEL
async function handleExcelUpload() {
    const file = excelUpload.files[0];
    if (!file) {
        uploadStatus.textContent = "Veuillez sélectionner un fichier.";
        return;
    }
    uploadStatus.textContent = "Chargement...";

    const reader = new FileReader();
    reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Supposons les colonnes: Date, Classe, Matiere, Devoir
        const batch = db.batch();
        let count = 0;
        json.forEach(row => {
            const dateStr = row.Date; // Format YYYY-MM-DD
            const classe = row.Classe;
            const matiere = row.Matiere;
            const devoir = row.Devoir;

            if (dateStr && classe && matiere && devoir) {
                const docRef = db.collection('homework').doc(dateStr);
                const updateData = { [`${classe}.${matiere}`]: devoir };
                batch.set(docRef, updateData, { merge: true });
                count++;
            }
        });
        await batch.commit();
        uploadStatus.textContent = `Planning mis à jour avec ${count} devoirs.`;
        loadDailyData(); // Rafraîchir la vue
    };
    reader.readAsArrayBuffer(file);
}

// 2. CHARGEMENT DES DONNÉES DU JOUR
async function loadDailyData() {
    const date = evalDate.value;
    const classe = evalClass.value;
    if (!date || !classe) return;

    // Charger les devoirs
    const homeworkDoc = await db.collection('homework').doc(date).get();
    const homework = homeworkDoc.exists ? homeworkDoc.data()[classe] || {} : {};
    homeworkDisplay.innerHTML = Object.entries(homework)
        .map(([subject, task]) => `<div><strong>${subject}:</strong> ${task}</div>`)
        .join('') || "Aucun devoir trouvé pour ce jour.";

    // Charger les évaluations
    const students = STUDENTS[classe] || [];
    evalTableBody.innerHTML = '';
    for (const student of students) {
        const docId = `${date}_${classe}_${student}`;
        const evalDoc = await db.collection('evaluations').doc(docId).get();
        const data = evalDoc.exists ? evalDoc.data() : {};
        const row = document.createElement('tr');
        row.dataset.student = student;
        row.innerHTML = `
            <td>${student}</td>
            <td><select class="status-select"><option>Fait</option><option>Partiel</option><option>Non Fait</option></select></td>
            <td><input type="number" class="participation-input" value="${data.participation || 7}" min="1" max="7"></td>
            <td><input type="number" class="comportement-input" value="${data.comportement || 7}" min="1" max="7"></td>
            <td><input type="text" class="commentaire-input" placeholder="Commentaire..." value="${data.commentaire || ''}"></td>
        `;
        row.querySelector('.status-select').value = data.statut || 'Fait';
        evalTableBody.appendChild(row);
    }
}

// 3. SAUVEGARDE DES ÉVALUATIONS
async function saveEvaluations() {
    const date = evalDate.value;
    const classe = evalClass.value;
    if (!date || !classe) return alert("Veuillez sélectionner une date et une classe.");

    const batch = db.batch();
    evalTableBody.querySelectorAll('tr').forEach(row => {
        const student = row.dataset.student;
        const docId = `${date}_${classe}_${student}`;
        const docRef = db.collection('evaluations').doc(docId);
        const data = {
            statut: row.querySelector('.status-select').value,
            participation: parseInt(row.querySelector('.participation-input').value, 10),
            comportement: parseInt(row.querySelector('.comportement-input').value, 10),
            commentaire: row.querySelector('.commentaire-input').value.trim()
        };
        batch.set(docRef, data);
    });

    try {
        await batch.commit();
        alert('Évaluations enregistrées !');
    } catch (error) {
        console.error("Erreur: ", error);
        alert("Une erreur est survenue lors de l'enregistrement.");
    }
}

// --- INITIALISATION ET ÉVÉNEMENTS ---
function init() {
    evalDate.valueAsDate = new Date();
    Object.keys(STUDENTS).forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls; opt.textContent = cls;
        evalClass.appendChild(opt);
    });

    uploadBtn.addEventListener('click', handleExcelUpload);
    evalDate.addEventListener('change', loadDailyData);
    evalClass.addEventListener('change', loadDailyData);
    saveBtn.addEventListener('click', saveEvaluations);

    loadDailyData();
}

init();
