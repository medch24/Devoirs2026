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

    // ================== CORRECTION DÉFINITIVE DU BUG 'addEventListener' ==================
    // Toute la logique du tableau de bord enseignant est maintenant encapsulée ici.
    
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

    // NOUVELLE FONCTION POUR LIRE LES DATES COMME "lundi 29 septembre 2025"
    function parseFrenchDate(dateString) {
        // Met en minuscule, remplace les caractères arabes si besoin, etc.
        const cleanString = dateString.toLowerCase().trim();
        moment.locale('fr'); // S'assurer que moment est en français
        
        // Essayer plusieurs formats que moment peut comprendre
        const formats = [
            "dddd D MMMM YYYY", // ex: "lundi 29 septembre 2025"
            "D MMMM YYYY",       // ex: "29 septembre 2025"
            "DD/MM/YYYY",
            "YYYY-MM-DD"
        ];
        
        const momentDate = moment(cleanString, formats, 'fr', true); // Le 'true' est pour une correspondance stricte
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
                    const card = document.createElement('div');
                    card.className = 'subject-card';
                    card.innerHTML = `<h3>${hw.subject}</h3><div class="content"><div class="assignment">${hw.assignment}</div><div class="comment-box">${dailyEval.comment || "..."}</div><div class="scores"><div><span data-translate="evalTableHeaderBehavior">${translations[document.documentElement.lang].evalTableHeaderBehavior}</span><span>${dailyEval.behavior ?? '-'}</span></div><div><span data-translate="evalTableHeaderParticipation">${translations[document.documentElement.lang].evalTableHeaderParticipation}</span><span>${dailyEval.participation ?? '-'}</span></div></div></div>`;
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
