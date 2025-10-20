# Pull Request: Multi-class Student of the Week & Auto-delete Celebration Photos

## 🔗 Create Pull Request
**URL**: https://github.com/medch24/Devoirs2026/pull/new/genspark_ai_developer

## 📋 Summary

This PR implements two major features requested:

### 1. ⭐ Multi-Class Student of the Week Display

#### Features:
- **Enhanced Selection Algorithm**: 
  - Students are selected based on a combined score:
    - Stars earned (70% weight) - `stars * 20`
    - Overall progress percentage (30% weight) - `progress * 0.3`
  - Best student from each class is selected
  
- **Per-Class Selection**: One student of the week is displayed for each class (PEI1, PEI2, PEI3, PEI4, DP2)

- **Database Persistence**: 
  - Student of the week data is stored in `students_of_the_week` collection
  - Data persists throughout the week (identified by week number)
  - Recalculated only when new week starts

- **Rich Display**: 
  - Student photo (circular with yellow star border)
  - Student name
  - Star count (visual 5-star display)
  - Class name badge

- **Responsive Layout**: Grid layout that adapts to screen sizes

#### Technical Implementation:
- Modified `/api/weekly-summary.js` to:
  - Calculate student of the week for each class independently
  - Store results in MongoDB with week identifier
  - Return cached results if still in same week
  - Calculate combined score based on stars + progress percentage

### 2. 🗑️ Auto-deletion of Celebration Photos

#### Features:
- **Automatic Cleanup**: Photos older than 3 days are automatically deleted
- **Applied to All Photo APIs**:
  - `/api/photo-of-the-day`
  - `/api/photo-2`
  - `/api/photo-3`
- **Efficient**: Deletion happens during GET requests, ensuring regular cleanup without cron jobs

#### Technical Implementation:
```javascript
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
await collection.deleteMany({ createdAt: { $lt: threeDaysAgo } });
```

## 📝 Files Changed

### Backend (API)
1. **api/weekly-summary.js** - Major refactor
   - Calculate students of the week per class
   - Store in database with week identifier
   - Return cached results for current week
   - Combined scoring algorithm

2. **api/photo-of-the-day.js** - Auto-delete logic added
3. **api/photo-2.js** - Auto-delete logic added
4. **api/photo-3.js** - Auto-delete logic added

### Frontend
1. **public/index.js**
   - Updated `displayStudentOfTheWeek()` function
   - Dynamic creation of student cards
   - Handles multiple students display

2. **public/index.html**
   - Simplified structure (removed static elements)
   - Content now created dynamically

3. **public/styles.css**
   - Added `.sotw-info` class for student cards
   - Added `.sotw-stars` class for star display
   - Added `.sotw-class` class for class badges
   - Responsive grid layout

## 🗄️ Database Changes

### New Collection:
- **students_of_the_week**
  - Fields: `name`, `class`, `stars`, `progressPercentage`, `weekIdentifier`, `startDate`, `endDate`, `createdAt`
  - Purpose: Store weekly student selections

### Modified Collections:
- **photos_of_the_day** - Auto-deletion of old entries
- **photos_celebration_2** - Auto-deletion of old entries
- **photos_celebration_3** - Auto-deletion of old entries

## ✅ Testing Checklist

- [x] All existing functionality preserved
- [x] New features are backward compatible
- [x] UI is responsive on all screen sizes
- [x] Code follows existing patterns
- [x] No breaking changes
- [x] Git workflow followed (commit, push, PR)

## 🎯 User Benefits

1. **Better Recognition**: Each class now has its own student of the week
2. **Fair Competition**: Students compete within their class
3. **Visual Appeal**: Rich display with photos, stars, and class badges
4. **Automatic Cleanup**: No manual deletion of old photos needed
5. **Performance**: Cached weekly calculations reduce database load

## 📸 Expected Display

```
┌────────────────────────────────────────────────────────────┐
│          ⭐ Élève de la semaine ⭐                         │
├──────────────┬──────────────┬──────────────┬──────────────┤
│   [Photo]    │   [Photo]    │   [Photo]    │   [Photo]    │
│   Ahmed      │   Bilal      │   Mohamed    │   Habib      │
│  ★★★★★       │  ★★★★☆       │  ★★★★★       │  ★★★★☆       │
│   PEI2       │   PEI1       │   PEI3       │   DP2        │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

## 🔄 Algorithm Details

### Student Selection Algorithm:
```javascript
// For each class:
combinedScore = (stars * 20) + (progressPercentage * 0.3)
// Select student with highest combinedScore
```

### Progress Percentage Calculation:
```javascript
totalScore = Σ (homeworkStatus + participation + behavior)
maxScore = numberOfHomeworks * 30
progressPercentage = (totalScore / maxScore) * 100
```

### Week Identification:
```javascript
weekIdentifier = startOfWeek.format('YYYY-[W]WW')
// Example: "2025-W42"
```

## 🚀 Deployment

This is a serverless application deployed on Vercel. The changes are:
- Backend: Serverless functions in `/api` folder
- Frontend: Static files in `/public` folder
- Database: MongoDB (connection via environment variable)

No special deployment steps required beyond merging this PR.

## 👥 Code Review Notes

- All parameters, options, and functions from the original code are conserved
- Design elements maintained
- Only added new features, no existing functionality removed
- Code is well-commented in French
- Follows existing code style and patterns
