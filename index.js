document.addEventListener('DOMContentLoaded', () => {
    // Définition des éléments de l'interface
    const views = document.querySelectorAll('.view');
    const homeView = document.getElementById('home-view');
    
    // Boutons de navigation
    const goToParentBtn = document.getElementById('go-to-parent');
    const goToTeacherBtn = document.getElementById('go-to-teacher');
    const backButtons = document.querySelectorAll('.back-button');

    // Sections spécifiques
    const parentSelectionView = document.getElementById('parent-selection-view');
    const teacherLoginView = document.getElementById('teacher-login-view');
    const studentDashboardView = document.getElementById('student-dashboard-view');
    const teacherDashboardView = document.getElementById('teacher-dashboard-view');

    // Données statiques
    const classes = {
        PEI1: ["Faysal", "Bilal", "Jad", "Manaf"],
        PEI2: ["Ahmed", "Yasser", "Eyad", "Ali"],
        PEI3: ["Seifeddine", "Mohamed", "Wajih", "Ahmad", "Adam"],
        PEI4: ["Mohamed Younes", "Mohamed Amine", "Samir", "Abdulrahman", "Youssef"],
        DP2: ["Habib", "Salah"]
    };
    
    // Logique de navigation
    const showView = (viewId) => {
        homeView.style.display = 'none';
        views.forEach(v => v.style.display = 'none');
        document.getElementById(viewId).style.display = 'block';
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
        if (currentView.id === 'student-dashboard-view') {
            showView('parent-selection-view');
        } else if (currentView.id === 'teacher-dashboard-view') {
             showView('teacher-login-view');
        } else {
            goHome();
        }
    }));

    // --- Espace Enseignant ---

    const teacherLoginForm = document.getElementById('teacher-login-form');
    teacherLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const loginError = document.getElementById('login-error');
        
        // ATTENTION: Authentification côté client très peu sécurisée. 
        // Pour un projet réel, il faudrait une vraie authentification serveur.
        if (user === 'Alkawthar@!!!' && pass === 'Alkawthar@!!!') {
            loginError.textContent = '';
            setupTeacherDashboard();
            showView('teacher-dashboard-view');
        } else {
            loginError.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
        }
    });

    const teacherClassSelect = document.getElementById('teacher-class-select');
    const evaluationTableContainer = document.getElementById('evaluation-table-container');

    function setupTeacherDashboard() {
        populateClassSelect('teacher-class-select');
        teacherClassSelect.addEventListener('change', renderEvaluationTable);
        document.getElementById('teacher-subject-select').addEventListener('input', renderEvaluationTable);
        renderEvaluationTable(); // Render initial empty state
    }

    function renderEvaluationTable() {
        const selectedClass = teacherClassSelect.value;
        const subject = document.getElementById('teacher-subject-select').value;
        if (!selectedClass || !subject) {
            evaluationTableContainer.innerHTML = "<p>Veuillez sélectionner une classe et entrer une matière.</p>";
            return;
        }

        const students = classes[selectedClass] || [];
        let tableHTML = `
            <table class="evaluation-table">
                <thead>
                    <tr>
                        <th>Élève</th>
                        <th>Statut Devoir</th>
                        <th>Participation (/10)</th>
                        <th>Comportement (/10)</th>
                        <th>Commentaire</th>
                    </tr>
                </thead>
                <tbody>
        `;
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
                    <td><input type="text" class="comment-input" placeholder="Aucune remarque..."></td>
                </tr>
            `;
        });
        tableHTML += `</tbody></table>`;
        evaluationTableContainer.innerHTML = tableHTML;
    }
    
    document.getElementById('submit-evaluations').addEventListener('click', async () => {
        const selectedClass = teacherClassSelect.value;
        const subject = document.getElementById('teacher-subject-select').value;
        const successMessage = document.getElementById('submit-success-message');
        
        if (!selectedClass || !subject) {
            alert("Veuillez sélectionner une classe et une matière.");
            return;
        }

        const evaluations = [];
        const rows = document.querySelectorAll('.evaluation-table tbody tr');
        rows.forEach(row => {
            evaluations.push({
                studentName: row.dataset.student,
                class: selectedClass,
                subject: subject,
                status: row.querySelector('.status-select').value,
                participation: parseInt(row.querySelector('.participation-input').value, 10),
                behavior: parseInt(row.querySelector('.behavior-input').value, 10),
                comment: row.querySelector('.comment-input').value,
            });
        });

        try {
            const response = await fetch('/api/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ evaluations })
            });

            if (!response.ok) throw new Error('Erreur lors de la soumission');
            
            successMessage.textContent = "Évaluations envoyées avec succès !";
            setTimeout(() => successMessage.textContent = '', 3000);
            document.querySelector('.evaluation-table').remove(); // Clear table
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
        selectElement.innerHTML = '<option value="">-- Sélectionnez --</option>';
        Object.keys(classes).forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            selectElement.appendChild(option);
        });
    }

    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        studentSelect.innerHTML = '<option value="">-- Sélectionnez --</option>';
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
        document.getElementById('student-name-header').textContent = `Tableau de bord de ${studentName}`;
        
        // Reset lists
        const todayList = document.getElementById('today-homework-list');
        const pastList = document.getElementById('past-homework-list');
        todayList.innerHTML = '<p>Chargement...</p>';
        pastList.innerHTML = '<p>Chargement...</p>';

        try {
            // Fetch all data in one go from the serverless function
            const response = await fetch(`/api/evaluations?class=${className}&student=${studentName}`);
            if (!response.ok) throw new Error('Data fetch failed');
            const data = await response.json();
            
            // Render today's homework
            todayList.innerHTML = '';
            if (data.todayHomework.length > 0) {
                data.todayHomework.forEach(hw => {
                    const item = document.createElement('div');
                    item.className = 'homework-item';
                    item.innerHTML = `
                        <div class="homework-info">
                            <h4>${hw.subject}</h4>
                            <p>${hw.assignment}</p>
                        </div>`;
                    todayList.appendChild(item);
                });
            } else {
                todayList.innerHTML = "<p>Aucun devoir pour aujourd'hui.</p>";
            }

            // Render past homework with evaluations
            pastList.innerHTML = '';
            if (data.pastEvaluations.length > 0) {
                data.pastEvaluations.forEach(ev => {
                    const statusMap = {
                        "Fait": "green",
                        "Non Fait": "red",
                        "Partiellement Fait": "orange",
                        "Absent": "orange"
                    };
                    const item = document.createElement('div');
                    item.className = 'homework-item';
                    item.innerHTML = `
                        <div class="homework-info">
                            <h4>${ev.subject} (${new Date(ev.date).toLocaleDateString()})</h4>
                            ${ev.comment ? `<p class="remark">"${ev.comment}"</p>` : ''}
                        </div>
                        <div class="status-dot ${statusMap[ev.status]}"></div>`;
                    pastList.appendChild(item);
                });
            } else {
                pastList.innerHTML = "<p>Aucun historique de devoir disponible.</p>";
            }
            
            // Update thermometer
            const progress = data.weeklyProgress;
            document.getElementById('thermometer-progress').style.width = `${progress}%`;
            document.getElementById('thermometer-percentage').textContent = `${progress}%`;

        } catch (error) {
            console.error('Error loading dashboard:', error);
            todayList.innerHTML = '<p class="error-message">Erreur de chargement des données.</p>';
            pastList.innerHTML = '<p class="error-message">Erreur de chargement des données.</p>';
        }
    }
});```

---

### **6. Fichier Serverless (`api/evaluations.js`)**

Créez un dossier nommé `api` à la racine de votre projet. À l'intérieur de ce dossier, créez un fichier nommé `evaluations.js`. Ce fichier est votre "backend". Il recevra les requêtes de votre site, communiquera avec la base de données MongoDB, et renverra les informations nécessaires.

```javascript
const { MongoClient } = require('mongodb');

// URI de connexion stockée en variable d'environnement sur Vercel
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    await client.connect();
    return client.db('AlkawtharDB'); // Vous pouvez nommer votre base de données
}

// Handler principal pour les requêtes Vercel
module.exports = async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        // Gérer les requêtes POST (soumission des évaluations par l'enseignant)
        if (req.method === 'POST') {
            const { evaluations } = req.body;
            const evaluationsCollection = db.collection('evaluations');
            const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

            // On utilise bulkWrite pour insérer ou mettre à jour plusieurs documents efficacement
            const operations = evaluations.map(ev => ({
                updateOne: {
                    filter: { 
                        date: today, 
                        studentName: ev.studentName,
                        subject: ev.subject 
                    },
                    update: { $set: { ...ev, date: today } },
                    upsert: true // Crée le document s'il n'existe pas
                }
            }));

            await evaluationsCollection.bulkWrite(operations);
            res.status(200).json({ message: 'Évaluations enregistrées avec succès.' });
        
        // Gérer les requêtes GET (récupération des données pour le parent)
        } else if (req.method === 'GET') {
            const { class: className, student: studentName } = req.query;

            if (!className || !studentName) {
                return res.status(400).json({ error: 'Classe et nom de l´élève requis.' });
            }

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(today.getDate() - 5);
            const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

            const homeworkCollection = db.collection('homeworks');
            const evaluationsCollection = db.collection('evaluations');
            
            // Récupérer les devoirs du jour
            const todayHomework = await homeworkCollection.find({
                class: className,
                date: todayStr
            }).toArray();

            // Récupérer les évaluations des 5 derniers jours
            const pastEvaluations = await evaluationsCollection.find({
                studentName: studentName,
                date: { $gte: fiveDaysAgoStr, $lt: todayStr }
            }).sort({ date: -1 }).toArray();
            
            // Calcul du progrès hebdomadaire (logique simplifiée)
            // On calcule le % de devoirs "Fait" + moyenne de participation/comportement
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Début de semaine (Dimanche)
            const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
            
            const weeklyEvals = await evaluationsCollection.find({
                studentName: studentName,
                date: { $gte: startOfWeekStr }
            }).toArray();
            
            let totalScore = 0;
            let maxScore = 0;
            if (weeklyEvals.length > 0) {
                weeklyEvals.forEach(ev => {
                    // Score pour le statut du devoir (Fait = 10, Partiel = 5, Non fait = 0)
                    totalScore += ev.status === 'Fait' ? 10 : ev.status === 'Partiellement Fait' ? 5 : 0;
                    // Score pour la participation et le comportement
                    totalScore += ev.participation + ev.behavior;
                    maxScore += 30; // 10 (devoir) + 10 (part.) + 10 (comp.)
                });
            }
            const weeklyProgress = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
            
            res.status(200).json({ todayHomework, pastEvaluations, weeklyProgress });

        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur de connexion au serveur ou à la base de données.' });
    }
};