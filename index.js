document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES GLOBALES ---
    let currentDate = new Date();
    const classes = {
        PEI1: ["Faysal", "Bilal", "Jad", "Manaf"],
        PEI2: ["Ahmed", "Yasser", "Eyad", "Ali"],
        PEI3: ["Seifeddine", "Mohamed", "Wajih", "Ahmad", "Adam"],
        PEI4: ["Mohamed Younes", "Mohamed Amine", "Samir", "Abdulrahman", "Youssef"],
        DP2: ["Habib", "Salah"]
    };

    // --- DICTIONNAIRE DE TRADUCTION ---
    const translations = {
        fr: {
            portalTitle: "Portail de Suivi des Devoirs",
            parentSpace: "Espace Parent",
            teacherSpace: "Espace Enseignant",
            backButton: "Retour",
            teacherLoginTitle: "Accès Enseignant",
            usernamePlaceholder: "Nom d'utilisateur",
            passwordPlaceholder: "Mot de passe",
            loginButton: "Connexion",
            loginError: "Nom d'utilisateur ou mot de passe incorrect.",
            classSelectLabel: "Choisissez une classe :",
            studentSelectLabel: "Choisissez votre enfant :",
            selectDefault: "-- Sélectionnez --",
            studentDashboardTitle: "Tableau de bord de",
            weeklyProgressTitle: "Progrès Général de la Semaine",
            todayHomeworkTitle: "Devoirs pour Aujourd'hui",
            pastHomeworkTitle: "Historique des Devoirs (5 derniers jours)",
            loading: "Chargement...",
            noHomeworkToday: "Aucun devoir pour aujourd'hui.",
            noHomeworkHistory: "Aucun historique de devoir disponible.",
            fetchError: "Erreur de chargement des données.",
            teacherDashboardTitle: "Tableau de Bord Enseignant",
            teacherClassLabel: "Classe :",
            teacherSubjectLabel: "Matière du devoir :",
            subjectPlaceholder: "Ex: Mathématiques",
            evalTableHeaderStudent: "Élève",
            evalTableHeaderStatus: "Devoirs",
            evalTableHeaderParticipation: "Participation",
            evalTableHeaderBehavior: "Comportement",
            evalTableHeaderComment: "Commentaire",
            submitEvaluations: "Enregistrer les modifications",
            submitSuccess: "Évaluations envoyées avec succès !",
            selectClassAndSubject: "Veuillez sélectionner une classe et entrer une matière.",
            selectClassPrompt: "Veuillez sélectionner une classe.",
            homeworkForDay: "Devoirs du jour sélectionné :",
            noHomeworkForDay: "Aucun devoir enregistré pour ce jour.",
            homeworksFor: "Devoirs du :"
        },
        ar: {
            portalTitle: "بوابة متابعة الواجبات",
            parentSpace: "فضاء الولي",
            teacherSpace: "فضاء المربي",
            backButton: "رجوع",
            teacherLoginTitle: "دخول المربي",
            usernamePlaceholder: "اسم المستخدم",
            passwordPlaceholder: "كلمة المرور",
            loginButton: "دخول",
            loginError: "اسم المستخدم أو كلمة المرور غير صحيحة.",
            classSelectLabel: "اختر القسم:",
            studentSelectLabel: "اختر ابنك:",
            selectDefault: "-- اختر --",
            studentDashboardTitle: "لوحة متابعة",
            weeklyProgressTitle: "التقدم الأسبوعي العام",
            todayHomeworkTitle: "واجبات اليوم",
            pastHomeworkTitle: "سجل الواجبات (آخر 5 أيام)",
            loading: "جار التحميل...",
            noHomeworkToday: "لا توجد واجبات لليوم.",
            noHomeworkHistory: "لا يوجد سجل واجبات متاح.",
            fetchError: "خطأ في تحميل البيانات.",
            teacherDashboardTitle: "لوحة تحكم المربي",
            teacherClassLabel: "القسم:",
            teacherSubjectLabel: "مادة الواجب:",
            subjectPlaceholder: "مثال: رياضيات",
            evalTableHeaderStudent: "التلميذ",
            evalTableHeaderStatus: "الواجبات",
            evalTableHeaderParticipation: "المشاركة",
            evalTableHeaderBehavior: "السلوك",
            evalTableHeaderComment: "ملاحظة",
            submitEvaluations: "تسجيل التغييرات",
            submitSuccess: "تم إرسال التقييمات بنجاح!",
            selectClassAndSubject: "الرجاء اختيار قسم وإدخال المادة.",
            selectClassPrompt: "الرجاء اختيار قسم.",
            homeworkForDay: "واجبات اليوم المحدد:",
            noHomeworkForDay: "لا توجد واجبات مسجلة لهذا اليوم.",
            homeworksFor: "واجبات يوم :"
        }
    };

    // --- GESTION DE LA LANGUE ---
    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        const t = translations[lang];

        // Mettre à jour tous les éléments textuels
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        });
    };

    // --- NAVIGATION PRINCIPALE ---
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
    
    document.getElementById('lang-fr').addEventListener('click', () => setLanguage('fr'));
    document.getElementById('lang-ar').addEventListener('click', () => setLanguage('ar'));

    goToParentBtn.addEventListener('click', () => {
        populateClassSelect('class-select');
        showView('parent-selection-view');
    });

    goToTeacherBtn.addEventListener('click', () => showView('teacher-login-view'));

    backButtons.forEach(btn => {
        btn.addEventListener('click', goHome);
    });

    // --- ESPACE ENSEIGNANT - CONNEXION ---
    document.getElementById('teacher-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const loginError = document.getElementById('login-error');
        
        if (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!') {
            loginError.textContent = '';
            setupTeacherDashboard();
            showView('teacher-dashboard-view');
        } else {
            loginError.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
        }
    });

    // --- ESPACE ENSEIGNANT - TABLEAU DE BORD ---
    const datePicker = document.getElementById('date-picker');
    const teacherClassSelect = document.getElementById('teacher-class-select');
    const teacherTableContainer = document.getElementById('teacher-table-container');
    const teacherHomeworkList = document.getElementById('teacher-homework-list');

    function setupTeacherDashboard() {
        datePicker.valueAsDate = new Date();
        populateClassSelect('teacher-class-select');
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

            const students = classes[selectedClass] || [];
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
        } catch (error) {
            alert("Une erreur est survenue.");
        }
    }

    // --- ESPACE PARENT ---
    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');

    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        const studentSelectorBox = document.getElementById('student-selector-box');
        studentSelect.innerHTML = `<option value="">-- Sélectionnez --</option>`;
        if (selectedClass && classes[selectedClass]) {
            classes[selectedClass].forEach(student => {
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
            currentDate = new Date(); 
            await loadStudentDashboard(className, studentName, currentDate);
            showView('student-dashboard-view');
        }
    });

    document.getElementById('prev-day-btn').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        loadStudentDashboard(classSelect.value, studentSelect.value, currentDate);
    });

    document.getElementById('next-day-btn').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        loadStudentDashboard(classSelect.value, studentSelect.value, currentDate);
    });

    async function loadStudentDashboard(className, studentName, date) {
        document.getElementById('student-name-header').textContent = `Tableau de bord de ${studentName}`;
        document.getElementById('homework-date').textContent = `Devoirs du : ${date.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}`;
        const homeworkGrid = document.getElementById('homework-grid');
        homeworkGrid.innerHTML = `<p>Chargement...</p>`;

        try {
            const dateQuery = date.toISOString().split('T')[0];
            const response = await fetch(`/api/evaluations?class=${className}&student=${studentName}&date=${dateQuery}&week=true`);
            const data = await response.json();

            homeworkGrid.innerHTML = "";
            if (data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const dailyEval = data.evaluations.find(ev => ev.subject === hw.subject) || {};
                    const card = document.createElement('div');
                    card.className = 'subject-card';
                    card.dataset.subject = hw.subject;
                    card.innerHTML = `<h3>${hw.subject}</h3><div class="content"><div class="assignment">${hw.assignment}</div><div class="comment-box">${dailyEval.comment || "Aucun commentaire"}</div><div class="scores"><div>Comportement<span>${dailyEval.behavior ?? 'N/A'}</span></div><div>Participation<span>${dailyEval.participation ?? 'N/A'}</span></div></div></div>`;
                    homeworkGrid.appendChild(card);
                });
            } else {
                homeworkGrid.innerHTML = `<p>Aucun devoir pour ce jour.</p>`;
            }
            updateWeeklyStats(data.weeklyEvaluations || []);

        } catch (error) {
            homeworkGrid.innerHTML = `<p class="error-message">Erreur de chargement des données.</p>`;
        }
    }

    function updateWeeklyStats(weeklyEvals) {
        let stars = 0;
        const dailyScores = {};
        
        (weeklyEvals || []).forEach(ev => {
            const dayKey = new Date(ev.date).toISOString().split('T')[0];
            if (!dailyScores[dayKey]) {
                dailyScores[dayKey] = { allDone: true, participationSum: 0, behaviorSum: 0, count: 0 };
            }
            if (ev.status !== 'Fait') {
                dailyScores[dayKey].allDone = false;
            }
            dailyScores[dayKey].participationSum += ev.participation;
            dailyScores[dayKey].behaviorSum += ev.behavior;
            dailyScores[dayKey].count++;
        });
        
        Object.values(dailyScores).forEach(day => {
            if (day.allDone && (day.participationSum / day.count) >= 5 && (day.behaviorSum / day.count) >= 5) {
                stars++;
            }
        });

        const starContainer = document.getElementById('star-rating');
        starContainer.innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="star ${i < stars ? 'filled' : ''}">&#9733;</span>`).join('');
        document.getElementById('student-of-week-banner').classList.toggle('active', stars >= 5);

        let totalScore = 0, maxScore = 0;
        (weeklyEvals || []).forEach(ev => {
            totalScore += (ev.status === 'Fait' ? 10 : (ev.status === 'Partiellement Fait' ? 5 : 0)) + ev.participation + ev.behavior;
            maxScore += 30;
        });
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        document.getElementById('overall-progress-bar').style.width = `${percentage}%`;
        document.getElementById('overall-progress-text').textContent = `${percentage}%`;
    }

    // --- FONCTIONS UTILITAIRES ---
    function populateClassSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">-- Sélectionnez --</option>`;
        Object.keys(classes).forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            selectElement.appendChild(option);
        });
    }

    // --- INITIALISATION ---
    setLanguage('fr');
});
