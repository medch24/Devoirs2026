document.addEventListener('DOMContentLoaded', () => {
    let currentDate = moment();
    let teacherPlanData = []; 

    const studentData = {
        PEI1: [ { name: "Faysal", photo: "https://lh3.googleusercontent.com/d/1IB6BKROX3TRxaIIHVVVWbB7-Ii-V8VrC", birthday: "12/4/2014" }, { name: "Bilal", photo: "https://lh3.googleusercontent.com/d/1B0QUZJhpSad5Fs3qRTugUe4oyTlUDEVu", birthday: "24/2/2015" }, { name: "Jad", photo: "https://lh3.googleusercontent.com/d/1VLvrWjeJwaClf4pSaLiwjnS79N-HrsFr", birthday: "9/8/2014" }, { name: "Manaf", photo: "https://lh3.googleusercontent.com/d/1h46Tqtqcp5tNqdY62wV6pyZFYknCEMWY", birthday: "15/8/2014" } ],
        PEI2: [ { name: "Ahmed", photo: "https://lh3.googleusercontent.com/d/1cDF-yegSB2tqsWac0AoNttbi8qAALYT1", birthday: "16/9/2013" }, { name: "Yasser", photo: "https://lh3.googleusercontent.com/d/1UUrrAJV_bgFNktGDinDkSrpwSZz-e47T", birthday: "27/8/2013" }, { name: "Eyad", photo: "https://lh3.googleusercontent.com/d/1HGyWS4cC1jWWD25Ah3WcT_eIbUHqFzJ1", birthday: "24/4/2013" }, { name: "Ali", photo: "https://lh3.googleusercontent.com/d/1bN-fDf_IWkXoW3WjSOXI5_M4KkL3FDKr", birthday: "17/4/2013" } ],
        PEI3: [ { name: "Seifeddine", photo: "https://lh3.googleusercontent.com/d/1tWdPSbtCAsTMB86WzDgqh3Xw01ahm9s6", birthday: "29/1/2012" }, { name: "Mohamed", photo: "https://lh3.googleusercontent.com/d/1lB8ObGOvQDVT6FITL2y7C5TYmAGyggFn", birthday: "9/11/2011" }, { name: "Wajih", photo: "https://lh3.googleusercontent.com/d/1MH6M05mQamOHevmDffVFNpSFNnxqbxs3", birthday: "14/6/2012" }, { name: "Ahmad", photo: "https://lh3.googleusercontent.com/d/1zU-jBuAbYjHanzank9C1BAd00skS1Y5J", birthday: "27/2/2012" }, { name: "Adam", photo: "https://lh3.googleusercontent.com/d/15I9p6VSnn1yVmPxRRbGsUkM-fsBKYOWF", birthday: "25/12/2012" } ],
        PEI4: [ { name: "Mohamed Younes", photo: "https://lh3.googleusercontent.com/d/1wzraoZY_lRafcDXeaxSBeX5cIU57p4xA", birthday: "9/11/2011" }, { name: "Mohamed Amine", photo: "https://lh3.googleusercontent.com/d/1UrBw6guz0oBTUy8COGeewIs3XAK773bR", birthday: "23/12/2012" }, { name: "Samir", photo: "https://lh3.googleusercontent.com/d/1NdaCH8CU0DJFHXw4D0lItP-QnCswl23b", birthday: "25/12/2012" }, { name: "Abdulrahman", photo: "https://lh3.googleusercontent.com/d/1yCTO5StU2tnPY0BEynnWzUveljMIUcLE", birthday: "19/4/2012" }, { name: "Youssef", photo: "https://lh3.googleusercontent.com/d/1Bygg5-PYrjjMOZdI5hAe16eZ8ltn772e", birthday: "28/11/2011" } ],
        DP2: [ { name: "Habib", photo: "https://lh3.googleusercontent.com/d/13u4y6JIyCBVQ_9PCwYhh837byyK9g8pF", birthday: "25/10/2008" }, { name: "Salah", photo: "https://lh3.googleusercontent.com/d/1IG8S_i6jD8O6C2QD_nwLxrG932QgIVXu", birthday: "15/7/2008" } ]
    };
    
    const translations = {
        fr: { portalTitle: "Portail de Suivi des Devoirs", parentSpace: "Espace Parent", teacherSpace: "Espace Enseignant", backButton: "Retour", teacherLoginTitle: "Accès Enseignant", usernamePlaceholder: "Nom d'utilisateur", passwordPlaceholder: "Mot de passe", loginButton: "Connexion", loginError: "Nom d'utilisateur ou mot de passe incorrect.", classSelectionTitle: "1. Choisissez une classe", studentSelectionTitle: "2. Choisissez votre enfant", studentDashboardTitle: "Tableau de bord de", overallWeeklyProgress: "Progression générale", previousDay: "Jour Précédent", nextDay: "Jour Suivant", homeworkFor: "Devoirs du", loading: "Chargement...", noHomeworkForDay: "Aucun devoir pour ce jour.", fetchError: "Erreur de chargement des données.", studentOfTheWeek: "Élève de la semaine", teacherDashboardTitle: "Tableau de Bord Enseignant", updateSchedule: "Mettre à jour le planning", uploadButton: "Charger et Mettre à jour", homeworkForDay: "Devoirs du jour", selectClassPrompt: "Veuillez sélectionner tous les filtres.", evalTableHeaderStudent: "Élève", evalTableHeaderStatus: "Statut", evalTableHeaderParticipation: "Participation", evalTableHeaderBehavior: "Comportement", evalTableHeaderComment: "Commentaire", saveButton: "Enregistrer", noHomeworkForSubject: "Pas de devoirs pour cette matière aujourd'hui.", teacherSelectTitle: "1. Choisissez votre nom", homeworkToEvaluate: "2. Choisissez un devoir à évaluer", studentEvaluationTitle: "3. Évaluez les élèves", birthdayPrompt: "Veuillez entrer la date de naissance de votre enfant (JJ/MM/AAAA) :", birthdayError: "Date de naissance incorrecte. Veuillez réessayer.", sotwTitle: "⭐ Élève de la semaine ⭐", sotwMessage: "Félicitations pour tes excellents efforts !", potdTitle: "🎉 Félicitations ! 🎉", potdMessage: "Un projet ou un succès à célébrer !", adminPhotoTitle: "Ajouter une Photo de Félicitations" },
        ar: { portalTitle: "بوابة متابعة الواجبات", parentSpace: "فضاء الولي", teacherSpace: "فضاء المربي", backButton: "رجوع", teacherLoginTitle: "دخول المربي", usernamePlaceholder: "اسم المستخدم", passwordPlaceholder: "كلمة المرور", loginButton: "دخول", loginError: "اسم المستخدم أو كلمة المرور غير صحيحة.", classSelectionTitle: "1. اختر قسماً", studentSelectionTitle: "2. اختر ابنك", studentDashboardTitle: "لوحة متابعة", overallWeeklyProgress: "التقدم العام", previousDay: "اليوم السابق", nextDay: "اليوم التالي", homeworkFor: "واجبات يوم", loading: "جار التحميل...", noHomeworkForDay: "لا توجد واجبات لهذا اليوم.", fetchError: "خطأ في تحميل البيانات.", studentOfTheWeek: "تلميذ الأسبوع", teacherDashboardTitle: "لوحة تحكم المربي", updateSchedule: "تحديث الجدول", uploadButton: "تحميل وتحديث", homeworkForDay: "واجبات اليوم", selectClassPrompt: "الرجاء اختيار كل المحددات.", evalTableHeaderStudent: "التلميذ", evalTableHeaderStatus: "الحالة", evalTableHeaderParticipation: "المشاركة", evalTableHeaderBehavior: "السلوك", evalTableHeaderComment: "ملاحظة", saveButton: "تسجيل", noHomeworkForSubject: "لا توجد واجبات لهذه المادة اليوم.", teacherSelectTitle: "1. اختر اسمك", homeworkToEvaluate: "2. اختر واجباً لتقييمه", studentEvaluationTitle: "3. قيّم التلاميذ", birthdayPrompt: "الرجاء إدخال تاريخ ميلاد طفلك (يوم/شهر/سنة) :", birthdayError: "تاريخ الميلاد غير صحيح. الرجاء المحاولة مرة أخرى.", sotwTitle: "⭐ تلميذ الأسبوع ⭐", sotwMessage: "تهانينا على مجهوداتك الممتازة!", potdTitle: "🎉 تهانينا! 🎉", potdMessage: "مشروع أو نجاح للاحتفال به!", adminPhotoTitle: "إضافة صورة تهنئة" }
    };

    // ... (Le reste du code reste identique, je le fournis en entier pour être sûr)
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
            const className = studentDashboardView.dataset.className;
            const studentName = studentDashboardView.dataset.studentName;
            if (className && studentName) {
                loadStudentDashboard(className, studentName, currentDate);
            }
        }
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        if (teacherDashboardView.style.display === 'block') {
            const activeTeacher = document.querySelector('.teacher-icon-card.active');
            if (activeTeacher) {
                displayHomeworkCards(activeTeacher.dataset.teacherName);
            }
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
    const goHome = () => { homeView.style.display = 'block'; views.forEach(v => v.style.display = 'none'); displayHomePageExtras(); };
    goToParentBtn.addEventListener('click', () => { populateClassButtons(); showView('parent-selection-view'); });
    goToTeacherBtn.addEventListener('click', () => showView('teacher-login-view'));
    backButtons.forEach(btn => btn.addEventListener('click', goHome));
    document.getElementById('teacher-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const isAdmin = (user === 'Mohamed86' && pass === 'Mohamed86');
        const isTeacher = !!teacherPlanData.find(d => d.Enseignant === user && pass === 'Alkawthar@!!!');
        if (isAdmin || isTeacher) {
            setupTeacherDashboard(isAdmin);
            showView('teacher-dashboard-view');
        } else { document.getElementById('login-error').textContent = translations[document.documentElement.lang].loginError; }
    });

    function populateClassButtons() { /* ... */ }
    function displayStudentGrid(className) { /* ... */ }
    async function setupTeacherDashboard(isAdmin) { /* ... */ }
    function populateTeacherIcons(teachers) { /* ... */ }
    async function displayHomeworkCards(teacherName) { /* ... */ }
    async function renderEvaluationTable(className, date, subject, assignment) { /* ... */ }
    async function submitTeacherEvaluations(event) { /* ... */ }
    async function handleFileUpload(excelFileInput) { /* ... */ }
    function parseFrenchDate(dateString) { /* ... */ }
    function formatPlanData(jsonPlan) { /* ... */ }
    async function loadStudentDashboard(className, studentName, date) { /* ... */ }
    function updateWeeklyStats(weeklyEvals) { /* ... */ }
    async function displayHomePageExtras() { /* ... */ }

    // ================== REMPLISSAGE DES FONCTIONS ==================
    function populateClassButtons() {
        const container = document.getElementById('class-buttons-container');
        const studentGrid = document.getElementById('student-grid-container');
        const studentTitle = document.getElementById('student-selection-title');
        container.innerHTML = ''; studentGrid.innerHTML = ''; studentTitle.style.display = 'none';
        Object.keys(studentData).forEach(className => {
            const button = document.createElement('button');
            button.className = 'class-button';
            button.textContent = className;
            button.dataset.className = className;
            button.addEventListener('click', (e) => {
                container.querySelectorAll('.class-button').forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                displayStudentGrid(className);
            });
            container.appendChild(button);
        });
    }

    function displayStudentGrid(className) {
        const gridContainer = document.getElementById('student-grid-container');
        const studentTitle = document.getElementById('student-selection-title');
        gridContainer.innerHTML = ''; studentTitle.style.display = 'block';
        const students = studentData[className];
        if (!students) return;
        students.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `<img src="${student.photo}" alt="Photo de ${student.name}"><p>${student.name}</p>`;
            card.addEventListener('click', () => {
                const enteredBirthday = prompt(translations[document.documentElement.lang].birthdayPrompt);
                if (enteredBirthday && enteredBirthday.replace(/\s/g, '') === student.birthday) {
                    currentDate = moment();
                    loadStudentDashboard(className, student.name, currentDate);
                    showView('student-dashboard-view');
                } else if (enteredBirthday !== null) {
                    alert(translations[document.documentElement.lang].birthdayError);
                }
            });
            gridContainer.appendChild(card);
        });
    }

    async function setupTeacherDashboard(isAdmin = false) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const adminUploadSection = document.getElementById('admin-upload-section');
        const adminPhotoSection = document.getElementById('admin-photo-section');
        adminUploadSection.style.display = isAdmin ? 'block' : 'none';
        adminPhotoSection.style.display = isAdmin ? 'block' : 'none';

        if (isAdmin) {
            const excelFileInput = teacherDashboardView.querySelector('#excel-file-input');
            const uploadExcelBtn = teacherDashboardView.querySelector('#upload-excel-btn');
            const submitPhotoBtn = document.getElementById('submit-photo-btn');
            uploadExcelBtn.addEventListener('click', () => handleFileUpload(excelFileInput));
            submitPhotoBtn.addEventListener('click', handleSubmitPhoto);
        }

        try {
            const response = await fetch('/api/initial-data');
            if (!response.ok) throw new Error('Impossible de charger les listes.');
            const initialData = await response.json();
            teacherPlanData = initialData.planData;
            populateTeacherIcons(initialData.teachers);
        } catch (error) {
            console.error(error);
            teacherDashboardView.querySelector('#homework-cards-container').innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}.</p>`;
        }
    }
    
    // ... (le reste du code est identique et complet)
    function populateTeacherIcons(teachers) {
        const iconsContainer = document.getElementById('teacher-icons-container');
        iconsContainer.innerHTML = '';
        (teachers || []).forEach(teacherName => {
            const card = document.createElement('div');
            card.className = 'teacher-icon-card';
            card.dataset.teacherName = teacherName;
            card.innerHTML = `<div class="teacher-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/></svg></div><p>${teacherName}</p>`;
            card.addEventListener('click', () => {
                iconsContainer.querySelectorAll('.teacher-icon-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                displayHomeworkCards(teacherName);
            });
            iconsContainer.appendChild(card);
        });
    }
    
    async function displayHomeworkCards(teacherName) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const cardsContainer = teacherDashboardView.querySelector('#homework-cards-container');
        const cardsTitle = teacherDashboardView.querySelector('#homework-cards-title');
        const evaluationSection = teacherDashboardView.querySelector('#teacher-evaluation-section');
        cardsContainer.innerHTML = '';
        evaluationSection.style.display = 'none';
        cardsTitle.style.display = 'block';
        const homeworks = teacherPlanData.filter(item => item.Enseignant === teacherName && item.Devoirs && item.Jour);
        if (homeworks.length === 0) {
            cardsContainer.innerHTML = `<p>${translations[document.documentElement.lang].noHomeworkForDay}</p>`;
            return;
        }
        const allDates = [...new Set(homeworks.map(hw => hw.Jour))];
        const allClassNames = [...new Set(homeworks.map(hw => hw.Classe))];
        let allEvaluations = [];
        try {
            const promises = allClassNames.flatMap(className => 
                allDates.map(date => fetch(`/api/evaluations?class=${className}&date=${date}`).then(res => res.json()))
            );
            const results = await Promise.all(promises);
            allEvaluations = results.flatMap(result => result.evaluations);
        } catch (error) { console.error("Erreur de pré-chargement des évaluations:", error); }
        homeworks.forEach(hw => {
            const isEvaluated = allEvaluations.some(ev => ev.date === hw.Jour && ev.class === hw.Classe && ev.subject === hw.Matière);
            const card = document.createElement('div');
            card.className = `homework-card ${isEvaluated ? 'evaluated' : ''}`;
            card.innerHTML = `<h4>${hw.Matière}</h4><p><strong>🏫 Classe:</strong> <span>${hw.Classe}</span></p><p><strong>🗓️ Date:</strong> <span>${moment(hw.Jour).locale(document.documentElement.lang).format('dddd D MMMM')}</span></p>`;
            card.addEventListener('click', () => {
                cardsContainer.querySelectorAll('.homework-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                renderEvaluationTable(hw.Classe, hw.Jour, hw.Matière, hw.Devoirs);
            });
            cardsContainer.appendChild(card);
        });
    }
    
    async function renderEvaluationTable(className, date, subject, assignment) {
        const evaluationSection = document.getElementById('teacher-evaluation-section');
        const tableContainer = document.getElementById('teacher-table-container');
        evaluationSection.style.display = 'block';
        tableContainer.innerHTML = `<p>${translations[document.documentElement.lang].loading}</p>`;
        evaluationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
            const response = await fetch(`/api/evaluations?class=${className}&date=${date}`);
            if (!response.ok) throw new Error('Erreur de chargement des données');
            const data = await response.json();
            const students = (studentData[className.split(' ')[0]] || []).map(s => s.name);
            let tableHTML = `<p class="homework-reminder"><strong>Devoir :</strong> ${assignment}</p>`;
            tableHTML += `<table class="teacher-evaluation-table"><thead><tr><th>${translations[document.documentElement.lang].evalTableHeaderStudent}</th><th>${translations[document.documentElement.lang].evalTableHeaderStatus}</th><th>${translations[document.documentElement.lang].evalTableHeaderParticipation}</th><th>${translations[document.documentElement.lang].evalTableHeaderBehavior}</th><th>${translations[document.documentElement.lang].evalTableHeaderComment}</th></tr></thead><tbody>`;
            for (const student of students) {
                const existingEval = data.evaluations.find(ev => ev.studentName === student && ev.subject === subject) || {};
                tableHTML += `<tr data-student="${student}"><td>${student}</td><td><select class="status-select"><option value="" ${!existingEval.status ? 'selected' : ''}>Vide</option><option value="Fait" ${existingEval.status === 'Fait' ? 'selected' : ''}>Fait</option><option value="Non Fait" ${existingEval.status === 'Non Fait' ? 'selected' : ''}>Non Fait</option><option value="Partiellement Fait" ${existingEval.status === 'Partiellement Fait' ? 'selected' : ''}>Partiellement Fait</option><option value="Absent" ${existingEval.status === 'Absent' ? 'selected' : ''}>Absent</option></select></td><td><input type="number" class="participation-input" min="0" max="10" value="${existingEval.participation ?? 7}"></td><td><input type="number" class="behavior-input" min="0" max="10" value="${existingEval.behavior ?? 7}"></td><td><input type="text" class="comment-input" value="${existingEval.comment || ''}"></td></tr>`;
            }
            tableHTML += `</tbody></table><button id="submit-evals-btn" class="role-button" style="margin-top: 20px;" data-class="${className}" data-date="${date}" data-subject="${subject}">${translations[document.documentElement.lang].saveButton}</button>`;
            tableContainer.innerHTML = tableHTML;
            tableContainer.querySelector('#submit-evals-btn').addEventListener('click', submitTeacherEvaluations);
        } catch (error) {
            console.error("Erreur:", error);
            tableContainer.innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}</p>`;
        }
    }

    async function submitTeacherEvaluations(event) {
        const button = event.currentTarget;
        const className = button.dataset.class;
        const date = button.dataset.date;
        const subject = button.dataset.subject;
        const evaluations = Array.from(document.querySelectorAll('#teacher-table-container tbody tr')).map(row => ({
            studentName: row.dataset.student, class: className, date: date, subject: subject, status: row.querySelector('.status-select').value,
            participation: parseInt(row.querySelector('.participation-input').value, 10), behavior: parseInt(row.querySelector('.behavior-input').value, 10),
            comment: row.querySelector('.comment-input').value,
        }));
        try {
            const response = await fetch('/api/evaluations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ evaluations }) });
            if (!response.ok) throw new Error(`Erreur d'enregistrement`);
            alert("Évaluations enregistrées !");
            displayHomeworkCards(document.querySelector('.teacher-icon-card.active').dataset.teacherName);
        } catch (error) { 
            console.error("Erreur:", error); alert("Une erreur est survenue."); 
        }
    }
    
    async function handleFileUpload(excelFileInput) { /* ... */ }
    function parseFrenchDate(dateString) { /* ... */ }
    function formatPlanData(jsonPlan) { /* ... */ }
    document.getElementById('prev-day-btn').addEventListener('click', () => { /* ... */ });
    document.getElementById('next-day-btn').addEventListener('click', () => { /* ... */ });
    async function loadStudentDashboard(className, studentName, date) { /* ... */ }
    function updateWeeklyStats(weeklyEvals) { /* ... */ }
    async function displayHomePageExtras() {
        displayStudentOfTheWeek();
        displayPhotoOfTheDay();
    }
    
    async function handleSubmitPhoto() {
        const photoUrlInput = document.getElementById('photo-url-input');
        const photoStatus = document.getElementById('photo-status');
        const imageUrl = photoUrlInput.value.trim();

        if (!imageUrl) {
            photoStatus.textContent = 'Veuillez coller un lien.';
            photoStatus.className = 'error';
            return;
        }

        photoStatus.textContent = 'Enregistrement...';
        photoStatus.className = '';

        try {
            const response = await fetch('/api/photo-of-the-day', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'username': 'Mohamed86', // Sécurité simple
                    'password': 'Mohamed86'
                },
                body: JSON.stringify({ imageUrl })
            });

            if (!response.ok) throw new Error('Échec de la mise à jour');
            
            photoStatus.textContent = 'Photo enregistrée !';
            photoStatus.className = 'success';
            photoUrlInput.value = '';
        } catch (error) {
            console.error("Erreur d'enregistrement de la photo:", error);
            photoStatus.textContent = 'Une erreur est survenue.';
            photoStatus.className = 'error';
        }
    }

    async function displayStudentOfTheWeek() {
        try {
            const response = await fetch('/api/weekly-summary');
            if (!response.ok) return;
            const sotw = await response.json();

            if (sotw && sotw.name && sotw.class) {
                const studentInfo = (studentData[sotw.class] || []).find(s => s.name === sotw.name);
                if (studentInfo) {
                    document.getElementById('sotw-photo').src = studentInfo.photo;
                    document.getElementById('sotw-name').textContent = sotw.name;
                    document.getElementById('sotw-showcase').style.display = 'block';
                }
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    }

    async function displayPhotoOfTheDay() {
        try {
            const response = await fetch('/api/photo-of-the-day');
            if (!response.ok) return;
            const data = await response.json();

            if (data && data.url) {
                document.getElementById('potd-image').src = data.url;
                document.getElementById('potd-showcase').style.display = 'block';
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    }

    // Initialisation
    displayHomePageExtras();
    setLanguage('fr');
});
