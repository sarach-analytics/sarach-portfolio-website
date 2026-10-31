# SQL Course Restructure Plan - 17 → 26 Lessons

## Current Structure (17 Lessons)
- **BASIC I:** Lessons 1-8 (Free)
- **BASIC II:** Lessons 9-17 (Auth required from lesson 9+)

## New Structure (26 Lessons)
- **INTRODUCTION:** Lessons 1-9 (Free) - NEW SECTION
- **BASIC I:** Lessons 10-17 (Free) - Originally lessons 1-8
- **BASIC II:** Lessons 18-26 (Auth required) - Originally lessons 9-17

---

## Step-by-Step Execution Plan

### ✅ PHASE 1: Create Introduction Section Content (9 New Lessons)

#### Lesson 1: Course Introduction & Welcome Video
- [ ] Add instructor introduction video embed
- [ ] Course overview
- [ ] What you'll learn
- [ ] Course structure explanation
- EN + TH versions

#### Lesson 2: Course Resources
- [ ] Downloadable resources
- [ ] Cheat sheets
- [ ] Practice datasets
- [ ] Community links
- EN + TH versions

#### Lesson 3: Course Roadmap & Structure
- [ ] Visual roadmap
- [ ] Learning path
- [ ] Time estimates
- [ ] Prerequisites
- EN + TH versions

#### Lesson 4: What is SQL and What are Databases?
- [ ] SQL definition
- [ ] Database concepts
- [ ] Real-world examples
- [ ] Use cases
- EN + TH versions

#### Lesson 5: What is DBMS?
- [ ] DBMS definition
- [ ] Popular DBMS systems
- [ ] How DBMS works
- [ ] Benefits
- EN + TH versions

#### Lesson 6: Types of Databases
- [ ] Relational vs Non-relational
- [ ] SQL vs NoSQL
- [ ] When to use each
- [ ] Examples
- EN + TH versions

#### Lesson 7: SQL Commands Overview
- [ ] DDL, DML, DCL, TCL
- [ ] Command categories
- [ ] Basic syntax
- [ ] Examples
- EN + TH versions

#### Lesson 8: Why Learn SQL?
- [ ] Career benefits
- [ ] Industry demand
- [ ] Practical applications
- [ ] Job roles
- EN + TH versions

#### Lesson 9: Setup & Install SQL Server, SSMS & Databases
- [ ] Environment setup options (from current Lesson 1)
- [ ] Online editors (DB Fiddle, SQLite Online, etc.)
- [ ] Local installation (SQLite, PostgreSQL, MySQL)
- [ ] Cloud services (Supabase, PlanetScale, etc.)
- [ ] Step-by-step installation guide
- [ ] Video tutorial (optional)
- EN + TH versions

---

### ✅ PHASE 2: Update Navigation Sidebar

#### Update HTML Structure (lines 50-160 approximately)
- [ ] Add new "Introduction" chapter block
  - Title: "Introduction to SQL" (EN) / "แนะนำ SQL" (TH)
  - 9 lesson items (lessons 1-9)
  - Chapter count: 0/9

- [ ] Update "BASIC I" chapter block
  - Keep title: "BASIC I - SQL Foundations"
  - Update lesson numbers: 10-17 (was 1-8)
  - Update lesson data-lesson attributes
  - Chapter count: 0/8

- [ ] Update "BASIC II" chapter block
  - Keep title: "BASIC II - Data Manipulation & Joins"
  - Update lesson numbers: 18-26 (was 9-17)
  - Update lesson data-lesson attributes
  - Chapter count: 0/9

---

### ✅ PHASE 3: Shift Existing Lesson Content (+9)

#### Update Lesson Data Object (lines ~623-3200)
```javascript
const lessons = {
    // NEW: Introduction lessons 1-9
    1: { /* Course Introduction */ },
    2: { /* Course Resources */ },
    3: { /* Course Roadmap */ },
    4: { /* What is SQL */ },
    5: { /* What is DBMS */ },
    6: { /* Types of Databases */ },
    7: { /* SQL Commands */ },
    8: { /* Why Learn SQL */ },
    9: { /* Setup & Install */ },

    // SHIFTED: BASIC I lessons 10-17 (was 1-8)
    10: { /* Introduction to Databases - OLD LESSON 1 */ },
    11: { /* SELECT Statement Basics - OLD LESSON 2 */ },
    12: { /* Filtering with WHERE - OLD LESSON 3 */ },
    13: { /* Basic Filtering Operators - OLD LESSON 4 */ },
    14: { /* Sorting and Limiting Results - OLD LESSON 5 */ },
    15: { /* Basic String Functions - OLD LESSON 6 */ },
    16: { /* Practice Exercises - BASIC I - OLD LESSON 7 */ },
    17: { /* Quiz - BASIC I - OLD LESSON 8 */ },

    // SHIFTED: BASIC II lessons 18-26 (was 9-17)
    18: { /* Logical Operators - OLD LESSON 9 */ },
    19: { /* Introduction to JOINs - OLD LESSON 10 */ },
    20: { /* More JOIN Types - OLD LESSON 11 */ },
    21: { /* Basic Aggregate Functions - OLD LESSON 12 */ },
    22: { /* GROUP BY Basics - OLD LESSON 13 */ },
    23: { /* Date and Time Functions - OLD LESSON 14 */ },
    24: { /* Practice Exercises - BASIC II - OLD LESSON 15 */ },
    25: { /* Quiz - BASIC II - OLD LESSON 16 */ },
    26: { /* Course Summary - OLD LESSON 17 */ }
}
```

---

### ✅ PHASE 4: Update Authentication Logic

#### Update Authentication Check (line ~318-348)
```javascript
async function requireAuthForLesson(lessonNumber) {
    // Lessons 1-17 (Introduction + BASIC I) are free
    // Lesson 18+ (BASIC II) require authentication
    if (lessonNumber >= 18) {  // CHANGED FROM >= 9
        // ... rest of auth logic
    }
}
```

#### Update Comments (lines ~305-307)
```javascript
// STAGE 1 - Introduction: Lessons 1-9 (Free)
// STAGE 2 - BASIC I: Lessons 10-17 (Free)
// STAGE 3 - BASIC II: Lessons 18-26 (Requires authentication from lesson 18+)
```

#### Update Auth Message
- Change "BASIC II" message to reflect correct lesson number
- Update Thai message as well

---

### ✅ PHASE 5: Update Progress Tracking

#### Update Total Lesson Count (search for "17")
- [ ] Line ~307: `// 17 LESSONS` → `// 26 LESSONS`
- [ ] Line ~3332: `const totalLessons = 17;` → `const totalLessons = 26;`
- [ ] Any progress calculations using `/17` → `/26`

#### Update Chapter Count Logic (lines ~3585-3590)
- [ ] Verify chapter counts work with new structure
- [ ] Test progress bar calculation

---

### ✅ PHASE 6: Update Quiz Chapter Mapping

#### Update lessonToChapter Object (line ~3332-3340)
```javascript
const lessonToChapter = {
    1: { current: 1, next: 2, name: 'Introduction' },
    2: { current: 1, next: 2, name: 'Introduction' },
    // ... lessons 3-9 for Introduction

    10: { current: 2, next: 3, name: 'BASIC I' },
    // ... lessons 11-16 for BASIC I
    17: { current: 2, next: 3, name: 'BASIC I' },  // Quiz

    18: { current: 3, next: null, name: 'BASIC II' },
    // ... lessons 19-25 for BASIC II
    26: { current: 3, next: null, name: 'BASIC II' }  // Quiz
};
```

---

### ✅ PHASE 7: Update Navigation References

#### Search and Replace All Lesson Number References
- [ ] `data-lesson="1"` through `data-lesson="17"` in HTML
- [ ] Any hardcoded lesson checks in JavaScript
- [ ] Progress tracking calculations
- [ ] Next/Previous lesson logic

---

### ✅ PHASE 8: Testing Checklist

- [ ] All 26 lessons load correctly
- [ ] Navigation sidebar shows all 3 sections
- [ ] Lesson numbers are sequential (1-26)
- [ ] Progress tracking works (0/9, 0/8, 0/9)
- [ ] Authentication triggers at lesson 18
- [ ] Quiz scoring works for lesson 17 and 25
- [ ] Language switching works (EN/TH)
- [ ] "Mark as Complete" updates progress
- [ ] Next/Previous lesson navigation works
- [ ] Chapter expand/collapse works
- [ ] All links in introduction section work

---

## File Backup Before Starting

```bash
# Create backup
cp courses/course-sql-lesson.html courses/course-sql-lesson-17lessons-backup.html
```

---

## Estimated Token Usage

- Phase 1: ~20,000 tokens (creating 9 new lessons)
- Phase 2: ~5,000 tokens (navigation update)
- Phase 3: ~15,000 tokens (shifting content)
- Phase 4: ~3,000 tokens (auth updates)
- Phase 5: ~3,000 tokens (progress tracking)
- Phase 6: ~2,000 tokens (quiz mapping)
- Phase 7: ~5,000 tokens (references)
- Phase 8: ~2,000 tokens (testing)

**Total: ~55,000 tokens across multiple sessions**

---

## Next Session Priorities

1. **START WITH:** Create backup file
2. **PHASE 1:** Create introduction lesson content (can do 2-3 lessons per session)
3. Save progress after each phase
4. Test incrementally

---

## Notes

- Keep DataRockie casual style for Thai content
- Maintain orange theme (#FAA91A) for Thai sections
- All SQL code examples should be included
- Links should open in new tabs (target="_blank")
- Video embeds should be responsive
