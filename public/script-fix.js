// PATCH pour corriger les erreurs de parsing JSON
// À ajouter au début du fichier script.js

// Override fetch pour ajouter une meilleure gestion des erreurs
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    try {
        const response = await originalFetch.apply(this, args);
        
        // Créer un wrapper pour la méthode json()
        const originalJson = response.json.bind(response);
        response.json = async function() {
            try {
                const text = await response.clone().text();
                if (!text || text.trim() === '') {
                    console.warn('[API] Empty response received:', args[0]);
                    return { homeworks: [], evaluations: [], weeklyEvaluations: [] };
                }
                return JSON.parse(text);
            } catch (error) {
                console.error('[API] JSON parsing error:', error, 'Response:', args[0]);
                return { homeworks: [], evaluations: [], weeklyEvaluations: [], error: error.message };
            }
        };
        
        return response;
    } catch (error) {
        console.error('[API] Fetch error:', error);
        throw error;
    }
};

// Améliorer la gestion des erreurs dans loadStudentDashboard
const originalLoadStudentDashboard = window.loadStudentDashboard;
if (originalLoadStudentDashboard) {
    window.loadStudentDashboard = async function(className, studentName, date) {
        try {
            return await originalLoadStudentDashboard.call(this, className, studentName, date);
        } catch (error) {
            console.error('[Dashboard] Error loading student dashboard:', error);
            const studentDashboardView = document.getElementById('student-dashboard-view');
            const homeworkGrid = studentDashboardView.querySelector('#homework-grid');
            const currentLang = document.documentElement.lang;
            homeworkGrid.innerHTML = `<p class="error-message">Erreur de chargement. Veuillez réessayer.</p>`;
        }
    };
}

console.log('[Script] JSON error handling patch loaded');
