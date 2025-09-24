document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    const studentLists = {
        PEI1: ["Faysal", "Bilal", "Jad", "Manaf"], PEI2: ["Ahmed", "Yasser", "Eyad", "Ali"],
        PEI3: ["Seifeddine", "Mohamed", "Wajih", "Ahmad", "Adam"],
        PEI4: ["Mohamed Younes", "Mohamed Amine", "Samir", "Abdulrahman", "Youssef"], DP2: ["Habib", "Salah"]
    };

    const views = document.querySelectorAll('.view');
    const homeView = document.getElementById('home-view');
    const goToParentBtn = document.getElementById('go-to-parent');
    const goToTeacherBtn = document.getElementById('go-to-teacher');
    const backButtons = document.querySelectorAll('.back-button');

    const showView = (viewId) => {
        homeView.style.display = 'none';
        views.forEach(v => v.style.display = 'none');
        document.getElementById(viewId).style.display = 'block';
    };
    const goHome = () => {
        homeView.style.display = 'block';
        views.forEach(v => v.style.display = 'none');
    };

    goToParentBtn.addEventListener('click', () => { populateClassSelect('class-select'); showView('parent-selection-view'); });
    goToTeacherBtn.addEventListener('click', () => showView('teacher-login-view'));
    backButtons.forEach(btn => btn.addEventListener('click', goHome));

    document.getElementById('teacher-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        if (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!') {
            setupTeacherDashboard();
            showView('teacher-dashboard-view');
        } else { document.getElementById('login-error').textContent = "Identifiants incorrects."; }
    });

    const excelFileInput = document.getElementById('excel-file-input');
    const uploadExcelBtn = document.getElementById('upload-excel-btn');
    const uploadStatus = document.getElementById('upload-status');

    uploadExcelBtn.addEventListener('click', () => {
        const file = excelFileInput.files[0];
        if (!file) {
            uploadStatus.textContent = "Veuillez d'abord choisir un fichier Excel.";
            uploadStatus.style.color = 'red';
            return;
        }
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonPlan = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const formattedPlan = formatPlanData(jsonPlan);
                uploadStatus.textContent = `Fichier lu. ${formattedPlan.length} devoirs trouvés. Envoi en cours...`;
                uploadStatus.style.color = 'blue';

                const response = await fetch('/api/upload-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedPlan)
                });
                if (!response.ok) throw new Error(`Erreur du serveur (statut ${response.status})`);
                const result = await response.json();
                uploadStatus.textContent = result.message;
                uploadStatus.style.color = 'green';
                setupTeacherDashboard();
            } catch (error) {
                console.error("Erreur lors de l'upload:", error);
                uploadStatus.textContent = `Erreur : ${error.message}.`;
                uploadStatus.style.color = 'red';
            }
        };
        reader.readAsArrayBuffer(file);
    });

    function parseFrenchDate(dateString) {
        if (!dateString || typeof dateString !== 'string') return dateString;
        const months = { 'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04', 'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08', 'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12' };
        const parts = dateString.toLowerCase().split(' ');
        if (parts.length < 3) return dateString;
        const day = parts[1].padStart(2, '0');
        const month = months[parts[2]];
        const year = parts[3];
        if (!day || !month || !year) return dateString;
        return `${year}-${month}-${day}`;
    }

    function formatPlanData(jsonPlan) {
        if (!jsonPlan || jsonPlan.length < 2) throw new Error("Fichier Excel vide ou invalide.");
        const headers = jsonPlan[0].map(h => typeof h === 'string' ? h.trim() : h);
        const dataRows = jsonPlan.slice(1);
        ["Enseignant", "Jour", "Classe", "Matière", "Devoirs"].forEach(header => {
            if (!headers.includes(header)) throw new Error(`Colonne manquante : "${header}"`);
        });
        return dataRows.map(row => {
            const rowData = {};
            headers.forEach((header, index) => { rowData[header] = row[index]; });
            rowData.Jour = parseFrenchDate(rowData.Jour);
            return rowData;
        }).filter(row => row.Devoirs);
    }

    const datePicker = document.getElementById('date-picker');
    const teacherNameSelect = document.getElementById('teacher-name-select');
    const teacherClassSelect = document.getElementById('teacher-class-select');
    const teacherTableContainer = document.getElementById('teacher-table-container');
    const teacherHomeworkList = document.getElementById('teacher-homework-list');

    async function setupTeacherDashboard() {
        datePicker.valueAsDate = new Date();
        try {
            const response = await fetch('/api/initial-data');
            if (!response.ok) throw new Error('Impossible de charger les listes.');
            const initialData = await response.json();
            populateDynamicSelect('teacher-name-select', initialData.teachers || []);
            populateDynamicSelect('teacher-class-select', initialData.classes || []);
        } catch (error) {
            console.error(error);
            teacherTableContainer.innerHTML = `<p class="error-message">Listes non chargées. Veuillez mettre à jour le planning via un fichier Excel.</p>`;
        }
        datePicker.addEventListener('change', renderTeacherView);
        teacherClassSelect.addEventListener('change', renderTeacherView);
        renderTeacherView();
    }

    async function renderTeacherView() {
        const selectedClass = teacherClassSelect.value;
        const selectedDate = datePicker.value;
        if (!selectedClass) {
            teacherTableContainer.innerHTML = `<p>Veuillez sélectionner une classe.</p>`;
            teacherHomeworkList.innerHTML = "";
            return;
        }
        try {
            const response = await fetch(`/api/evaluations?class=${selectedClass}&date=${selectedDate}`);
            const data = await response.json();
            teacherHomeworkList.innerHTML = "";
            if (data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${hw.subject}:</strong> ${hw.assignment}`;
                    teacherHomeworkList.appendChild(p);
                });
            } else { teacherHomeworkList.innerHTML = `<p>Aucun devoir enregistré pour ce jour.</p>`; }
            const students = studentLists[selectedClass.split(' ')[0]] || [];
            let tableHTML = `<table class="teacher-evaluation-table"><thead><tr><th>Élève</th><th>Statut</th><th>Participation</th><th>Comportement</th><th>Commentaire</th></tr></thead><tbody>`;
            for (const student of students) {
                const existingEval = data.evaluations.find(ev => ev.studentName === student) || {};
                tableHTML += `<tr data-student="${student}"><td>${student}</td><td><select class="status-select"><option>Fait</option><option>Non Fait</option><option>Partiellement Fait</option><option>Absent</option></select></td><td><input type="number" class="participation-input" min="0" max="10" value="${existingEval.participation ?? 7}"></td><td><input type="number" class="behavior-input" min="0" max="10" value="${existingEval.behavior ?? 7}"></td><td><input type="text" class="comment-input" value="${existingEval.comment || ''}"></td></tr>`;
            }
            tableHTML += `</tbody></table><button id="submit-evals-btn" class="role-button" style="margin-top: 20px;">Enregistrer</button>`;
            teacherTableContainer.innerHTML = tableHTML;
            document.getElementById('submit-evals-btn').addEventListener('click', submitTeacherEvaluations);
        } catch (error) { teacherTableContainer.innerHTML = `<p class="error-message">Erreur de chargement des données.</p>`; }
    }
    
    async function submitTeacherEvaluations() { /* ... Ne change pas ... */ }
    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');
    function populateClassSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">-- Sélectionnez --</option>`;
        Object.keys(studentLists).forEach(className => {
            const option = document.createElement('option');
            option.value = className; option.textContent = className; selectElement.appendChild(option);
        });
    }
    function populateDynamicSelect(selectId, dataArray) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">-- Sélectionnez --</option>`;
        (dataArray || []).forEach(item => {
            const option = document.createElement('option');
            option.value = item; option.textContent = item; selectElement.appendChild(option);
        });
    }
    classSelect.addEventListener('change', () => { /* ... Ne change pas ... */ });
    studentSelect.addEventListener('change', async () => { /* ... Ne change pas ... */ });
    document.getElementById('prev-day-btn').addEventListener('click', () => { /* ... Ne change pas ... */ });
    document.getElementById('next-day-btn').addEventListener('click', () => { /* ... Ne change pas ... */ });
    async function loadStudentDashboard(className, studentName, date) { /* ... Ne change pas ... */ }
    function updateWeeklyStats(weeklyEvals) { /* ... Ne change pas ... */ }
});
