document.addEventListener('DOMContentLoaded', () => {
    let currentDate = moment();
    let teacherPlanData = []; 

    const studentData = {
        PEI1: [ { name: "Faysal", photo: "https://lh3.googleusercontent.com/d/1IB6BKROX3TRxaIIHVVVWbB7-Ii-V8VrC" }, { name: "Bilal", photo: "https://lh3.googleusercontent.com/d/1B0QUZJhpSad5Fs3qRTugUe4oyTlUDEVu" }, { name: "Jad", photo: "https://lh3.googleusercontent.com/d/1VLvrWjeJwaClf4pSaLiwjnS79N-HrsFr" }, { name: "Manaf", photo: "https://lh3.googleusercontent.com/d/1h46Tqtqcp5tNqdY62wV6pyZFYknCEMWY" } ],
        PEI2: [ { name: "Ahmed", photo: "https://lh3.googleusercontent.com/d/1cDF-yegSB2tqsWac0AoNttbi8qAALYT1" }, { name: "Yasser", photo: "https://lh3.googleusercontent.com/d/1UUrrAJV_bgFNktGDinDkSrpwSZz-e47T" }, { name: "Eyad", photo: "https://lh3.googleusercontent.com/d/1HGyWS4cC1jWWD25Ah3WcT_eIbUHqFzJ1" }, { name: "Ali", photo: "https://lh3.googleusercontent.com/d/1bN-fDf_IWkXoW3WjSOXI5_M4KkL3FDKr" } ],
        PEI3: [ { name: "Seifeddine", photo: "https://lh3.googleusercontent.com/d/1tWdPSbtCAsTMB86WzDgqh3Xw01ahm9s6" }, { name: "Mohamed", photo: "https://lh3.googleusercontent.com/d/1lB8ObGOvQDVT6FITL2y7C5TYmAGyggFn" }, { name: "Wajih", photo: "https://lh3.googleusercontent.com/d/1MH6M05mQamOHevmDffVFNpSFNnxqbxs3" }, { name: "Ahmad", photo: "https://lh3.googleusercontent.com/d/1zU-jBuAbYjHanzank9C1BAd00skS1Y5J" }, { name: "Adam", photo: "https://lh3.googleusercontent.com/d/15I9p6VSnn1yVmPxRRbGsUkM-fsBKYOWF" } ],
        PEI4: [ { name: "Mohamed Younes", photo: "https://lh3.googleusercontent.com/d/1wzraoZY_lRafcDXeaxSBeX5cIU57p4xA" }, { name: "Mohamed Amine", photo: "https://lh3.googleusercontent.com/d/1UrBw6guz0oBTUy8COGeewIs3XAK773bR" }, { name: "Samir", photo: "https://lh3.googleusercontent.com/d/1NdaCH8CU0DJFHXw4D0lItP-QnCswl23b" }, { name: "Abdulrahman", photo: "https://lh3.googleusercontent.com/d/1yCTO5StU2tnPY0BEynnWzUveljMIUcLE" }, { name: "Youssef", photo: "https://lh3.googleusercontent.com/d/1Bygg5-PYrjjMOZdI5hAe16eZ8ltn772e" } ],
        DP2: [ { name: "Habib", photo: "https://lh3.googleusercontent.com/d/13u4y6JIyCBVQ_9PCwYhh837byyK9g8pF" }, { name: "Salah", photo: "https://lh3.googleusercontent.com/d/1IG8S_i6jD8O6C2QD_nwLxrG932QgIVXu" } ]
    };
    
    const translations = {
        fr: { portalTitle: "Portail de Suivi des Devoirs", parentSpace: "Espace Parent", teacherSpace: "Espace Enseignant", backButton: "Retour", teacherLoginTitle: "Accès Enseignant", usernamePlaceholder: "Nom d'utilisateur", passwordPlaceholder: "Mot de passe", loginButton: "Connexion", loginError: "Nom d'utilisateur ou mot de passe incorrect.", classSelectLabel: "Choisissez une classe :", studentSelectLabel: "Choisissez votre enfant :", selectDefault: "-- Sélectionnez --", studentDashboardTitle: "Tableau de bord de", overallWeeklyProgress: "Progression générale de la semaine", previousDay: "Jour Précédent", nextDay: "Jour Suivant", homeworkFor: "Devoirs du", loading: "Chargement...", noHomeworkForDay: "Aucun devoir pour ce jour.", fetchError: "Erreur de chargement des données.", studentOfTheWeek: "Élève de la semaine", teacherDashboardTitle: "Tableau de Bord Enseignant", updateSchedule: "Mettre à jour le planning hebdomadaire", uploadButton: "Charger et Mettre à jour", homeworkForDay: "Devoirs du jour sélectionné :", selectClassPrompt: "Veuillez sélectionner tous les filtres.", evalTableHeaderStudent: "Élève", evalTableHeaderStatus: "Statut", evalTableHeaderParticipation: "Participation", evalTableHeaderBehavior: "Comportement", evalTableHeaderComment: "Commentaire", saveButton: "Enregistrer", noHomeworkForSubject: "Pas de devoirs pour cette matière aujourd'hui." },
        ar: { portalTitle: "بوابة متابعة الواجبات", parentSpace: "فضاء الولي", teacherSpace: "فضاء المربي", backButton: "رجوع", teacherLoginTitle: "دخول المربي", usernamePlaceholder: "اسم المستخدم", passwordPlaceholder: "كلمة المرور", loginButton: "دخول", loginError: "اسم المستخدم أو كلمة المرور غير صحيحة.", classSelectLabel: "اختر القسم:", studentSelectLabel: "اختر ابنك:", selectDefault: "-- اختر --", studentDashboardTitle: "لوحة متابعة", overallWeeklyProgress: "التقدم الأسبوعي العام",
            // ================== CORRECTION DE LA TRADUCTION ==================
            previousDay: "اليوم السابق", 
            nextDay: "اليوم التالي", 
            homeworkFor: "واجبات يوم", loading: "جار التحميل...", noHomeworkForDay: "لا توجد واجبات لهذا اليوم.", fetchError: "خطأ في تحميل البيانات.", studentOfTheWeek: "تلميذ الأسبوع", teacherDashboardTitle: "لوحة تحكم المربي", updateSchedule: "تحديث الجدول الأسبوعي", uploadButton: "تحميل وتحديث", homeworkForDay: "واجبات اليوم المحدد:", selectClassPrompt: "الرجاء اختيار كل المحددات.", evalTableHeaderStudent: "التلميذ", evalTableHeaderStatus: "الحالة", evalTableHeaderParticipation: "المشاركة", evalTableHeaderBehavior: "السلوك", evalTableHeaderComment: "ملاحظة", saveButton: "تسجيل", noHomeworkForSubject: "لا توجد واجبات لهذه المادة اليوم." }
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
        const studentDashboardView = document.getElementById('student-dashboard-view');
        if (studentDashboardView.style.display === 'block') {
            const className = document.getElementById('class-select').value;
            const studentName = document.getElementById('student-select').value;
            if (className && studentName) {
                loadStudentDashboard(className, studentName, currentDate);
            }
        }
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        if (teacherDashboardView.style.display === 'block') {
            renderTeacherView();
        }
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
        datePicker.valueAsDate = moment().toDate();
        try {
            const response = await fetch('/api/initial-data');
            if (!response.ok) throw new Error('Impossible de charger les listes.');
            const initialData = await response.json();
            teacherPlanData = initialData.planData;
            populateDynamicSelect('teacher-name-select', initialData.teachers);
        } catch (error) {
            console.error(error);
            teacherDashboardView.querySelector('#teacher-table-container').innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}. Veuillez mettre à jour le planning.</p>`;
        }
        uploadExcelBtn.addEventListener('click', () => handleFileUpload(excelFileInput));
        teacherNameSelect.addEventListener('change', updateClassOptions);
        teacherClassSelect.addEventListener('change', updateSubjectOptions);
        datePicker.addEventListener('change', renderTeacherView);
        teacherSubjectSelect.addEventListener('change', renderTeacherView);
        updateClassOptions();
    }

    function updateClassOptions() {
        const teacherNameSelect = document.getElementById('teacher-name-select');
        const selectedTeacher = teacherNameSelect.value;
        const classesForTeacher = [...new Set(
            teacherPlanData
            .filter(item => item.Enseignant === selectedTeacher)
            .map(item => item.Classe)
        )].sort();
        populateDynamicSelect('teacher-class-select', classesForTeacher);
        updateSubjectOptions();
    }

    function updateSubjectOptions() {
        const teacherNameSelect = document.getElementById('teacher-name-select');
        const teacherClassSelect = document.getElementById('teacher-class-select');
        const selectedTeacher = teacherNameSelect.value;
        const selectedClass = teacherClassSelect.value;
        const subjectsForTeacherAndClass = [...new Set(
            teacherPlanData
            .filter(item => item.Enseignant === selectedTeacher && item.Classe === selectedClass)
            .map(item => item.Matière)
        )].sort();
        populateDynamicSelect('teacher-subject-select', subjectsForTeacherAndClass);
        renderTeacherView();
    }

    async function handleFileUpload(excelFileInput) {
        const uploadStatus = document.getElementById('upload-status');
        const file = excelFileInput.files[0];
        if (!file) { uploadStatus.textContent = "Veuillez choisir un fichier."; uploadStatus.className = 'error'; return; }
        uploadStatus.textContent = "Lecture du fichier en cours..."; uploadStatus.className = '';
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonPlan = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const formattedPlan = formatPlanData(jsonPlan);
                if (formattedPlan.length === 0) throw new Error("Aucune donnée valide trouvée.");
                uploadStatus.textContent = `Fichier lu. ${formattedPlan.length} devoirs trouvés. Envoi en cours...`;
                const response = await fetch('/api/upload-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formattedPlan) });
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
            const filteredHomework = data.homeworks.find(hw => hw.teacher === selectedTeacher && hw.subject === selectedSubject);
            teacherHomeworkList.innerHTML = "";
            if (filteredHomework) {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${filteredHomework.subject}:</strong> ${filteredHomework.assignment}`;
                teacherHomeworkList.appendChild(p);
                const students = (studentData[selectedClass.split(' ')[0]] || []).map(s => s.name);
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
            console.error("Erreur:", error);
            teacherTableContainer.innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}</p>`; 
        }
    }
    
    async function submitTeacherEvaluations() {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const selectedClass = teacherDashboardView.querySelector('#teacher-class-select').value;
        const selectedDate = moment(teacherDashboardView.querySelector('#date-picker').value).format('YYYY-MM-DD');
        const selectedSubject = teacherDashboardView.querySelector('#teacher-subject-select').value;
        if (!selectedSubject) { alert("Erreur : aucune matière sélectionnée."); return; }
        const evaluations = Array.from(teacherDashboardView.querySelectorAll('.teacher-evaluation-table tbody tr')).map(row => ({
            studentName: row.dataset.student, class: selectedClass, date: selectedDate, subject: selectedSubject, status: row.querySelector('.status-select').value,
            participation: parseInt(row.querySelector('.participation-input').value, 10), behavior: parseInt(row.querySelector('.behavior-input').value, 10),
            comment: row.querySelector('.comment-input').value,
        }));
        try {
            const response = await fetch('/api/evaluations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ evaluations }) });
            if (!response.ok) throw new Error(`Erreur lors de l'enregistrement (statut ${response.status})`);
            alert("Évaluations enregistrées !");
        } catch (error) { 
            console.error("Erreur:", error); alert("Une erreur est survenue."); 
        }
    }

    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');

    function populateClassSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">${translations[document.documentElement.lang].selectDefault}</option>`;
        Object.keys(studentData).forEach(className => {
            const option = document.createElement('option');
            option.value = className; option.textContent = className; selectElement.appendChild(option);
        });
    }

    function populateDynamicSelect(selectId, dataArray) {
        const selectElement = document.getElementById(selectId);
        const currentVal = selectElement.value;
        selectElement.innerHTML = `<option value="">-- ${selectId.includes('class') ? 'Classe' : selectId.includes('name') ? 'Enseignant' : 'Matière'} --</option>`;
        (dataArray || []).forEach(item => {
            const option = document.createElement('option');
            option.value = item; option.textContent = item; selectElement.appendChild(option);
        });
        if (dataArray.includes(currentVal)) { selectElement.value = currentVal; }
    }

    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        const studentSelectorBox = document.getElementById('student-selector-box');
        studentSelect.innerHTML = `<option value="">${translations[document.documentElement.lang].selectDefault}</option>`;
        if (selectedClass && studentData[selectedClass]) {
            studentData[selectedClass].forEach(student => {
                const option = document.createElement('option');
                option.value = student.name; option.textContent = student.name; studentSelect.appendChild(option);
            });
            studentSelectorBox.style.display = 'block';
        } else { studentSelectorBox.style.display = 'none'; }
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
        const currentLang = document.documentElement.lang;
        const studentDashboardView = document.getElementById('student-dashboard-view');
        const studentPhotoElement = studentDashboardView.querySelector('.student-photo');
        const studentNameHeader = studentDashboardView.querySelector('#student-name-header');
        const homeworkDateElement = studentDashboardView.querySelector('#homework-date');
        const homeworkGrid = studentDashboardView.querySelector('#homework-grid');
        
        studentNameHeader.textContent = `${translations[currentLang].studentDashboardTitle} ${studentName}`;
        homeworkDateElement.textContent = `${translations[currentLang].homeworkFor} ${date.clone().locale(currentLang).format('dddd D MMMM YYYY')}`;
        homeworkGrid.innerHTML = `<p>${translations[currentLang].loading}</p>`;
        
        const student = (studentData[className] || []).find(s => s.name === studentName);
        if (student) {
            studentPhotoElement.src = student.photo;
            studentPhotoElement.alt = `Photo de ${studentName}`;
        }
        try {
            const dateQuery = date.format('YYYY-MM-DD'); // Toujours envoyer en format universel
            const response = await fetch(`/api/evaluations?class=${className}&student=${studentName}&date=${dateQuery}&week=true`);
            if (!response.ok) throw new Error(`Erreur du serveur (statut ${response.status})`);
            const data = await response.json();
            homeworkGrid.innerHTML = "";
            if (data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const dailyEval = data.evaluations.find(ev => ev.studentName === studentName && ev.subject === hw.subject) || {};
                    const getStatusClass = (status) => {
                        if (!status) return '';
                        return status.toLowerCase().replace(/ /g, '-');
                    };
                    const statusClass = getStatusClass(dailyEval.status);
                    const card = document.createElement('div');
                    card.className = 'subject-card';
                    card.innerHTML = `<h3><span>${hw.subject}</span><span class="status-lamp ${statusClass}"></span></h3><div class="content"><div class="assignment">${hw.assignment}</div><div class="comment-box">${dailyEval.comment || "..."}</div><div class="scores"><div><span>${translations[currentLang].evalTableHeaderBehavior}</span><span>${dailyEval.behavior ?? '-'}</span></div><div><span>${translations[currentLang].evalTableHeaderParticipation}</span><span>${dailyEval.participation ?? '-'}</span></div></div></div>`;
                    homeworkGrid.appendChild(card);
                });
            } else {
                homeworkGrid.innerHTML = `<p>${translations[currentLang].noHomeworkForDay}</p>`;
            }
            updateWeeklyStats(data.weeklyEvaluations || []);
        } catch (error) { 
            console.error("Erreur:", error);
            homeworkGrid.innerHTML = `<p class="error-message">${translations[currentLang].fetchError}</p>`; 
        }
    }

    function updateWeeklyStats(weeklyEvals) {
        let stars = 0;
        const dailyScores = {};
        (weeklyEvals || []).forEach(ev => {
            const dayKey = ev.date;
            if (!dailyScores[dayKey]) { dailyScores[dayKey] = { allDone: true, participationSum: 0, behaviorSum: 0, count: 0, hasHomework: true }; }
            if (ev.status !== 'Fait' && ev.status !== 'Absent') { dailyScores[dayKey].allDone = false; }
            dailyScores[dayKey].participationSum += ev.participation || 0;
            dailyScores[dayKey].behaviorSum += ev.behavior || 0;
            dailyScores[dayKey].count++;
        });
        Object.values(dailyScores).forEach(day => {
            if (day.hasHomework && day.allDone) {
                const avgParticipation = day.count > 0 ? day.participationSum / day.count : 0;
                const avgBehavior = day.count > 0 ? day.behaviorSum / day.count : 0;
                if (avgParticipation >= 5 && avgBehavior >= 5) { stars++; }
            }
        });
        const starContainer = document.getElementById('star-rating');
        starContainer.innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="star ${i < stars ? 'filled' : ''}">&#9733;</span>`).join('');
        const studentOfWeekBanner = document.getElementById('student-of-week-banner');
        if (stars >= 5) { studentOfWeekBanner.classList.add('active'); } else { studentOfWeekBanner.classList.remove('active'); }
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
