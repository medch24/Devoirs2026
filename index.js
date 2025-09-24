document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES GLOBALES ---
    let currentDate = new Date();
    let initialData = { teachers: [], classes: [] }; // Pour stocker les données dynamiques
    const studentLists = {
        PEI1: ["Faysal", "Bilal", "Jad", "Manaf"],
        PEI2: ["Ahmed", "Yasser", "Eyad", "Ali"],
        PEI3: ["Seifeddine", "Mohamed", "Wajih", "Ahmad", "Adam"],
        PEI4: ["Mohamed Younes", "Mohamed Amine", "Samir", "Abdulrahman", "Youssef"],
        DP2: ["Habib", "Salah"]
    };

    // --- LOGIQUE DE NAVIGATION (ne change pas) ---
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
    const goHome = () => { homeView.style.display = 'block'; views.forEach(v => v.style.display = 'none'); };

    goToParentBtn.addEventListener('click', () => {
        populateClassSelect('class-select');
        showView('parent-selection-view');
    });
    goToTeacherBtn.addEventListener('click', () => showView('teacher-login-view'));
    backButtons.forEach(btn => btn.addEventListener('click', goHome));
    
    // --- CONNEXION ENSEIGNANT ---
    document.getElementById('teacher-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        if (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!') {
            setupTeacherDashboard();
            showView('teacher-dashboard-view');
        } else {
            document.getElementById('login-error').textContent = "Identifiants incorrects.";
        }
    });

    // --- ESPACE ENSEIGNANT - TABLEAU DE BORD (LOGIQUE DYNAMIQUE) ---
    const datePicker = document.getElementById('date-picker');
    const teacherNameSelect = document.getElementById('teacher-name-select');
    const teacherClassSelect = document.getElementById('teacher-class-select');
    const teacherTableContainer = document.getElementById('teacher-table-container');
    const teacherHomeworkList = document.getElementById('teacher-homework-list');

    async function setupTeacherDashboard() {
        datePicker.valueAsDate = new Date();
        
        try {
            // 1. Charger les données initiales (enseignants, classes)
            const response = await fetch('/api/initial-data');
            initialData = await response.json();

            // 2. Remplir les menus déroulants
            populateDynamicSelect('teacher-name-select', initialData.teachers);
            populateDynamicSelect('teacher-class-select', initialData.classes);

        } catch (error) {
            console.error("Impossible de charger les données initiales:", error);
            teacherTableContainer.innerHTML = `<p class="error-message">Impossible de charger la liste des classes et enseignants.</p>`;
        }
        
        datePicker.addEventListener('change', renderTeacherView);
        teacherClassSelect.addEventListener('change', renderTeacherView);
        renderTeacherView();
    }

    async function renderTeacherView() {
        // ... (le reste du code pour renderTeacherView, submitTeacherEvaluations, la section Parent, etc. reste le même)
        // Collez le reste du fichier index.js de la réponse précédente ici.
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
            if(data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${hw.subject}:</strong> ${hw.assignment}`;
                    teacherHomeworkList.appendChild(p);
                });
            } else {
                teacherHomeworkList.innerHTML = `<p>Aucun devoir enregistré pour ce jour.</p>`;
            }

            const students = studentLists[selectedClass] || [];
            let tableHTML = `<table class="teacher-evaluation-table"><thead><tr><th>Élève</th><th>Devoirs</th><th>Participation</th><th>Comportement</th><th>Commentaire</th></tr></thead><tbody>`;
            for (const student of students) {
                const existingEval = data.evaluations.find(ev => ev.studentName === student) || {};
                tableHTML += `<tr data-student="${student}"><td>${student}</td><td><select class="status-select"><option value="Fait" ${existingEval.status === 'Fait' ? 'selected' : ''}>Fait</option><option value="Non Fait" ${existingEval.status === 'Non Fait' ? 'selected' : ''}>Non Fait</option><option value="Partiellement Fait" ${existingEval.status === 'Partiellement Fait' ? 'selected' : ''}>Partiellement Fait</option><option value="Absent" ${existingEval.status === 'Absent' ? 'selected' : ''}>Absent</option></select></td><td><input type="number" class="participation-input" min="0" max="10" value="${existingEval.participation ?? 7}"></td><td><input type="number" class="behavior-input" min="0" max="10" value="${existingEval.behavior ?? 7}"></td><td><input type="text" class="comment-input" value="${existingEval.comment || ''}"></td></tr>`;
            }
            tableHTML += `</tbody></table><button id="submit-evals-btn" class="role-button" style="margin-top: 20px;">Enregistrer les modifications</button>`;
            teacherTableContainer.innerHTML = tableHTML;
            
            document.getElementById('submit-evals-btn').addEventListener('click', submitTeacherEvaluations);
        } catch (error) {
            teacherTableContainer.innerHTML = `<p class="error-message">Erreur de chargement des données.</p>`;
        }
    }

    async function submitTeacherEvaluations() { /* ... même code qu'avant ... */ }
    
    // --- ESPACE PARENT ---
    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');

    function populateClassSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">-- Sélectionnez --</option>`;
        Object.keys(studentLists).forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            selectElement.appendChild(option);
        });
    }

    function populateDynamicSelect(selectId, dataArray) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">-- Sélectionnez --</option>`;
        dataArray.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }

    // Le reste du code de l'espace parent ne change pas
    classSelect.addEventListener('change', () => { /* ... */ });
    studentSelect.addEventListener('change', async () => { /* ... */ });
    document.getElementById('prev-day-btn').addEventListener('click', () => { /* ... */ });
    document.getElementById('next-day-btn').addEventListener('click', () => { /* ... */ });
    async function loadStudentDashboard(className, studentName, date) { /* ... */ }
    function updateWeeklyStats(weeklyEvals) { /* ... */ }

});
