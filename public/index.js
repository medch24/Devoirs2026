document.addEventListener('DOMContentLoaded', () => {
    let currentDate = moment();
    let teacherPlanData = []; 

    const studentData = {
        PEI1: [ { name: "Faysal", photo: "https://lh3.googleusercontent.com/d/1IB6BKROX3TRxaIIHVVVWbB7-Ii-V8VrC", birthday: "4/2014" }, { name: "Bilal", photo: "https://lh3.googleusercontent.com/d/1B0QUZJhpSad5Fs3qRTugUe4oyTlUDEVu", birthday: "2/2015" }, { name: "Jad", photo: "https://lh3.googleusercontent.com/d/1VLvrWjeJwaClf4pSaLiwjnS79N-HrsFr", birthday: "8/2014" }, { name: "Manaf", photo: "https://lh3.googleusercontent.com/d/1h46Tqtqcp5tNqdY62wV6pyZFYknCEMWY", birthday: "8/2014" } ],
        PEI2: [ { name: "Ahmed", photo: "https://lh3.googleusercontent.com/d/1cDF-yegSB2tqsWac0AoNttbi8qAALYT1", birthday: "9/2013" }, { name: "Yasser", photo: "https://lh3.googleusercontent.com/d/1UUrrAJV_bgFNktGDinDkSrpwSZz-e47T", birthday: "8/2013" }, { name: "Eyad", photo: "https://lh3.googleusercontent.com/d/1HGyWS4cC1jWWD25Ah3WcT_eIbUHqFzJ1", birthday: "4/2013" }, { name: "Ali", photo: "https://lh3.googleusercontent.com/d/1bN-fDf_IWkXoW3WjSOXI5_M4KkL3FDKr", birthday: "4/2013" } ],
        PEI3: [ { name: "Seifeddine", photo: "https://lh3.googleusercontent.com/d/1tWdPSbtCAsTMB86WzDgqh3Xw01ahm9s6", birthday: "1/2012" }, { name: "Mohamed", photo: "https://lh3.googleusercontent.com/d/1lB8ObGOvQDVT6FITL2y7C5TYmAGyggFn", birthday: "11/2011" }, { name: "Wajih", photo: "https://lh3.googleusercontent.com/d/1MH6M05mQamOHevmDffVFNpSFNnxqbxs3", birthday: "6/2012" }, { name: "Ahmad", photo: "https://lh3.googleusercontent.com/d/1zU-jBuAbYjHanzank9C1BAd00skS1Y5J", birthday: "2/2012" }, { name: "Adam", photo: "https://lh3.googleusercontent.com/d/15I9p6VSnn1yVmPxRRbGsUkM-fsBKYOWF", birthday: "12/2012" } ],
        PEI4: [ { name: "Mohamed Younes", photo: "https://lh3.googleusercontent.com/d/1wzraoZY_lRafcDXeaxSBeX5cIU57p4xA", birthday: "11/2011" }, { name: "Mohamed Amine", photo: "https://lh3.googleusercontent.com/d/1UrBw6guz0oBTUy8COGeewIs3XAK773bR", birthday: "12/2012" }, { name: "Samir", photo: "https://lh3.googleusercontent.com/d/1NdaCH8CU0DJFHXw4D0lItP-QnCswl23b", birthday: "12/2012" }, { name: "Abdulrahman", photo: "https://lh3.googleusercontent.com/d/1yCTO5StU2tnPY0BEynnWzUveljMIUcLE", birthday: "4/2012" }, { name: "Youssef", photo: "https://lh3.googleusercontent.com/d/1Bygg5-PYrjjMOZdI5hAe16eZ8ltn772e", birthday: "11/2011" } ],
        DP2: [ { name: "Habib", photo: "https://lh3.googleusercontent.com/d/13u4y6JIyCBVQ_9PCwYhh837byyK9g8pF", birthday: "10/2008" }, { name: "Salah", photo: "https://lh3.googleusercontent.com/d/1IG8S_i6jD8O6C2QD_nwLxrG932QgIVXu", birthday: "7/2008" } ]
    };
    
    const translations = {
        fr: { portalTitle: "Portail de Suivi des Devoirs", parentSpace: "Espace Parent", teacherSpace: "Espace Enseignant", backButton: "Retour", teacherLoginTitle: "Accès Enseignant", usernamePlaceholder: "Nom d'utilisateur", passwordPlaceholder: "Mot de passe", loginButton: "Connexion", loginError: "Nom d'utilisateur ou mot de passe incorrect.", classSelectionTitle: "1. Choisissez une classe", studentSelectionTitle: "2. Choisissez votre enfant", studentDashboardTitle: "Tableau de bord de", overallWeeklyProgress: "Progression générale", previousDay: "Jour Précédent", nextDay: "Jour Suivant", homeworkFor: "Devoirs du", loading: "Chargement...", noHomeworkForDay: "Aucun devoir pour ce jour.", fetchError: "Erreur de chargement des données.", studentOfTheWeek: "Élève de la semaine", teacherDashboardTitle: "Tableau de Bord Enseignant", updateSchedule: "Mettre à jour le planning", uploadButton: "Charger et Mettre à jour", homeworkForDay: "Devoirs du jour", selectClassPrompt: "Veuillez sélectionner tous les filtres.", evalTableHeaderStudent: "Élève", evalTableHeaderStatus: "Statut", evalTableHeaderParticipation: "Participation", evalTableHeaderBehavior: "Comportement", evalTableHeaderComment: "Commentaire", saveButton: "Enregistrer", noHomeworkForSubject: "Pas de devoirs pour cette matière aujourd'hui.", teacherSelectTitle: "1. Choisissez votre nom", homeworkToEvaluate: "3. Choisissez un devoir à évaluer", weekSelectionTitle: "2. Choisissez une semaine", studentEvaluationTitle: "4. Évaluez les élèves", birthdayModalTitle: "Vérification", birthdayPrompt: "Veuillez choisir le mois et l'année de naissance de votre enfant :", birthdayError: "Date incorrecte. Veuillez réessayer.", cancelButton: "Annuler", confirmButton: "Confirmer", status_vide: "Vide", status_fait: "Fait", status_non_fait: "Non Fait", status_partiellement_fait: "Partiellement Fait", status_absent: "Absent", sotwTitle: "⭐ Élève de la semaine ⭐", sotwMessage: "Félicitations pour tes excellents efforts !", potdTitle: "🎉 Félicitations ! 🎉", potdMessage: "Un projet ou un succès à célébrer !", adminPhotoTitle: "Ajouter une Photo de Félicitations", monthPlaceholder: "Mois", yearPlaceholder: "Année", weekLabel: "Semaine" },
        ar: { portalTitle: "بوابة متابعة الواجبات", parentSpace: "فضاء الولي", teacherSpace: "فضاء المربي", backButton: "رجوع", teacherLoginTitle: "دخول المربي", usernamePlaceholder: "اسم المستخدم", passwordPlaceholder: "كلمة المرور", loginButton: "دخول", loginError: "اسم المستخدم أو كلمة المرور غير صحيحة.", classSelectionTitle: "1. اختر قسماً", studentSelectionTitle: "2. اختر ابنك", studentDashboardTitle: "لوحة متابعة", overallWeeklyProgress: "التقدم العام", previousDay: "اليوم السابق", nextDay: "اليوم التالي", homeworkFor: "واجبات يوم", loading: "جار التحميل...", noHomeworkForDay: "لا توجد واجبات لهذا اليوم.", fetchError: "خطأ في تحميل البيانات.", studentOfTheWeek: "تلميذ الأسبوع", teacherDashboardTitle: "لوحة تحكم المربي", updateSchedule: "تحديث الجدول", uploadButton: "تحميل وتحديث", homeworkForDay: "واجبات اليوم", selectClassPrompt: "الرجاء اختيار כל المحددات.", evalTableHeaderStudent: "التلميذ", evalTableHeaderStatus: "الحالة", evalTableHeaderParticipation: "المشاركة", evalTableHeaderBehavior: "السلوك", evalTableHeaderComment: "ملاحظة", saveButton: "تسجيل", noHomeworkForSubject: "لا توجد واجبات لهذه المادة اليوم.", teacherSelectTitle: "1. اختر اسمك", homeworkToEvaluate: "3. اختر واجباً لتقييمه", weekSelectionTitle: "2. اختر أسبوعاً", studentEvaluationTitle: "4. قيّم التلاميذ", birthdayModalTitle: "تحقق", birthdayPrompt: "الرجاء اختيار شهر وسنة ميلاد طفلك :", birthdayError: "تاريخ غير صحيح. الرجاء المحاولة مرة أخرى.", cancelButton: "إلغاء", confirmButton: "تأكيد", status_vide: "لم يحضر الواجب", status_fait: "أنجز", status_non_fait: "لم ينجز", status_partiellement_fait: "أنجز جزئياً", status_absent: "غائب", sotwTitle: "⭐ تلميذ الأسبوع ⭐", sotwMessage: "تهانينا على مجهوداتك الممتازة!", potdTitle: "🎉 تهانينا! 🎉", potdMessage: "مشروع أو نجاح للاحتفال به!", adminPhotoTitle: "إضافة صورة تهنئة", monthPlaceholder: "الشهر", yearPlaceholder: "السنة", weekLabel: "الأسبوع" }
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
                displayWeekSelector(activeTeacher.dataset.teacherName);
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
    
    document.getElementById('teacher-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const isAdmin = (user === 'Mohamed86' && pass === 'Mohamed86');
        const isTeacher = (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!');

        if (isAdmin) {
            setupTeacherDashboard(true);
            showView('teacher-dashboard-view');
        } else if (isTeacher) {
            setupTeacherDashboard(false);
            showView('teacher-dashboard-view');
        } else {
            document.getElementById('login-error').textContent = translations[document.documentElement.lang].loginError;
        }
    });

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
                showBirthdayModal(className, student);
            });
            gridContainer.appendChild(card);
        });
    }

    function showBirthdayModal(className, student) {
        const modal = document.getElementById('birthday-modal');
        const monthSelect = document.getElementById('birthday-month-select');
        const yearInput = document.getElementById('birthday-year-input');
        const confirmBtn = document.getElementById('birthday-confirm');
        const cancelBtn = document.getElementById('birthday-cancel');
        const errorMsg = document.getElementById('birthday-modal-error');

        yearInput.value = '';
        monthSelect.selectedIndex = 0;
        errorMsg.style.display = 'none';
        modal.style.display = 'flex';

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        const handleConfirm = () => {
            const month = monthSelect.value;
            const year = yearInput.value;
            if (!month || !year) {
                errorMsg.textContent = translations[document.documentElement.lang].birthdayError;
                errorMsg.style.display = 'block';
                return;
            }
            const enteredDate = `${month}/${year}`;
            if (enteredDate === student.birthday) {
                modal.style.display = 'none';
                currentDate = moment();
                loadStudentDashboard(className, student.name, currentDate);
                showView('student-dashboard-view');
            } else {
                errorMsg.textContent = translations[document.documentElement.lang].birthdayError;
                errorMsg.style.display = 'block';
            }
        };
        const handleCancel = () => {
            modal.style.display = 'none';
        };
        newConfirmBtn.addEventListener('click', handleConfirm);
        newCancelBtn.addEventListener('click', handleCancel);
    }
    
    async function setupTeacherDashboard(isAdmin = false) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const adminUploadSection = document.getElementById('admin-upload-section');
        const adminPhotoSection = document.getElementById('admin-photo-section');
        const teacherIconsContainer = document.getElementById('teacher-icons-container');
        const teacherSelectTitle = teacherDashboardView.querySelector('[data-translate="teacherSelectTitle"]');
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
            if (teacherPlanData.length === 0) {
                const response = await fetch('/api/initial-data');
                if (!response.ok) throw new Error('Impossible de charger les listes.');
                const initialData = await response.json();
                teacherPlanData = initialData.planData;
            }
            const allTeachers = [...new Set(teacherPlanData.map(item => item.Enseignant).filter(Boolean))].sort();
            populateTeacherIcons(allTeachers);
            teacherIconsContainer.style.display = 'flex';
            teacherSelectTitle.style.display = 'block';
        } catch (error) {
            console.error(error);
            teacherDashboardView.querySelector('#homework-cards-container').innerHTML = `<p class="error-message">${translations[document.documentElement.lang].fetchError}.</p>`;
        }
    }
    
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
                displayWeekSelector(teacherName);
            });
            iconsContainer.appendChild(card);
        });
    }

    function displayWeekSelector(teacherName) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const weekContainer = teacherDashboardView.querySelector('#week-buttons-container');
        const weekTitle = teacherDashboardView.querySelector('#week-selection-title');
        const cardsContainer = teacherDashboardView.querySelector('#homework-cards-container');
        const cardsTitle = teacherDashboardView.querySelector('#homework-cards-title');
        const evaluationSection = teacherDashboardView.querySelector('#teacher-evaluation-section');

        weekContainer.innerHTML = '';
        cardsContainer.innerHTML = '';
        evaluationSection.style.display = 'none';
        cardsTitle.style.display = 'none';
        weekTitle.style.display = 'block';

        const homeworks = teacherPlanData.filter(item => item.Enseignant === teacherName && item.Devoirs && item.Jour && item.Jour !== 'Invalid date');
        if (homeworks.length === 0) {
            weekContainer.innerHTML = `<p>${translations[document.documentElement.lang].noHomeworkForDay}</p>`;
            return;
        }

        const homeworksByWeek = {};
        homeworks.forEach(hw => {
            const weekKey = moment(hw.Jour, 'YYYY-MM-DD').startOf('week').format('YYYY-MM-DD');
            if (!homeworksByWeek[weekKey]) {
                homeworksByWeek[weekKey] = [];
            }
            homeworksByWeek[weekKey].push(hw);
        });

        const sortedWeekKeys = Object.keys(homeworksByWeek).sort((a, b) => new Date(b) - new Date(a));

        sortedWeekKeys.forEach(weekKey => {
            const button = document.createElement('button');
            button.className = 'week-button';
            const startOfWeek = moment(weekKey).locale(document.documentElement.lang);
            const endOfWeek = startOfWeek.clone().add(4, 'days');
            button.textContent = `${translations[document.documentElement.lang].weekLabel} (${startOfWeek.format('D MMM')} - ${endOfWeek.format('D MMM')})`;
            
            button.addEventListener('click', (e) => {
                weekContainer.querySelectorAll('.week-button').forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                displayHomeworkCards(teacherName, homeworksByWeek[weekKey]);
            });
            weekContainer.appendChild(button);
        });
    }
    
    async function displayHomeworkCards(teacherName, weekHomeworks) {
        const teacherDashboardView = document.getElementById('teacher-dashboard-view');
        const cardsContainer = teacherDashboardView.querySelector('#homework-cards-container');
        const cardsTitle = teacherDashboardView.querySelector('#homework-cards-title');
        const evaluationSection = teacherDashboardView.querySelector('#teacher-evaluation-section');
        cardsContainer.innerHTML = '';
        evaluationSection.style.display = 'none';
        cardsTitle.style.display = 'block';
        
        const allDates = [...new Set(weekHomeworks.map(hw => hw.Jour))];
        const allClassNames = [...new Set(weekHomeworks.map(hw => hw.Classe))];
        let allEvaluations = [];
        try {
            const promises = allClassNames.flatMap(className => 
                allDates.map(date => fetch(`/api/evaluations?class=${className}&date=${date}`).then(res => res.json()))
            );
            const results = await Promise.all(promises);
            allEvaluations = results.flatMap(result => result.evaluations);
        } catch (error) { console.error("Erreur de pré-chargement:", error); }

        weekHomeworks.sort((a, b) => new Date(a.Jour) - new Date(b.Jour));

        weekHomeworks.forEach(hw => {
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
                const currentLang = document.documentElement.lang;
                tableHTML += `<tr data-student="${student}"><td>${student}</td><td><select class="status-select"><option value="" ${!existingEval.status ? 'selected' : ''}>${translations[currentLang].status_vide}</option><option value="Fait" ${existingEval.status === 'Fait' ? 'selected' : ''}>${translations[currentLang].status_fait}</option><option value="Non Fait" ${existingEval.status === 'Non Fait' ? 'selected' : ''}>${translations[currentLang].status_non_fait}</option><option value="Partiellement Fait" ${existingEval.status === 'Partiellement Fait' ? 'selected' : ''}>${translations[currentLang].status_partiellement_fait}</option><option value="Absent" ${existingEval.status === 'Absent' ? 'selected' : ''}>${translations[currentLang].status_absent}</option></select></td><td><input type="number" class="participation-input" min="0" max="10" value="${existingEval.participation ?? 7}"></td><td><input type="number" class="behavior-input" min="0" max="10" value="${existingEval.behavior ?? 7}"></td><td><input type="text" class="comment-input" value="${existingEval.comment || ''}"></td></tr>`;
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
            const activeTeacherCard = document.querySelector('.teacher-icon-card.active');
            if (activeTeacherCard) {
                displayWeekSelector(activeTeacherCard.dataset.teacherName);
            }
        } catch (error) { 
            console.error("Erreur:", error); alert("Une erreur est survenue."); 
        }
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
                await setupTeacherDashboard(true);
            } catch (error) {
                console.error("Erreur d'upload:", error);
                uploadStatus.textContent = `Erreur : ${error.message}.`;
                uploadStatus.className = 'error';
            }
        };
        reader.readAsArrayBuffer(file);
    }
    
    function parseFrenchDate(dateString) {
        let cleanString = String(dateString).toLowerCase().trim();
        const arabicMap = { 'يناير': 'january', 'فبراير': 'february', 'مارس': 'march', 'أبريل': 'april', 'ماي': 'may', 'يونيو': 'june', 'يوليو': 'july', 'أغسطس': 'august', 'سبتمبر': 'september', 'أكتوبر': 'october', 'نوفمبر': 'november', 'ديسمبر': 'december', 'الأحد': 'sunday', 'الاثنين': 'monday', 'الثلاثاء': 'tuesday', 'الأربعاء': 'wednesday', 'الخميس': 'thursday', 'الجمعة': 'friday', 'السبت': 'saturday', 'موافق': '', 'ل': '' };
        for (const [key, value] of Object.entries(arabicMap)) {
            cleanString = cleanString.replace(new RegExp(key, 'g'), value);
        }
        cleanString = cleanString.replace(/\s+/g, ' ').trim();
        moment.locale('fr');
        const formats = ["dddd D MMMM YYYY", "D-M-YYYY", "D MMMM YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
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
    
    document.getElementById('prev-day-btn').addEventListener('click', () => { 
        const studentDashboardView = document.getElementById('student-dashboard-view');
        const className = studentDashboardView.dataset.className;
        const studentName = studentDashboardView.dataset.studentName;
        if (className && studentName) {
            currentDate.subtract(1, 'days'); 
            loadStudentDashboard(className, studentName, currentDate); 
        }
    });

    document.getElementById('next-day-btn').addEventListener('click', () => { 
        const studentDashboardView = document.getElementById('student-dashboard-view');
        const className = studentDashboardView.dataset.className;
        const studentName = studentDashboardView.dataset.studentName;
        if (className && studentName) {
            currentDate.add(1, 'days'); 
            loadStudentDashboard(className, studentName, currentDate); 
        }
    });
    
    async function loadStudentDashboard(className, studentName, date) {
        const studentDashboardView = document.getElementById('student-dashboard-view');
        studentDashboardView.dataset.className = className;
        studentDashboardView.dataset.studentName = studentName;
        const currentLang = document.documentElement.lang;
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
            const dateQuery = date.clone().locale('en').format('YYYY-MM-DD');
            const response = await fetch(`/api/evaluations?class=${className}&student=${studentName}&date=${dateQuery}&week=true`);
            if (!response.ok) throw new Error(`Erreur du serveur (statut ${response.status})`);
            const data = await response.json();
            homeworkGrid.innerHTML = "";
            if (data.homeworks && data.homeworks.length > 0) {
                data.homeworks.forEach(hw => {
                    const dailyEval = data.evaluations.find(ev => ev.studentName === studentName && ev.subject === hw.subject) || {};
                    const getStatusClass = (status) => {
                        if (!status || status === 'Vide') return '';
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
            const dayOfWeek = moment(ev.date).day();
            if (dayOfWeek >= 0 && dayOfWeek <= 4) {
                const dayKey = ev.date;
                if (!dailyScores[dayKey]) { dailyScores[dayKey] = { allDone: true, participationSum: 0, behaviorSum: 0, count: 0, hasHomework: true }; }
                if (ev.status !== 'Fait' && ev.status !== 'Absent') { dailyScores[dayKey].allDone = false; }
                dailyScores[dayKey].participationSum += ev.participation || 0;
                dailyScores[dayKey].behaviorSum += ev.behavior || 0;
                dailyScores[dayKey].count++;
            }
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
        if (stars >= 4) { studentOfWeekBanner.classList.add('active'); } else { studentOfWeekBanner.classList.remove('active'); }
        let totalScore = 0;
        let maxScore = 0;
        (weeklyEvals || []).forEach(ev => {
            const dayOfWeek = moment(ev.date).day();
            if (dayOfWeek >= 0 && dayOfWeek <= 4) {
                if (ev.status !== 'Absent') {
                    totalScore += (ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0) + (ev.participation || 0) + (ev.behavior || 0);
                    maxScore += 30;
                }
            }
        });
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const progressBar = document.getElementById('overall-progress-bar');
        progressBar.style.width = `${percentage}%`;
        progressBar.classList.remove('red', 'orange', 'green');
        if (percentage < 45) {
            progressBar.classList.add('red');
        } else if (percentage <= 60) {
            progressBar.classList.add('orange');
        } else {
            progressBar.classList.add('green');
        }
        document.getElementById('overall-progress-text').textContent = `${percentage}%`;
    }

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
                headers: { 'Content-Type': 'application/json', 'username': 'Mohamed86', 'password': 'Mohamed86' },
                body: JSON.stringify({ imageUrl })
            });
            if (!response.ok) throw new Error('Échec de la mise à jour');
            photoStatus.textContent = 'Photo enregistrée !';
            photoStatus.className = 'success';
            photoUrlInput.value = '';
        } catch (error) {
            console.error("Erreur d'enregistrement:", error);
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
                const classKey = sotw.class.split(' ')[0];
                const studentInfo = (studentData[classKey] || []).find(s => s.name === sotw.name);
                if (studentInfo) {
                    document.getElementById('sotw-photo').src = studentInfo.photo;
                    document.getElementById('sotw-name').textContent = sotw.name;
                    document.getElementById('sotw-showcase').style.display = 'block';
                }
            }
        } catch (error) { console.error("Erreur:", error); }
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
        } catch (error) { console.error("Erreur:", error); }
    }

    displayHomePageExtras();
    setLanguage('fr');
});
