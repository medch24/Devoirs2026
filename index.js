document.addEventListener('DOMContentLoaded', () => {
    console.log("Le script index.js est chargé et s'exécute.");

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
            evalTableHeaderStatus: "Statut Devoir",
            evalTableHeaderParticipation: "Participation (/10)",
            evalTableHeaderBehavior: "Comportement (/10)",
            evalTableHeaderComment: "Commentaire",
            submitEvaluations: "Envoyer les Évaluations",
            submitSuccess: "Évaluations envoyées avec succès !",
            selectClassAndSubject: "Veuillez sélectionner une classe et entrer une matière."
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
            evalTableHeaderStatus: "حالة الواجب",
            evalTableHeaderParticipation: "المشاركة (/10)",
            evalTableHeaderBehavior: "السلوك (/10)",
            evalTableHeaderComment: "ملاحظة",
            submitEvaluations: "إرسال التقييمات",
            submitSuccess: "تم إرسال التقييمات بنجاح!",
            selectClassAndSubject: "الرجاء اختيار قسم وإدخال المادة."
        }
    };

    // --- GESTION DE LA LANGUE ---
    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        const t = translations[lang];

        // Page d'accueil
        document.querySelector('#home-view h1').textContent = t.portalTitle;
        document.getElementById('go-to-parent').textContent = t.parentSpace;
        document.getElementById('go-to-teacher').textContent = t.teacherSpace;

        // Boutons retour
        document.querySelectorAll('.back-button').forEach(btn => btn.textContent = lang === 'ar' ? '→ رجوع' : '← Retour');
        
        // Espace enseignant
        document.getElementById('teacher-login-title').textContent = t.teacherLoginTitle;
        document.getElementById('username').placeholder = t.usernamePlaceholder;
        document.getElementById('password').placeholder = t.passwordPlaceholder;
        document.querySelector('#teacher-login-form button').textContent = t.loginButton;
        document.getElementById('teacher-dashboard-title').textContent = t.teacherDashboardTitle;
        document.getElementById('teacher-class-label').textContent = t.teacherClassLabel;
        document.getElementById('teacher-subject-label').textContent = t.teacherSubjectLabel;
        document.getElementById('teacher-subject-select').placeholder = t.subjectPlaceholder;
        document.getElementById('submit-evaluations').textContent = t.submitEvaluations;

        // Espace parent
        document.getElementById('parent-selection-title').textContent = t.parentSpace;
        document.getElementById('class-select-label').textContent = t.classSelectLabel;
        document.getElementById('student-select-label').textContent = t.studentSelectLabel;
        document.getElementById('weekly-progress-title').textContent = t.weeklyProgressTitle;
        document.getElementById('today-homework-title').textContent = t.todayHomeworkTitle;
        document.getElementById('past-homework-title').textContent = t.pastHomeworkTitle;
    };

    document.getElementById('lang-fr').addEventListener('click', () => setLanguage('fr'));
    document.getElementById('lang-ar').addEventListener('click', () => setLanguage('ar'));
    
    // --- Logique de l'application ---

    const views = document.querySelectorAll('.view');
    const homeView = document.getElementById('home-view');
    const goToParentBtn = document.getElementById('go-to-parent');
    const goToTeacherBtn = document.getElementById('go-to-teacher');
    const backButtons = document.querySelectorAll('.back-button');

    const classes = {
        PEI1: ["Faysal", "Bilal", "Jad", "Manaf"],
        PEI2: ["Ahmed", "Yasser", "Eyad", "Ali"],
        PEI3: ["Seifeddine", "Mohamed", "Wajih", "Ahmad", "Adam"],
        PEI4: ["Mohamed Younes", "Mohamed Amine", "Samir", "Abdulrahman", "Youssef"],
        DP2: ["Habib", "Salah"]
    };

    const showView = (viewId) => {
        homeView.style.display = 'none';
        views.forEach(v => v.style.display = 'none');
        const viewToShow = document.getElementById(viewId);
        if (viewToShow) {
            viewToShow.style.display = 'block';
        } else {
            console.error(`La vue avec l'ID "${viewId}" n'a pas été trouvée.`);
        }
    };
    
    const goHome = () => {
        homeView.style.display = 'block';
        views.forEach(v => v.style.display = 'none');
    };

    goToParentBtn.addEventListener('click', () => {
        populateClassSelect('class-select');
        showView('parent-selection-view');
    });

    goToTeacherBtn.addEventListener('click', () => showView('teacher-login-view'));

    backButtons.forEach(btn => btn.addEventListener('click', () => {
        const currentView = btn.closest('.view');
        if (!currentView) return goHome();

        switch (currentView.id) {
            case 'student-dashboard-view':
                showView('parent-selection-view');
                break;
            case 'teacher-dashboard-view':
                showView('teacher-login-view');
                break;
            default:
                goHome();
                break;
        }
    }));
    
    // --- Espace Enseignant ---
    const teacherLoginForm = document.getElementById('teacher-login-form');
    teacherLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const loginError = document.getElementById('login-error');
        
        if (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!') {
            loginError.textContent = '';
            setupTeacherDashboard();
            showView('teacher-dashboard-view');
        } else {
            loginError.textContent = translations[document.documentElement.lang].loginError;
        }
    });

    const teacherClassSelect = document.getElementById('teacher-class-select');
    const evaluationTableContainer = document.getElementById('evaluation-table-container');

    function setupTeacherDashboard() {
        populateClassSelect('teacher-class-select');
        teacherClassSelect.addEventListener('change', renderEvaluationTable);
        document.getElementById('teacher-subject-select').addEventListener('input', renderEvaluationTable);
        renderEvaluationTable();
    }

    function renderEvaluationTable() {
        const selectedClass = teacherClassSelect.value;
        const subject = document.getElementById('teacher-subject-select').value;
        const currentLang = document.documentElement.lang;
        const t = translations[currentLang];

        if (!selectedClass || !subject) {
            evaluationTableContainer.innerHTML = `<p>${t.selectClassAndSubject}</p>`;
            return;
        }
        
        const students = classes[selectedClass] || [];
        let tableHTML = `
            <table class="evaluation-table">
                <thead>
                    <tr>
                        <th>${t.evalTableHeaderStudent}</th>
                        <th>${t.evalTableHeaderStatus}</th>
                        <th>${t.evalTableHeaderParticipation}</th>
                        <th>${t.evalTableHeaderBehavior}</th>
                        <th>${t.evalTableHeaderComment}</th>
                    </tr>
                </thead>
                <tbody>`;
        students.forEach(student => {
            tableHTML += `
                <tr data-student="${student}">
                    <td>${student}</td>
                    <td>
                        <select class="status-select">
                            <option value="Fait">Fait</option>
                            <option value="Non Fait">Non Fait</option>
                            <option value="Partiellement Fait">Partiellement Fait</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </td>
                    <td><input type="number" class="participation-input" min="1" max="10" value="8"></td>
                    <td><input type="number" class="behavior-input" min="1" max="10" value="8"></td>
                    <td><input type="text" class="comment-input" placeholder="..."></td>
                </tr>`;
        });
        tableHTML += `</tbody></table>`;
        evaluationTableContainer.innerHTML = tableHTML;
    }
    
    document.getElementById('submit-evaluations').addEventListener('click', async () => {
        const selectedClass = teacherClassSelect.value;
        const subject = document.getElementById('teacher-subject-select').value;
        const successMessage = document.getElementById('submit-success-message');
        const t = translations[document.documentElement.lang];
        
        if (!selectedClass || !subject) {
            alert(t.selectClassAndSubject);
            return;
        }

        const evaluations = Array.from(document.querySelectorAll('.evaluation-table tbody tr')).map(row => ({
            studentName: row.dataset.student,
            class: selectedClass,
            subject: subject,
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

            if (!response.ok) throw new Error('Erreur lors de la soumission');
            
            successMessage.textContent = t.submitSuccess;
            setTimeout(() => successMessage.textContent = '', 3000);
            renderEvaluationTable(); // Clear table by re-rendering
        } catch (error) {
            console.error(error);
            alert("Une erreur s'est produite.");
        }
    });

    // --- Espace Parent ---
    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');
    const studentSelectorBox = document.getElementById('student-selector-box');

    function populateClassSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        const t = translations[document.documentElement.lang];
        selectElement.innerHTML = `<option value="">${t.selectDefault}</option>`;
        Object.keys(classes).forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            selectElement.appendChild(option);
        });
    }

    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        const t = translations[document.documentElement.lang];
        studentSelect.innerHTML = `<option value="">${t.selectDefault}</option>`;
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
            await loadStudentDashboard(className, studentName);
            showView('student-dashboard-view');
        }
    });

    async function loadStudentDashboard(className, studentName) {
        const t = translations[document.documentElement.lang];
        document.getElementById('student-name-header').textContent = `${t.studentDashboardTitle} ${studentName}`;
        
        const todayList = document.getElementById('today-homework-list');
        const pastList = document.getElementById('past-homework-list');
        todayList.innerHTML = `<p>${t.loading}</p>`;
        pastList.innerHTML = `<p>${t.loading}</p>`;

        try {
            const response = await fetch(`/api/evaluations?class=${encodeURIComponent(className)}&student=${encodeURIComponent(studentName)}`);
            if (!response.ok) throw new Error('Data fetch failed');
            const data = await response.json();
            
            todayList.innerHTML = '';
            if (data.todayHomework && data.todayHomework.length > 0) {
                data.todayHomework.forEach(hw => {
                    const item = document.createElement('div');
                    item.className = 'homework-item';
                    item.innerHTML = `<div class="homework-info"><h4>${hw.subject}</h4><p>${hw.assignment}</p></div>`;
                    todayList.appendChild(item);
                });
            } else {
                todayList.innerHTML = `<p>${t.noHomeworkToday}</p>`;
            }

            pastList.innerHTML = '';
            if (data.pastEvaluations && data.pastEvaluations.length > 0) {
                data.pastEvaluations.forEach(ev => {
                    const statusMap = {"Fait": "green", "Non Fait": "red", "Partiellement Fait": "orange", "Absent": "orange"};
                    const item = document.createElement('div');
                    item.className = 'homework-item';
                    item.innerHTML = `
                        <div class="homework-info">
                            <h4>${ev.subject} (${new Date(ev.date).toLocaleDateString()})</h4>
                            ${ev.comment ? `<p class="remark">"${ev.comment}"</p>` : ''}
                        </div>
                        <div class="status-dot ${statusMap[ev.status] || 'orange'}"></div>`;
                    pastList.appendChild(item);
                });
            } else {
                pastList.innerHTML = `<p>${t.noHomeworkHistory}</p>`;
            }
            
            const progress = data.weeklyProgress || 0;
            document.getElementById('thermometer-progress').style.width = `${progress}%`;
            document.getElementById('thermometer-percentage').textContent = `${progress}%`;

        } catch (error) {
            console.error('Erreur lors du chargement du tableau de bord:', error);
            todayList.innerHTML = `<p class="error-message">${t.fetchError}</p>`;
            pastList.innerHTML = `<p class="error-message">${t.fetchError}</p>`;
        }
    }

    // Initialiser la langue par défaut au chargement
    setLanguage('fr'); 
});
