const { MongoClient } = require('mongodb');
const moment = require('moment');

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

// Calculate if a student deserves a star for a given day
const calculateDailyStar = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return false;
    
    // Count completed homework (Fait + Partiellement Fait count as completion)
    const completedHomework = evaluations.filter(ev => 
        ev.status === 'Fait' || ev.status === 'Partiellement Fait'
    ).length;
    
    // Calculate completion percentage
    const completionRate = (completedHomework / evaluations.length) * 100;
    
    // Check if completion rate is above 70%
    const hasGoodCompletion = completionRate > 70;
    
    // Check if all evaluations have good participation (>5) and behavior (>5)
    const hasGoodParticipation = evaluations.every(ev => (ev.participation || 0) > 5);
    const hasGoodBehavior = evaluations.every(ev => (ev.behavior || 0) > 5);
    
    // Award star if all conditions are met
    return hasGoodCompletion && hasGoodParticipation && hasGoodBehavior;
};

module.exports = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('devoirs');
        const evaluationsCollection = db.collection('evaluations');
        const dailyStarsCollection = db.collection('daily_stars');
        
        if (req.method === 'GET') {
            // Get daily stars for a student or all students
            const { studentName, className, date, week } = req.query;
            
            let query = {};
            if (studentName) query.studentName = studentName;
            if (className) query.className = className;
            if (date) query.date = date;
            
            if (week) {
                // Get stars for the current week
                const today = moment().startOf('day');
                const startOfWeek = today.clone().day(0); // Sunday
                const endOfWeek = today.clone().day(4);   // Thursday
                
                query.date = {
                    $gte: startOfWeek.format('YYYY-MM-DD'),
                    $lte: endOfWeek.format('YYYY-MM-DD'),
                };
            }
            
            const stars = await dailyStarsCollection.find(query).toArray();
            res.status(200).json({ stars });
            
        } else if (req.method === 'POST') {
            // Calculate and store daily stars for a specific date
            const { date } = req.body;
            const targetDate = date || moment().format('YYYY-MM-DD');
            
            // Get all evaluations for the target date
            const evaluations = await evaluationsCollection.find({ date: targetDate }).toArray();
            
            if (evaluations.length === 0) {
                return res.status(200).json({ message: 'No evaluations found for this date', date: targetDate });
            }
            
            // Group evaluations by student
            const evalsByStudent = {};
            evaluations.forEach(ev => {
                const key = `${ev.studentName}_${ev.class}`;
                if (!evalsByStudent[key]) {
                    evalsByStudent[key] = {
                        studentName: ev.studentName,
                        className: ev.class,
                        evaluations: []
                    };
                }
                evalsByStudent[key].evaluations.push(ev);
            });
            
            const dailyStars = [];
            
            // Calculate stars for each student
            for (const key in evalsByStudent) {
                const studentData = evalsByStudent[key];
                const earnedStar = calculateDailyStar(studentData.evaluations);
                
                const starRecord = {
                    date: targetDate,
                    studentName: studentData.studentName,
                    className: studentData.className,
                    earnedStar: earnedStar,
                    evaluationCount: studentData.evaluations.length,
                    completionRate: studentData.evaluations.length > 0 
                        ? Math.round((studentData.evaluations.filter(ev => 
                            ev.status === 'Fait' || ev.status === 'Partiellement Fait'
                          ).length / studentData.evaluations.length) * 100)
                        : 0,
                    avgParticipation: studentData.evaluations.length > 0
                        ? Math.round(studentData.evaluations.reduce((sum, ev) => sum + (ev.participation || 0), 0) / studentData.evaluations.length * 10) / 10
                        : 0,
                    avgBehavior: studentData.evaluations.length > 0
                        ? Math.round(studentData.evaluations.reduce((sum, ev) => sum + (ev.behavior || 0), 0) / studentData.evaluations.length * 10) / 10
                        : 0,
                    createdAt: new Date()
                };
                
                // Upsert the star record
                await dailyStarsCollection.updateOne(
                    { 
                        date: targetDate, 
                        studentName: studentData.studentName, 
                        className: studentData.className 
                    },
                    { $set: starRecord },
                    { upsert: true }
                );
                
                dailyStars.push(starRecord);
            }
            
            res.status(200).json({ 
                message: `Processed ${dailyStars.length} student records for ${targetDate}`,
                date: targetDate,
                stars: dailyStars
            });
            
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
        
    } catch (error) {
        console.error("[daily-stars] ERROR:", error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
};