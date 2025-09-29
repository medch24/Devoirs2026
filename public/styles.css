/* General Styles */
:root {
    --primary-color: #004a99; --secondary-color: #007bff; --accent-color: #0096ff;
    --background-color: #f4f8fa; --card-bg-color: #ffffff; --text-color: #343a40;
    --border-color: #dee2e6; --green-status: #28a745; --red-status: #dc3545;
    --orange-status: #fd7e14; --grey-status: #6c757d; --yellow-star: #ffc107;
}
* { box-sizing: border-box; }
body {
    font-family: 'Poppins', 'Tajawal', sans-serif; background-color: var(--background-color); color: var(--text-color);
    margin: 0; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 20px;
}
.container {
    width: 100%; max-width: 1200px; background-color: var(--card-bg-color);
    border-radius: 16px; box-shadow: 0 8px 30px rgba(0, 74, 153, 0.1); overflow: hidden;
}
header {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); color: white; padding: 20px 30px;
    display: flex; justify-content: center; align-items: center; position: relative; border-bottom: 3px solid var(--accent-color);
    text-align: center;
}
header h1 { margin: 0; font-size: 1.8rem; }
.back-button {
    position: absolute; top: 50%; left: 20px; transform: translateY(-50%);
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white;
    font-size: 1.5rem; cursor: pointer; border-radius: 50%; width: 45px; height: 45px; line-height: 45px; text-align: center;
    transition: background-color 0.2s;
}
.back-button:hover { background: rgba(255,255,255,0.2); }
.language-selector-home { position: absolute; top: 20px; right: 20px; z-index: 10; }
.language-selector-home button {
    background: var(--card-bg-color); color: var(--primary-color); border: 1px solid var(--primary-color);
    padding: 8px 15px; border-radius: 20px; cursor: pointer; margin-left: 10px; font-weight: 600;
}
.language-selector-home button:hover { background: #eef; }
.profile-summary { display: flex; gap: 30px; padding: 25px; align-items: center; flex-wrap: wrap; }
.student-info { text-align: center; flex-shrink: 0; }
.student-photo { width: 120px; height: 120px; border-radius: 50%; border: 4px solid var(--secondary-color); object-fit: cover; }
.star-rating { margin: 10px 0; font-size: 2rem; }
.star-rating .star { color: #ccc; } .star-rating .star.filled { color: var(--yellow-star); }
.student-of-week { display: none; background: var(--orange-status); color: white; padding: 8px 15px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }
.student-of-week.active { display: inline-block; }
.weekly-stats { flex-grow: 1; min-width: 250px; }
.stat-item { text-align: center; } .stat-item p { font-weight: 600; color: #555; margin-bottom: 10px; }
.progress-bar-container { width: 100%; background: #e9ecef; border-radius: 20px; position: relative; height: 35px; overflow: hidden; }
.progress-bar { height: 100%; background: linear-gradient(90deg, #ffc107, #ff9800); border-radius: 20px; transition: width 0.5s ease-out; }
.progress-bar-container span { position: absolute; width: 100%; left: 0; top: 50%; transform: translateY(-50%); font-weight: 700; color: #333; font-size: 1.1rem; }
.dashboard-nav { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; background: #fafafa; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px; }
.nav-arrow { background: var(--card-bg-color); border: 1px solid var(--secondary-color); color: var(--secondary-color); padding: 8px 15px; border-radius: 20px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
.nav-arrow:hover { background: var(--secondary-color); color: white; }
.dashboard-nav h2 { margin: 0; font-size: 1.3rem; color: var(--primary-color); text-align: center; flex-grow: 1; }
.homework-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 25px; }
.subject-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; background: #fff; }

/* MODIFICATION : Rendre l'en-tête flexible pour aligner le titre et l'ampoule */
.subject-card h3 { 
    margin: 0; padding: 12px 15px; color: white; font-size: 1.1rem; background: var(--secondary-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.subject-card .content { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; }
.subject-card .assignment { background: #f8f9fa; padding: 12px; border-radius: 8px; min-height: 70px; margin-bottom: 12px; border-left: 4px solid var(--accent-color); flex-grow: 1; }
.subject-card .comment-box { background: #fffbe6; padding: 12px; border-radius: 8px; min-height: 50px; font-style: italic; color: #555; }
.subject-card .scores { display: flex; justify-content: space-around; margin-top: 15px; font-size: 0.9rem; text-align: center; }
.scores span { display: block; }
.scores span:first-child { font-weight: 600; color: var(--text-color); }
.scores span:last-child { font-weight: bold; font-size: 1.2rem; color: var(--primary-color); }

/* ========== NOUVEAU CODE POUR L'AMPOULE DE STATUT ========== */
.status-lamp {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: transparent; /* Transparent par défaut si pas de statut */
    flex-shrink: 0; /* Empêche l'ampoule de rétrécir */
    margin-left: 10px;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
.status-lamp.fait { background-color: var(--green-status); }
.status-lamp.non-fait { background-color: var(--red-status); }
.status-lamp.partiellement-fait { background-color: var(--orange-status); }
.status-lamp.absent { background-color: var(--grey-status); }
/* ============================================================ */

.upload-section { padding: 25px; background: #edf2f7; border-bottom: 1px solid var(--border-color); text-align: center; margin-bottom: 20px; }
.upload-section h3 { margin: 0 0 15px 0; color: var(--primary-color); }
#upload-status { font-weight: 600; margin-top: 15px; }
#upload-status.success { color: var(--green-status); } #upload-status.error { color: var(--red-status); }
.teacher-controls { display: flex; flex-wrap: wrap; gap: 15px; padding: 0 25px 25px 25px; }
.teacher-controls select, .teacher-controls input { padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1rem; flex-grow: 1; min-width: 150px; }
.section-title { padding: 0 25px; margin-top: 0; color: var(--primary-color); border-bottom: 2px solid var(--accent-color); padding-bottom: 5px; }
.teacher-homework-display { padding: 15px 25px; background: #fafafa; min-height: 50px; }
.teacher-homework-display p { margin: 5px 0; }
#teacher-table-container { padding: 25px; overflow-x: auto; }
.teacher-evaluation-table { width: 100%; border-collapse: collapse; }
.teacher-evaluation-table th, .teacher-evaluation-table td { padding: 12px 15px; border: 1px solid var(--border-color); text-align: left; vertical-align: middle; }
.teacher-evaluation-table thead { background-color: var(--primary-color); color: white; }
.teacher-evaluation-table tbody tr:nth-child(even) { background-color: #f8f9fa; }
.teacher-evaluation-table select, .teacher-evaluation-table input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.main-menu, .login-form, .selection-box { display: flex; flex-direction: column; gap: 20px; padding: 40px; max-width: 450px; margin: auto; }
.role-button { padding: 18px; font-size: 1.4rem; border: none; cursor: pointer; background-color: var(--accent-color); color: white; border-radius: 8px; font-weight: 600; transition: all 0.2s; }
.role-button:hover { background-color: var(--secondary-color); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 119, 255, 0.3); }
select, input[type="text"], input[type="password"], input[type="date"], button[type="submit"] { box-sizing: border-box; width: 100%; padding: 14px; font-size: 1rem; border: 1px solid var(--border-color); border-radius: 8px; }
button[type="submit"] { background: var(--secondary-color); color: white; border: none; font-weight: 600; }
.error-message { color: var(--red-status); font-weight: bold; text-align: center; }
@media (max-width: 600px) {
    body { padding: 0; }
    .container { border-radius: 0; box-shadow: none; }
    header h1 { font-size: 1.4rem; }
    .back-button { width: 40px; height: 40px; line-height: 40px; font-size: 1.2rem; }
    .language-selector-home { top: 15px; right: 15px; }
    .language-selector-home button { padding: 6px 12px; font-size: 0.9rem; }
    .main-menu, .login-form, .selection-box { padding: 25px; }
    .role-button { padding: 15px; font-size: 1.2rem; }
    .dashboard-nav { justify-content: center; }
}```

---

### **Étape 2 : Mettre à jour `public/index.js`**

Nous allons modifier la fonction `loadStudentDashboard` pour qu'elle ajoute l'élément "ampoule" avec la bonne classe de couleur.

**Remplacez TOUT le contenu de `public/index.js` par ce code mis à jour :**

```javascript
document.addEventListener('DOMContentLoaded', () => {
    let currentDate = moment();
    const studentLists = {
        PEI1: ["Faysal", "Bilal", "Jad", "Manaf"], PEI2: ["Ahmed", "Yasser", "Eyad", "Ali"],
        PEI3: ["Seifeddine", "Mohamed", "Wajih", "Ahmad", "Adam"],
        PEI4: ["Mohamed Younes", "Mohamed Amine", "Samir", "Abdulrahman", "Youssef"], DP2: ["Habib", "Salah"]
    };
    const translations = {
        fr: {
            portalTitle: "Portail de Suivi des Devoirs", parentSpace: "Espace Parent", teacherSpace: "Espace Enseignant",
            backButton: "Retour", teacherLoginTitle: "Accès Enseignant", usernamePlaceholder: "Nom d'utilisateur",
            passwordPlaceholder: "Mot de passe", loginButton: "Connexion", loginError: "Nom d'utilisateur ou mot de passe incorrect.",
            classSelectLabel: "Choisissez une classe :", studentSelectLabel: "Choisissez votre enfant :", selectDefault: "-- Sélectionnez --",
            studentDashboardTitle: "Tableau de bord de", overallWeeklyProgress: "Progression générale de la semaine",
            previousDay: "Jour Précédent", nextDay: "Jour Suivant", homeworkFor: "Devoirs du", loading: "Chargement...",
            noHomeworkForDay: "Aucun devoir pour ce jour.", fetchError: "Erreur de chargement des données.", studentOfTheWeek: "Élève de la semaine",
            teacherDashboardTitle: "Tableau de Bord Enseignant", updateSchedule: "Mettre à jour le planning hebdomadaire",
            uploadButton: "Charger et Mettre à jour", homeworkForDay: "Devoirs du jour sélectionné :", selectClassPrompt: "Veuillez sélectionner tous les filtres.",
            evalTableHeaderStudent: "Élève", evalTableHeaderStatus: "Statut", evalTableHeaderParticipation: "Participation",
            evalTableHeaderBehavior: "Comportement", evalTableHeaderComment: "Commentaire", saveButton: "Enregistrer",
            noHomeworkForSubject: "Pas de devoirs pour cette matière aujourd'hui."
        },
        ar: {
            // ... (translations en arabe)
        }
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        moment.locale(lang);
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
        });
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.dataset.translatePlaceholder;
            if (translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
        });
    };
    document.getElementById('lang-fr').addEventListener('click', () => setLanguage('fr'));
    document.getElementById('lang-ar').addEventListener('click', () => setLanguage('ar'));

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

    document.getElementById('teacher-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        if (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!') {
            setupTeacherDashboard();
            showView('teacher-dashboard-view');
        } else { document.getElementById('login-error').textContent = translations[document.documentElement.lang].loginError; }
    });

    async function setupTeacherDashboard() {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const datePicker = teacherDashboardView.querySelector('#date-picker');
        const teacherClassSelect = teacherDashboardView.querySelector('#teacher-class-select');
        const teacherNameSelect = teacherDashboardView.querySelector('#teacher-name-select');
        const teacherSubjectSelect = teacherDashboardView.querySelector('#teacher-subject-select');
        const excelFileInput = teacherDashboardView.querySelector('#excel-file-input');
        const uploadExcelBtn = teacherDashboardView.querySelector('#upload-excel-btn');
        const uploadStatus = teacherDashboardView.querySelector('#upload-status');

        datePicker.valueAsDate = moment().toDate();
        try {
            const response = await fetch('/api/initial-data');
            if (!response.ok) throw new Error('Impossible de charger les listes.');
            const initialData = await response.json();
            populateDynamicSelect('teacher-class-select', initialData.classes);
            populateDynamicSelect('teacher-name-select', initialData.teachers);
            populateDynamicSelect('teacher-subject-select', initialData.subjects);
        } catch (error) {
            console.error(error);
            teacherDashboardView.querySelector('#teacher-table-container').innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}. Veuillez mettre à jour le planning.</p>`;
        }
        
        uploadExcelBtn.addEventListener('click', async () => {
            const file = excelFileInput.files[0];
            if (!file) {
                uploadStatus.textContent = "Veuillez choisir un fichier.";
                uploadStatus.className = 'error';
                return;
            }
            uploadStatus.textContent = "Lecture du fichier en cours...";
            uploadStatus.className = '';
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonPlan = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    const formattedPlan = formatPlanData(jsonPlan);
                    
                    if (formattedPlan.length === 0) {
                        throw new Error("Aucune donnée valide trouvée. Vérifiez le format des dates (ex: 'lundi 29 septembre 2025').");
                    }

                    uploadStatus.textContent = `Fichier lu. ${formattedPlan.length} devoirs trouvés. Envoi en cours...`;
                    
                    const response = await fetch('/api/upload-plan', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formattedPlan)
                    });
                    
                    if (!response.ok) {
                        const errorResult = await response.json();
                        throw new Error(`Erreur du serveur (statut ${response.status}). ${errorResult.message || ''}`);
                    }
                    
                    const result = await response.json();
                    uploadStatus.textContent = result.message;
                    uploadStatus.className = 'success';
                    await setupTeacherDashboard();
                } catch (error) {
                    console.error("Erreur d'upload:", error);
                    uploadStatus.textContent = `Erreur : ${error.message}.`;
                    uploadStatus.className = 'error';
                }
            };
            reader.readAsArrayBuffer(file);
        });

        datePicker.addEventListener('change', renderTeacherView);
        teacherClassSelect.addEventListener('change', renderTeacherView);
        teacherNameSelect.addEventListener('change', renderTeacherView);
        teacherSubjectSelect.addEventListener('change', renderTeacherView);
        
        renderTeacherView();
    }

    function parseFrenchDate(dateString) {
        const cleanString = dateString.toLowerCase().trim();
        moment.locale('fr');
        const formats = ["dddd D MMMM YYYY", "D MMMM YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
        const momentDate = moment(cleanString, formats, 'fr', true);
        return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : 'Invalid date';
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
            let dateValue = rowData.Jour;
            let formattedDate = 'Invalid date';

            if (typeof dateValue === 'number') {
                const date = moment('1899-12-30').add(dateValue, 'days');
                formattedDate = date.format('YYYY-MM-DD');
            } else if (typeof dateValue === 'string') {
                formattedDate = parseFrenchDate(dateValue);
            }
            
            rowData.Jour = formattedDate;
            return rowData;
        }).filter(row => row.Devoirs && row.Jour && row.Jour !== 'Invalid date');
    }

    async function renderTeacherView() {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const datePicker = teacherDashboardView.querySelector('#date-picker');
        const teacherClassSelect = teacherDashboardView.querySelector('#teacher-class-select');
        const teacherNameSelect = teacherDashboardView.querySelector('#teacher-name-select');
        const teacherSubjectSelect = teacherDashboardView.querySelector('#teacher-subject-select');
        const teacherTableContainer = teacherDashboardView.querySelector('#teacher-table-container');
        const teacherHomeworkList = teacherDashboardView.querySelector('#teacher-homework-list');
        
        const selectedClass = teacherClassSelect.value;
        const selectedDate = moment(datePicker.value).format('YYYY-MM-DD');
        const selectedTeacher = teacherNameSelect.value;
        const selectedSubject = teacherSubjectSelect.value;

        if (!selectedClass || !selectedTeacher || !selectedSubject) {
            teacherHomeworkList.innerHTML = "";
            teacherTableContainer.innerHTML = `<p>${translations[document.documentElement.lang].selectClassPrompt}</p>`;
            return;
        }

        try {
            const response = await fetch(`/api/evaluations?class=${selectedClass}&date=${selectedDate}`);
            if (!response.ok) throw new Error('Erreur de chargement des données');
            const data = await response.json();

            const filteredHomeworks = data.homeworks.filter(hw => hw.teacher === selectedTeacher && hw.subject === selectedSubject);

            teacherHomeworkList.innerHTML = "";
            if (filteredHomeworks.length > 0) {
                filteredHomeworks.forEach(hw => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${hw.subject}:</strong> ${hw.assignment}`;
                    teacherHomeworkList.appendChild(p);
                });

                const students = studentLists[selectedClass.split(' ')[0]] || [];
                let tableHTML = `<table class="teacher-evaluation-table"><thead><tr><th>${translations[document.documentElement.lang].evalTableHeaderStudent}</th><th>${translations[document.documentElement.lang].evalTableHeaderStatus}</th><th>${translations[document.documentElement.lang].evalTableHeaderParticipation}</th><th>${translations[document.documentElement.lang].evalTableHeaderBehavior}</th><th>${translations[document.documentElement.lang].evalTableHeaderComment}</th></tr></thead><tbody>`;
                for (const student of students) {
                    const existingEval = data.evaluations.find(ev => ev.studentName === student && ev.subject === selectedSubject) || {};
                    tableHTML += `<tr data-student="${student}"><td>${student}</td><td><select class="status-select"><option value="Fait" ${existingEval.status === 'Fait' ? 'selected' : ''}>Fait</option><option value="Non Fait" ${existingEval.status === 'Non Fait' ? 'selected' : ''}>Non Fait</option><option value="Partiellement Fait" ${existingEval.status === 'Partiellement Fait' ? 'selected' : ''}>Partiellement Fait</option><option value="Absent" ${existingEval.status === 'Absent' ? 'selected' : ''}>Absent</option></select></td><td><input type="number" class="participation-input" min="0" max="10" value="${existingEval.participation ?? 7}"></td><td><input type="number" class="behavior-input" min="0" max="10" value="${existingEval.behavior ?? 7}"></td><td><input type="text" class="comment-input" value="${existingEval.comment || ''}"></td></tr>`;
                }
                tableHTML += `</tbody></table><button id="submit-evals-btn" class="role-button" style="margin-top: 20px;">${translations[document.documentElement.lang].saveButton}</button>`;
                teacherTableContainer.innerHTML = tableHTML;
                teacherTableContainer.querySelector('#submit-evals-btn').addEventListener('click', submitTeacherEvaluations);
            } else {
                teacherHomeworkList.innerHTML = `<p>${translations[document.documentElement.lang].noHomeworkForSubject}</p>`;
                teacherTableContainer.innerHTML = "";
            }
        } catch (error) { 
            console.error("Erreur lors du rendu de la vue enseignant:", error);
            teacherTableContainer.innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}</p>`; 
        }
        setLanguage(document.documentElement.lang);
    }
    
    async function submitTeacherEvaluations() {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const selectedClass = teacherDashboardView.querySelector('#teacher-class-select').value;
        const selectedDate = moment(teacherDashboardView.querySelector('#date-picker').value).format('YYYY-MM-DD');
        const selectedSubject = teacherDashboardView.querySelector('#teacher-subject-select').value;

        if (!selectedSubject) {
            alert("Erreur : aucune matière sélectionnée.");
            return;
        }

        const evaluations = Array.from(teacherDashboardView.querySelectorAll('.teacher-evaluation-table tbody tr')).map(row => ({
            studentName: row.dataset.student,
            class: selectedClass,
            date: selectedDate,
            subject: selectedSubject,
            status: row.querySelector('.status-select').value,
            participation: parseInt(row.querySelector('.participation-input').value, 10),
            behavior: parseInt(row.querySelector('.behavior-input').value, 10),
            comment: row.querySelector('.comment-input').value,
        }));
        try {
            const response = await fetch('/api/evaluations', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ evaluations }) 
            });
            if (!response.ok) throw new Error(`Erreur lors de l'enregistrement (statut ${response.status})`);
            alert("Évaluations enregistrées !");
        } catch (error) { 
            console.error("Erreur lors de la soumission des évaluations:", error);
            alert("Une erreur est survenue lors de l'enregistrement des évaluations."); 
        }
    }

    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');

    function populateClassSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">${translations[document.documentElement.lang].selectDefault}</option>`;
        Object.keys(studentLists).forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            selectElement.appendChild(option);
        });
    }

    function populateDynamicSelect(selectId, dataArray) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">-- ${selectId.includes('class') ? 'Classe' : selectId.includes('name') ? 'Enseignant' : 'Matière'} --</option>`;
        (dataArray || []).sort().forEach(item => {
            const option = document.createElement('option');
            option.value = item; 
            option.textContent = item; 
            selectElement.appendChild(option);
        });
    }

    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        const studentSelectorBox = document.getElementById('student-selector-box');
        studentSelect.innerHTML = `<option value="">${translations[document.documentElement.lang].selectDefault}</option>`;
        if (selectedClass && studentLists[selectedClass]) {
            studentLists[selectedClass].forEach(student => {
                const option = document.createElement('option');
                option.value = student; 
                option.textContent = student; 
                studentSelect.appendChild(option);
            });
            studentSelectorBox.style.display = 'block';
        } else { 
            studentSelectorBox.style.display = 'none'; 
        }
    });

    studentSelect.addEventListener('change', async () => {
        const studentName = studentSelect.value;
        const className = classSelect.value;
        if (studentName && className) {
            currentDate = moment();
            await loadStudentDashboard(className, studentName, currentDate);
            showView('student-dashboard-view');
        }
    });

    document.getElementById('prev-day-btn').addEventListener('click', () => { 
        currentDate.subtract(1, 'days'); 
        loadStudentDashboard(classSelect.value, studentSelect.value, currentDate); 
    });

    document.getElementById('next-day-btn').addEventListener('click', () => { 
        currentDate.add(1, 'days'); 
        loadStudentDashboard(classSelect.value, studentSelect.value, currentDate); 
    });

    // ================== MODIFICATION POUR L'AMPOULE DE STATUT ==================
    async function loadStudentDashboard(className, studentName, date) {
        document.getElementById('student-name-header').textContent = `${translations[document.documentElement.lang].studentDashboardTitle} ${studentName}`;
        document.getElementById('homework-date').textContent = `${translations[document.documentElement.lang].homeworkFor} ${date.format('dddd D MMMM YYYY')}`;
        const homeworkGrid = document.getElementById('homework-grid');
        homeworkGrid.innerHTML = `<p>${translations[document.documentElement.lang].loading}</p>`;

        try {
            const dateQuery = date.format('YYYY-MM-DD');
            const response = await fetch(`/api/evaluations?class=${className}&student=${studentName}&date=${dateQuery}&week=true`);
            if (!response.ok) throw new Error(`Erreur du serveur (statut ${response.status})`);
            const data = await response.json();

            homeworkGrid.innerHTML = "";
            if (data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const dailyEval = data.evaluations.find(ev => ev.studentName === studentName && ev.subject === hw.subject) || {};
                    
                    // Fonction pour créer la classe CSS à partir du statut
                    const getStatusClass = (status) => {
                        if (!status) return '';
                        return status.toLowerCase().replace(/ /g, '-');
                    };
                    const statusClass = getStatusClass(dailyEval.status);

                    const card = document.createElement('div');
                    card.className = 'subject-card';
                    // Ajout de l'élément ampoule <span class="status-lamp ..."></span> dans le h3
                    card.innerHTML = `
                        <h3>
                            <span>${hw.subject}</span>
                            <span class="status-lamp ${statusClass}"></span>
                        </h3>
                        <div class="content">
                            <div class="assignment">${hw.assignment}</div>
                            <div class="comment-box">${dailyEval.comment || "..."}</div>
                            <div class="scores">
                                <div>
                                    <span data-translate="evalTableHeaderBehavior">${translations[document.documentElement.lang].evalTableHeaderBehavior}</span>
                                    <span>${dailyEval.behavior ?? '-'}</span>
                                </div>
                                <div>
                                    <span data-translate="evalTableHeaderParticipation">${translations[document.documentElement.lang].evalTableHeaderParticipation}</span>
                                    <span>${dailyEval.participation ?? '-'}</span>
                                </div>
                            </div>
                        </div>`;
                    homeworkGrid.appendChild(card);
                });
            } else {
                homeworkGrid.innerHTML = `<p>${translations[document.documentElement.lang].noHomeworkForDay}</p>`;
            }
            updateWeeklyStats(data.weeklyEvaluations || []);
        } catch (error) { 
            console.error("Erreur lors du chargement du tableau de bord élève:", error);
            homeworkGrid.innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}</p>`; 
        }
        setLanguage(document.documentElement.lang);
    }
    // ============================================================================

    function updateWeeklyStats(weeklyEvals) {
        let stars = 0;
        const dailyScores = {};
        (weeklyEvals || []).forEach(ev => {
            const dayKey = ev.date;
            if (!dailyScores[dayKey]) {
                dailyScores[dayKey] = { allDone: true, participationSum: 0, behaviorSum: 0, count: 0, hasHomework: true };
            }
            if (ev.status !== 'Fait' && ev.status !== 'Absent') {
                dailyScores[dayKey].allDone = false;
            }
            dailyScores[dayKey].participationSum += ev.participation || 0;
            dailyScores[dayKey].behaviorSum += ev.behavior || 0;
            dailyScores[dayKey].count++;
        });

        Object.values(dailyScores).forEach(day => {
            if (day.hasHomework && day.allDone) {
                const avgParticipation = day.count > 0 ? day.participationSum / day.count : 0;
                const avgBehavior = day.count > 0 ? day.behaviorSum / day.count : 0;
                if (avgParticipation >= 5 && avgBehavior >= 5) {
                    stars++;
                }
            }
        });
        
        const starContainer = document.getElementById('star-rating');
        starContainer.innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="star ${i < stars ? 'filled' : ''}">&#9733;</span>`).join('');
        const studentOfWeekBanner = document.getElementById('student-of-week-banner');
        if (stars >= 5) {
            studentOfWeekBanner.classList.add('active');
        } else {
            studentOfWeekBanner.classList.remove('active');
        }

        let totalScore = 0;
        let maxScore = 0;
        (weeklyEvals || []).forEach(ev => {
            if (ev.status !== 'Absent') {
                totalScore += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + (ev.participation || 0) + (ev.behavior || 0);
                maxScore += 30;
            }
        });
        
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        document.getElementById('overall-progress-bar').style.width = `${percentage}%`;
        document.getElementById('overall-progress-text').textContent = `${percentage}%`;
    }

    setLanguage('fr');
});
