document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES GLOBALES ---
    let currentDate = new Date();
    const studentLists = {
        PEI1: ["Faysal", "Bilal", "Jad", "Manaf"], PEI2: ["Ahmed", "Yasser", "Eyad", "Ali"],
        PEI3: ["Seifeddine", "Mohamed", "Wajih", "Ahmad", "Adam"],
        PEI4: ["Mohamed Younes", "Mohamed Amine", "Samir", "Abdulrahman", "Youssef"], DP2: ["Habib", "Salah"]
    };

    // --- LOGIQUE DE NAVIGATION (ne change pas) ---
    const views = document.querySelectorAll('.view');
    const homeView = document.getElementById('home-view');
    const goToParentBtn = document.getElementById('go-to-parent');
    const goToTeacherBtn = document.getElementById('go-to-teacher');
    const backButtons = document.querySelectorAll('.back-button');
    const showView = (viewId) => { homeView.style.display = 'none'; views.forEach(v => v.style.display = 'none'); document.getElementById(viewId).style.display = 'block'; };
    const goHome = () => { homeView.style.display = 'block'; views.forEach(v => v.style.display = 'none'); };
    goToParentBtn.addEventListener('click', () => { populateClassSelect('class-select'); showView('parent-selection-view'); });
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
        } else { document.getElementById('login-error').textContent = "Identifiants incorrects."; }
    });

    // --- NOUVELLE LOGIQUE D'UPLOAD EXCEL ---
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
                
                // Convertir la feuille en JSON
                const jsonPlan = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                // Valider et formater les données
                const formattedPlan = formatPlanData(jsonPlan);
                uploadStatus.textContent = `Fichier lu avec succès. ${formattedPlan.length} lignes de devoirs trouvées. Envoi en cours...`;
                uploadStatus.style.color = 'blue';

                // Envoyer les données à l'API
                const response = await fetch('/api/upload-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedPlan)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Erreur inconnue');

                uploadStatus.textContent = result.message;
                uploadStatus.style.color = 'green';
                
                // Recharger la vue enseignant pour afficher les nouvelles données
                setupTeacherDashboard();

            } catch (error) {
                console.error("Erreur lors de l'upload:", error);
                uploadStatus.textContent = `Erreur : ${error.message}`;
                uploadStatus.style.color = 'red';
            }
        };
        reader.readAsArrayBuffer(file);
    });

    function excelDateToYYYYMMDD(excelDate) {
        const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
        return date.toISOString().split('T')[0];
    }
    
    function formatPlanData(jsonPlan) {
        const headers = jsonPlan[0].map(h => h.trim());
        const dataRows = jsonPlan.slice(1);
        const requiredHeaders = ["Enseignant", "Jour", "Classe", "Matière", "Devoirs"];
        
        // Valider les en-têtes
        for(const header of requiredHeaders) {
            if(!headers.includes(header)) throw new Error(`Colonne manquante dans le fichier Excel : "${header}"`);
        }

        return dataRows.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            
            // Transformer la date Excel en format YYYY-MM-DD
            if (typeof rowData.Jour === 'number') {
                rowData.Jour = excelDateToYYYYMMDD(rowData.Jour);
            }
            
            return rowData;
        }).filter(row => row.Devoirs); // Garder uniquement les lignes qui ont un devoir
    }
    
    // --- ESPACE ENSEIGNANT - TABLEAU DE BORD (LOGIQUE DYNAMIQUE) ---
    const datePicker = document.getElementById('date-picker');
    const teacherNameSelect = document.getElementById('teacher-name-select');
    const teacherClassSelect = document.getElementById('teacher-class-select');
    const teacherTableContainer = document.getElementById('teacher-table-container');
    const teacherHomeworkList = document.getElementById('teacher-homework-list');
    
    async function setupTeacherDashboard() { /* La logique existante est déplacée ici */ }
    async function renderTeacherView() { /* La logique existante est déplacée ici */ }
    // ... Collez le reste du code de l'Espace Enseignant et Parent ici ...
    // Le code qui suit est identique à la version précédente
    async function setupTeacherDashboard() {
        datePicker.valueAsDate = new Date();
        
        try {
            const response = await fetch('/api/initial-data');
            if(!response.ok) throw new Error('Réponse du serveur non valide');
            const initialData = await response.json();

            populateDynamicSelect('teacher-name-select', initialData.teachers || []);
            populateDynamicSelect('teacher-class-select', initialData.classes || []);

        } catch (error) {
            console.error("Impossible de charger les données initiales:", error);
            teacherTableContainer.innerHTML = `<p class="error-message">Impossible de charger la liste des classes et enseignants. Veuillez mettre à jour le planning via un fichier Excel.</p>`;
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
            if(data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${hw.subject}:</strong> ${hw.assignment}`;
                    teacherHomeworkList.appendChild(p);
                });
            } else {
                teacherHomeworkList.innerHTML = `<p>Aucun devoir enregistré pour ce jour.</p>`;
            }

            const students = studentLists[selectedClass.split(' ')[0]] || []; // Gère "PEI1 Garçons" -> "PEI1"
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

    async function submitTeacherEvaluations() {
        // ... (cette fonction ne change pas)
    }
    
    // --- ESPACE PARENT ---
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
    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        const studentSelectorBox = document.getElementById('student-selector-box');
        studentSelect.innerHTML = `<option value="">-- Sélectionnez --</option>`;
        if (selectedClass && studentLists[selectedClass]) {
            studentLists[selectedClass].forEach(student => {
                const option = document.createElement('option');
                option.value = student; option.textContent = student; studentSelect.appendChild(option);
            });
            studentSelectorBox.style.display = 'block';
        } else { studentSelectorBox.style.display = 'none'; }
    });
    studentSelect.addEventListener('change', async () => {
        const studentName = studentSelect.value;
        const className = classSelect.value;
        if (studentName && className) {
            currentDate = new Date(); 
            await loadStudentDashboard(className, studentName, currentDate);
            showView('student-dashboard-view');
        }
    });
    document.getElementById('prev-day-btn').addEventListener('click', () => { currentDate.setDate(currentDate.getDate() - 1); loadStudentDashboard(classSelect.value, studentSelect.value, currentDate); });
    document.getElementById('next-day-btn').addEventListener('click', () => { currentDate.setDate(currentDate.getDate() + 1); loadStudentDashboard(classSelect.value, studentSelect.value, currentDate); });
    
    async function loadStudentDashboard(className, studentName, date) {
        // ... (cette fonction ne change pas)
    }
    
    function updateWeeklyStats(weeklyEvals) {
        // ... (cette fonction ne change pas)
    }

});
```*J'ai dû abréger la fin du fichier `index.js` car il est très long. Vous devez reprendre les fonctions `submitTeacherEvaluations`, `loadStudentDashboard`, et `updateWeeklyStats` de la réponse précédente. La partie cruciale est l'ajout de la logique d'upload au début.*

### **Comment Utiliser**

1.  L'enseignant crée un fichier Excel simple avec les colonnes : `Enseignant`, `Jour`, `Classe`, `Matière`, `Devoirs`.
2.  **IMPORTANT :** La colonne `Jour` doit être formatée en tant que date dans Excel.
3.  L'enseignant va sur l'Espace Enseignant.
4.  Il clique sur "Choisir un fichier", sélectionne son planning Excel.
5.  Il clique sur le bouton "Charger et Vérifier le Fichier".
6.  Le site lit le fichier, met la base de données à jour, et rafraîchit la page avec les nouvelles données.

Cette approche est bien plus robuste et vous donne un contrôle total sur les données.
