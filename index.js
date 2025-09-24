document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
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
            uploadButton: "Charger et Mettre à jour", homeworkForDay: "Devoirs du jour sélectionné :", selectClassPrompt: "Veuillez sélectionner une classe.",
            evalTableHeaderStudent: "Élève", evalTableHeaderStatus: "Statut", evalTableHeaderParticipation: "Participation",
            evalTableHeaderBehavior: "Comportement", evalTableHeaderComment: "Commentaire", saveButton: "Enregistrer"
        },
        ar: {
            portalTitle: "بوابة متابعة الواجبات", parentSpace: "فضاء الولي", teacherSpace: "فضاء المربي",
            backButton: "رجوع", teacherLoginTitle: "دخول المربي", usernamePlaceholder: "اسم المستخدم",
            passwordPlaceholder: "كلمة المرور", loginButton: "دخول", loginError: "اسم المستخدم أو كلمة المرور غير صحيحة.",
            classSelectLabel: "اختر القسم:", studentSelectLabel: "اختر ابنك:", selectDefault: "-- اختر --",
            studentDashboardTitle: "لوحة متابعة", overallWeeklyProgress: "التقدم الأسبوعي العام",
            previousDay: "اليوم السابق", nextDay: "اليوم التالي", homeworkFor: "واجبات يوم", loading: "جار التحميل...",
            noHomeworkForDay: "لا توجد واجبات لهذا اليوم.", fetchError: "خطأ في تحميل البيانات.", studentOfTheWeek: "تلميذ الأسبوع",
            teacherDashboardTitle: "لوحة تحكم المربي", updateSchedule: "تحديث الجدول الأسبوعي",
            uploadButton: "تحميل وتحديث", homeworkForDay: "واجبات اليوم المحدد:", selectClassPrompt: "الرجاء اختيار قسم.",
            evalTableHeaderStudent: "التلميذ", evalTableHeaderStatus: "الحالة", evalTableHeaderParticipation: "المشاركة",
            evalTableHeaderBehavior: "السلوك", evalTableHeaderComment: "ملاحظة", saveButton: "تسجيل"
        }
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        moment.locale(lang);
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (translations[lang][key]) el.textContent = translations[lang][key];
        });
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.dataset.translatePlaceholder;
            if (translations[lang][key]) el.placeholder = translations[lang][key];
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
        } else { document.getElementById('login-error').textContent = "Identifiants incorrects."; }
    });

    const excelFileInput = document.getElementById('excel-file-input');
    const uploadExcelBtn = document.getElementById('upload-excel-btn');
    const uploadStatus = document.getElementById('upload-status');

    uploadExcelBtn.addEventListener('click', () => {
        const file = excelFileInput.files[0];
        if (!file) { uploadStatus.textContent = "Veuillez choisir un fichier."; uploadStatus.className = 'error'; return; }
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
                uploadStatus.className = '';

                const response = await fetch('/api/upload-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedPlan)
                });
                if (!response.ok) throw new Error(`Erreur du serveur (statut ${response.status})`);
                const result = await response.json();
                uploadStatus.textContent = result.message;
                uploadStatus.className = 'success';
                setupTeacherDashboard();
            } catch (error) {
                uploadStatus.textContent = `Erreur : ${error.message}.`;
                uploadStatus.className = 'error';
            }
        };
        reader.readAsArrayBuffer(file);
    });
    
    function formatPlanData(jsonPlan) {
    if (!jsonPlan || jsonPlan.length < 2) throw new Error("Fichier Excel vide ou invalide.");
    
    const headers = jsonPlan[0].map(h => typeof h === 'string' ? h.trim() : h);
    const dataRows = jsonPlan.slice(1);
    
    ["Enseignant", "Jour", "Classe", "Matière", "Devoirs"].forEach(header => {
        if (!headers.includes(header)) throw new Error(`Colonne manquante : "${header}"`);
    });

    return dataRows.map(row => {
        const rowData = {};
        headers.forEach((header, index) => {
            const value = row[index];
            // CORRECTION : On nettoie toutes les données texte pour enlever les espaces
            rowData[header] = (typeof value === 'string') ? value.trim() : value;
        });
        
        let dateValue = rowData.Jour;
        let formattedDate;

        if (typeof dateValue === 'number') {
            const date = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
            formattedDate = moment(date).format('YYYY-MM-DD');
        } else if (typeof dateValue === 'string') {
            formattedDate = moment(dateValue, "DD/MM/YYYY").isValid() ? moment(dateValue, "DD/MM/YYYY").format('YYYY-MM-DD') : parseFrenchDate(dateValue);
        }
        
        rowData.Jour = formattedDate;
        return rowData;

    }).filter(row => row.Devoirs && row.Jour && row.Jour !== 'Invalid date');
}

    function parseFrenchDate(dateString) {
        const months = { 'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04', 'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08', 'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12' };
        const parts = dateString.toLowerCase().split(' ').filter(p => p);
        if (parts.length < 3) return 'Invalid date';
        const day = parts[1].padStart(2, '0');
        const month = months[parts[2]];
        const year = parts[3];
        if (!day || !month || !year) return 'Invalid date';
        return `${year}-${month}-${day}`;
    }

    const datePicker = document.getElementById('date-picker');
    const teacherClassSelect = document.getElementById('teacher-class-select');
    const teacherTableContainer = document.getElementById('teacher-table-container');
    const teacherHomeworkList = document.getElementById('teacher-homework-list');

    async function setupTeacherDashboard() {
        datePicker.valueAsDate = new Date();
        try {
            const response = await fetch('/api/initial-data');
            if (!response.ok) throw new Error('Impossible de charger les listes.');
            const initialData = await response.json();
            populateDynamicSelect('teacher-name-select', initialData.teachers);
            populateDynamicSelect('teacher-class-select', initialData.classes);
        } catch (error) {
            console.error(error);
            teacherTableContainer.innerHTML = `<p class="error-message">Listes non chargées. Veuillez mettre à jour le planning.</p>`;
        }
        datePicker.addEventListener('change', renderTeacherView);
        teacherClassSelect.addEventListener('change', renderTeacherView);
        renderTeacherView();
    }

    async function renderTeacherView() {
        const selectedClass = teacherClassSelect.value;
        const selectedDate = datePicker.value;
        if (!selectedClass) { teacherTableContainer.innerHTML = `<p data-translate="selectClassPrompt">Veuillez sélectionner une classe.</p>`; teacherHomeworkList.innerHTML = ""; return; }
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
            } else { teacherHomeworkList.innerHTML = `<p data-translate="noHomeworkForDay">Aucun devoir enregistré pour ce jour.</p>`; }
            const students = studentLists[selectedClass.split(' ')[0]] || [];
            let tableHTML = `<table class="teacher-evaluation-table"><thead><tr><th data-translate="evalTableHeaderStudent">Élève</th><th data-translate="evalTableHeaderStatus">Statut</th><th data-translate="evalTableHeaderParticipation">Participation</th><th data-translate="evalTableHeaderBehavior">Comportement</th><th data-translate="evalTableHeaderComment">Commentaire</th></tr></thead><tbody>`;
            for (const student of students) {
                const existingEval = data.evaluations.find(ev => ev.studentName === student) || {};
                tableHTML += `<tr data-student="${student}"><td>${student}</td><td><select class="status-select"><option>Fait</option><option>Non Fait</option><option>Partiellement Fait</option><option>Absent</option></select></td><td><input type="number" class="participation-input" min="0" max="10" value="${existingEval.participation ?? 7}"></td><td><input type="number" class="behavior-input" min="0" max="10" value="${existingEval.behavior ?? 7}"></td><td><input type="text" class="comment-input" value="${existingEval.comment || ''}"></td></tr>`;
            }
            tableHTML += `</tbody></table><button id="submit-evals-btn" class="role-button" style="margin-top: 20px;" data-translate="saveButton">Enregistrer</button>`;
            teacherTableContainer.innerHTML = tableHTML;
            document.getElementById('submit-evals-btn').addEventListener('click', submitTeacherEvaluations);
        } catch (error) { teacherTableContainer.innerHTML = `<p class="error-message" data-translate="fetchError">Erreur de chargement des données.</p>`; }
        setLanguage(document.documentElement.lang);
    }
    
    async function submitTeacherEvaluations() {
        const evaluations = Array.from(document.querySelectorAll('.teacher-evaluation-table tbody tr')).map(row => ({
            studentName: row.dataset.student,
            class: teacherClassSelect.value,
            date: datePicker.value,
            status: row.querySelector('.status-select').value,
            participation: parseInt(row.querySelector('.participation-input').value, 10),
            behavior: parseInt(row.querySelector('.behavior-input').value, 10),
            comment: row.querySelector('.comment-input').value,
        }));
        try {
            await fetch('/api/evaluations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ evaluations }) });
            alert("Évaluations enregistrées !");
        } catch (error) { alert("Une erreur est survenue."); }
    }

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
        (dataArray || []).sort().forEach(item => {
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
        document.getElementById('student-name-header').textContent = `${translations[document.documentElement.lang].studentDashboardTitle} ${studentName}`;
        document.getElementById('homework-date').textContent = `${translations[document.documentElement.lang].homeworkFor} ${moment(date).format('dddd D MMMM YYYY')}`;
        const homeworkGrid = document.getElementById('homework-grid');
        homeworkGrid.innerHTML = `<p>${translations[document.documentElement.lang].loading}</p>`;

        try {
            const dateQuery = date.toISOString().split('T')[0];
            const response = await fetch(`/api/evaluations?class=${className}&student=${studentName}&date=${dateQuery}&week=true`);
            const data = await response.json();

            homeworkGrid.innerHTML = "";
            if (data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const dailyEval = data.evaluations.find(ev => ev.subject === hw.subject && ev.studentName === studentName) || {};
                    const card = document.createElement('div');
                    card.className = 'subject-card';
                    card.innerHTML = `<h3>${hw.subject}</h3><div class="content"><div class="assignment">${hw.assignment}</div><div class="comment-box">${dailyEval.comment || "..."}</div><div class="scores"><div><span data-translate="evalTableHeaderBehavior"></span><span>${dailyEval.behavior ?? '-'}</span></div><div><span data-translate="evalTableHeaderParticipation"></span><span>${dailyEval.participation ?? '-'}</span></div></div></div>`;
                    homeworkGrid.appendChild(card);
                });
            } else {
                homeworkGrid.innerHTML = `<p>${translations[document.documentElement.lang].noHomeworkForDay}</p>`;
            }
            updateWeeklyStats(data.weeklyEvaluations || []);
        } catch (error) { homeworkGrid.innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}</p>`; }
        setLanguage(document.documentElement.lang);
    }
    
    function updateWeeklyStats(weeklyEvals) {
        let stars = 0;
        const dailyScores = {};
        (weeklyEvals || []).forEach(ev => {
            const dayKey = ev.date;
            if (!dailyScores[dayKey]) dailyScores[dayKey] = { allDone: true, participationSum: 0, behaviorSum: 0, count: 0 };
            if (ev.status !== 'Fait') dailyScores[dayKey].allDone = false;
            dailyScores[dayKey].participationSum += ev.participation;
            dailyScores[dayKey].behaviorSum += ev.behavior;
            dailyScores[dayKey].count++;
        });
        Object.values(dailyScores).forEach(day => {
            if (day.allDone && (day.participationSum / day.count) >= 5 && (day.behaviorSum / day.count) >= 5) stars++;
        });
        const starContainer = document.getElementById('star-rating');
        starContainer.innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="star ${i < stars ? 'filled' : ''}">&#9733;</span>`).join('');
        document.getElementById('student-of-week-banner').classList.toggle('active', stars >= 5);
        let totalScore = 0, maxScore = 0;
        (weeklyEvals || []).forEach(ev => {
            totalScore += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + ev.participation + ev.behavior;
            maxScore += 30;
        });
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        document.getElementById('overall-progress-bar').style.width = `${percentage}%`;
        document.getElementById('overall-progress-text').textContent = `${percentage}%`;
    }

    setLanguage('fr');
});
