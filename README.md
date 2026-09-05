# QuestCore

> **Edge-Native Classroom Engine & Local-Mesh Gamified Learning
> Platform**

QuestCore is an **offline-first classroom management and gamified
learning mobile application** built with React Native and TypeScript. It
is designed for environments where internet connectivity may be
unreliable or unavailable, allowing teachers and students to manage
attendance, conduct tests, record results, and track learning progress
directly on the device.

The project focuses on making classroom workflows **simple, local, fast,
and resilient without requiring a cloud backend for the core
experience**.

------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [Problem Statement](#problem-statement)
-   [Solution](#solution)
-   [Key Features](#key-features)
-   [User Roles](#user-roles)
-   [Application Flow](#application-flow)
-   [Demo Flow](#demo-flow)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Database Design](#database-design)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Running the Project](#running-the-project)
-   [Demo Credentials](#demo-credentials)
-   [Offline-First Design](#offline-first-design)
-   [Scoring and XP](#scoring-and-xp)
-   [Android APK](#android-apk)
-   [Testing Checklist](#testing-checklist)
-   [Future Enhancements](#future-enhancements)
-   [Limitations of the MVP](#limitations-of-the-mvp)
-   [Why QuestCore](#why-questcore)
-   [Contributing](#contributing)
-   [License](#license)

------------------------------------------------------------------------

## Overview

Many classroom applications depend heavily on internet connectivity,
centralized servers, and continuous synchronization. This can become a
problem in schools, rural areas, temporary classrooms, workshops, or
other environments with limited connectivity.

**QuestCore takes an offline-first approach.**

The application's core classroom data is stored locally using SQLite.
Teachers can manage students, attendance, and tests, while students can
log in, take tests, and view their own performance without requiring an
internet connection.

The MVP provides two separate portals:

### Teacher Portal

Teachers can:

-   Log in securely through the teacher portal
-   View a classroom dashboard
-   Manage the student roster
-   Mark student attendance
-   Create multiple-choice tests
-   View available tests
-   Review students' test results

### Student Portal

Students can:

-   Log in through the student portal
-   View their personal dashboard
-   Check attendance percentage
-   View available teacher-created tests
-   Take tests
-   Receive an automatically calculated score
-   Earn XP based on correct answers
-   View individual test results

------------------------------------------------------------------------

## Problem Statement

Classroom management often involves multiple disconnected processes:

-   Taking attendance
-   Creating tests
-   Conducting assessments
-   Calculating marks
-   Tracking student performance
-   Maintaining student records

These workflows can become especially difficult when connectivity is
poor or when teachers have to depend on multiple applications.

QuestCore aims to bring these essential classroom workflows into **one
lightweight offline-first application**.

### The core challenge

> How can we provide a practical classroom management and gamified
> assessment system that continues to work even when there is no
> internet connection?

### Our approach

QuestCore stores the essential classroom data locally on the device and
performs core operations directly against a SQLite database.

------------------------------------------------------------------------

## Solution

QuestCore combines:

1.  **Local-first classroom management**
2.  **Offline attendance tracking**
3.  **Teacher-created assessments**
4.  **Automatic scoring**
5.  **Gamified XP**
6.  **Separate teacher and student experiences**
7.  **A mobile-first interface**

The application is designed so that the core demo can continue working
after the device is placed in **airplane mode**.

------------------------------------------------------------------------

# Key Features

## 1. Teacher Authentication

Teachers have a dedicated login portal.

After successful authentication, the teacher is taken to the teacher
dashboard.

The current MVP uses local authentication data stored in SQLite.

------------------------------------------------------------------------

## 2. Student Authentication

Students have a separate login experience.

A student account is linked to a specific student record, allowing the
application to load that student's:

-   Attendance
-   Tests
-   Scores
-   XP

------------------------------------------------------------------------

## 3. Student Management

Teachers can access the student roster and manage classroom student
information.

Each student has:

-   Student ID
-   Name
-   Grade
-   Creation timestamp

Example:

``` text
STU001
Aarav
Grade 10
```

------------------------------------------------------------------------

## 4. Attendance Management

Teachers can record attendance for individual students.

Attendance statuses currently include:

``` text
PRESENT
ABSENT
```

Attendance records are associated with:

-   Student
-   Date
-   Status

Students can view their individual attendance percentage from their
dashboard.

------------------------------------------------------------------------

## 5. Test Creation

Teachers can create multiple-choice tests.

A test contains:

-   Test title
-   Subject
-   Questions
-   Answer choices
-   Correct answers
-   XP value for questions

Tests are stored locally in SQLite.

------------------------------------------------------------------------

## 6. Student Test Taking

Students can view tests created by the teacher and start a test.

The quiz screen:

1.  Loads the selected test
2.  Displays its questions
3.  Allows the student to select answers
4.  Calculates the score
5.  Calculates earned XP
6.  Saves the result
7.  Displays the result to the student

------------------------------------------------------------------------

## 7. Automatic Score Calculation

Scores are calculated automatically after submission.

The percentage is calculated using:

``` text
Score = (Correct Answers / Total Questions) × 100
```

The resulting percentage is rounded to the nearest integer.

For example:

``` text
Correct answers: 2
Total questions: 3

Score = (2 / 3) × 100
      = 66.67
      ≈ 67
```

------------------------------------------------------------------------

## 8. XP-Based Gamification

Each question can have an XP value.

Students receive XP for correctly answering questions.

For example:

``` text
Question 1 → 20 XP
Question 2 → 30 XP
Question 3 → 50 XP

All correct → 100 XP
```

This provides a simple foundation for future gamification features such
as:

-   Levels
-   Badges
-   Streaks
-   Leaderboards
-   Achievement systems

------------------------------------------------------------------------

## 9. Student Results

After completing a test, the student can immediately view:

-   Test title
-   Subject
-   Score
-   Earned XP

Results are stored locally and can also be reviewed from the teacher
portal.

------------------------------------------------------------------------

## 10. Teacher Results Dashboard

Teachers can review test performance across students.

This provides a simple way to see how students performed without
manually calculating marks.

------------------------------------------------------------------------

## 11. Offline-First Operation

The core application does not require an active internet connection for:

-   Login
-   Student management
-   Attendance
-   Test creation
-   Test taking
-   Score calculation
-   Result viewing
-   XP tracking

The application's local SQLite database is the primary data store for
the MVP.

------------------------------------------------------------------------

# User Roles

QuestCore currently has two roles.

## Teacher

``` text
TEACHER
```

Teacher capabilities:

-   Login
-   Dashboard
-   Student roster
-   Attendance
-   Create tests
-   View tests
-   Review results

## Student

``` text
STUDENT
```

Student capabilities:

-   Login
-   Personal dashboard
-   Attendance percentage
-   Take tests
-   View results
-   Earn XP

There is intentionally **no admin role** in the current MVP.

------------------------------------------------------------------------

# Application Flow

## Teacher Flow

``` text
Teacher Login
      ↓
Teacher Dashboard
      ↓
 ┌───────────────┬───────────────┬───────────────┐
 ↓               ↓               ↓
Students      Attendance      Create Test
                                      ↓
                                  Test List
                                      ↓
                                Teacher Results
```

## Student Flow

``` text
Student Login
      ↓
Student Dashboard
      ↓
 ┌───────────────┬───────────────┐
 ↓               ↓               ↓
Attendance     Take Test       Results
                  ↓
              Quiz Screen
                  ↓
              Submit Test
                  ↓
           Score + XP Saved
                  ↓
            Result Screen
```

------------------------------------------------------------------------

# Demo Flow

The recommended hackathon demonstration is:

### 1. Teacher Login

``` text
Username: teacher
Password: 1234
```

### 2. Open Teacher Dashboard

Demonstrate:

-   Student roster
-   Attendance
-   Test creation
-   Results

### 3. Create a Test

Create a simple Math test.

Example:

``` text
Title: Math Test
Subject: Mathematics
Questions: 3
```

### 4. Mark Attendance

Mark a student as present.

### 5. Log Out

Return to the login screen.

### 6. Student Login

``` text
Username: aarav
Password: 1234
```

### 7. Show Student Dashboard

Demonstrate:

-   Attendance percentage
-   Available tests
-   Student information

### 8. Take the Test

Answer the questions and submit.

### 9. Show Result

Demonstrate:

``` text
Score: XX%
XP Earned: XX XP
```

### 10. Return to Teacher Portal

Open the teacher results section and demonstrate that the student's
result has been stored.

### 11. Demonstrate Offline Capability

Finally:

``` text
Enable Airplane Mode
        ↓
Open/use QuestCore
        ↓
Login
        ↓
Use core classroom features
```

This demonstrates the project's offline-first architecture.

------------------------------------------------------------------------

# Technology Stack

  Technology         Purpose
  ------------------ --------------------------------------------
  React Native       Mobile application framework
  Expo               React Native development and build tooling
  TypeScript         Type-safe application development
  SQLite             Local persistent database
  expo-sqlite        SQLite integration with Expo
  React Navigation   Application navigation
  EAS Build          Android application builds
  Git                Version control
  GitHub             Source code hosting

------------------------------------------------------------------------

# Architecture

QuestCore follows a local-first mobile architecture.

``` text
┌─────────────────────────────────────────┐
│              React Native UI             │
│                                         │
│ Login / Dashboards / Tests / Results    │
└───────────────────┬─────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────┐
│          Navigation & Screen Logic       │
│                                         │
│ React Navigation + TypeScript           │
└───────────────────┬─────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────┐
│            Application Logic             │
│                                         │
│ Auth / Attendance / Quiz / Scoring      │
└───────────────────┬─────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────┐
│               SQLite Database            │
│                                         │
│ users / students / attendance           │
│ quizzes / scores                        │
└─────────────────────────────────────────┘
```

There is no cloud server required for the core MVP workflow.

------------------------------------------------------------------------

# Database Design

QuestCore uses SQLite for local persistence.

## Students

``` sql
students
```

Fields:

  Field        Description
  ------------ --------------------
  id           Unique student ID
  name         Student name
  grade        Student grade
  created_at   Creation timestamp

------------------------------------------------------------------------

## Attendance

``` sql
attendance
```

Fields:

  Field        Description
  ------------ --------------------------
  id           Unique attendance record
  student_id   Associated student
  date         Attendance date
  status       PRESENT or ABSENT

Relationship:

``` text
Student 1 ─────────── * Attendance
```

------------------------------------------------------------------------

## Quizzes

``` sql
quizzes
```

Fields:

  Field            Description
  ---------------- --------------------------
  id               Unique quiz ID
  title            Test title
  subject          Subject
  questions_json   Serialized question data

Questions are stored as JSON inside the `questions_json` field.

------------------------------------------------------------------------

## Scores

``` sql
scores
```

Fields:

  Field        Description
  ------------ ---------------------------
  id           Unique score ID
  student_id   Student who took the test
  quiz_id      Quiz taken
  score        Percentage score
  earned_xp    XP earned

Relationships:

``` text
Student 1 ─────────── * Scores
Quiz    1 ─────────── * Scores
```

------------------------------------------------------------------------

## Users

``` sql
users
```

Fields:

  Field        Description
  ------------ -------------------------------------
  id           Unique user ID
  name         Display name
  username     Login username
  password     Local authentication password
  role         TEACHER or STUDENT
  student_id   Linked student for student accounts
  created_at   Creation timestamp

Student accounts can be linked to a student record through `student_id`.

------------------------------------------------------------------------

# Project Structure

A simplified structure of the project is:

``` text
QuestCore/
│
├── database/
│   ├── database.ts
│   └── seed.ts
│
├── screens/
│   ├── AttendanceScreen.tsx
│   ├── CreateTestScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── LoginScreen.tsx
│   ├── QuizListScreen.tsx
│   ├── QuizScreen.tsx
│   ├── StudentDashboardScreen.tsx
│   ├── StudentResultScreen.tsx
│   ├── StudentResultsScreen.tsx
│   ├── StudentsScreen.tsx
│   ├── TeacherDashboardScreen.tsx
│   └── TeacherResultsScreen.tsx
│
├── types/
│   ├── database.ts
│   └── navigation.ts
│
├── App.tsx
├── app.json
├── eas.json
├── package.json
├── package-lock.json
└── README.md
```

The exact file structure may evolve as new features are added.

------------------------------------------------------------------------

# Getting Started

## Prerequisites

Install the following before running the project:

-   Node.js
-   npm
-   Git
-   Expo CLI / Expo tooling
-   Android Studio or an Android device for Android testing

Check Node.js:

``` bash
node -v
```

Check npm:

``` bash
npm -v
```

------------------------------------------------------------------------

# Installation

Clone the repository:

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

``` bash
cd QuestCore
```

Install dependencies:

``` bash
npm install
```

------------------------------------------------------------------------

# Running the Project

Start the Expo development server:

``` bash
npx expo start
```

You can then run the application using:

-   Expo Go
-   Android emulator
-   iOS simulator
-   Development build

For Android:

``` bash
npx expo start --android
```

------------------------------------------------------------------------

# Type Checking

The project uses TypeScript.

Run:

``` bash
npx tsc --noEmit
```

A successful check should finish without TypeScript errors.

------------------------------------------------------------------------

# Database Initialization

On application startup, the SQLite database is initialized using:

``` text
database/database.ts
```

The database creates the required tables if they do not already exist.

The initial demo data can be seeded for development/testing.

Because the database is local to the device:

> Data stored in an Expo Go installation does not automatically transfer
> to a separately installed APK.

A fresh APK installation should therefore be tested using the
application's seeded demo data.

------------------------------------------------------------------------

# Demo Credentials

## Teacher

``` text
Username: teacher
Password: 1234
Role: TEACHER
```

## Student

``` text
Username: aarav
Password: 1234
Role: STUDENT
Student: Aarav
Student ID: STU001
Password: 1234
```

> These credentials are intended for the development/hackathon
> demonstration. They should not be used for a production authentication
> system.

------------------------------------------------------------------------

# Offline-First Design

Offline operation is one of QuestCore's main concepts.

Instead of requiring every operation to communicate with a remote
server, the application stores core data locally.

``` text
                ┌─────────────────┐
                │   React Native  │
                │       App       │
                └────────┬────────┘
                         │
                         ↓
                ┌─────────────────┐
                │     SQLite      │
                │ Local Database  │
                └─────────────────┘
```

This means the following operations can work without internet:

``` text
Login
  ↓
Dashboard
  ↓
Attendance
  ↓
Tests
  ↓
Scoring
  ↓
Results
  ↓
XP
```

### Why this matters

An offline-first approach is useful for:

-   Schools with unstable connectivity
-   Rural classrooms
-   Field education
-   Workshops
-   Temporary learning environments
-   Disaster or emergency learning environments
-   Low-connectivity regions

------------------------------------------------------------------------

# Scoring and XP

## Score

The test score is calculated as a percentage.

``` text
score =
round((number of correct answers / total questions) × 100)
```

Example:

``` text
3 questions
2 correct

Score = round((2 / 3) × 100)
      = 67%
```

## XP

XP is calculated independently from the percentage.

Each question contains an XP value.

Example:

``` json
{
  "question": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": 1,
  "xp": 20
}
```

If the student selects the correct answer, the question's XP is added to
the student's earned XP for that test.

------------------------------------------------------------------------

# Android APK

QuestCore can be packaged as an installable Android APK using **Expo
Application Services (EAS)**.

The project uses an EAS preview profile configured for APK output.

Example:

``` json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

Build the APK with:

``` bash
eas build --platform android --profile preview
```

After the cloud build finishes, EAS provides an installation page/QR
code for the Android build.

The APK can then be installed on a physical Android device for the
hackathon demonstration.

------------------------------------------------------------------------

# Testing Checklist

Before a hackathon demonstration, verify the following.

## Authentication

-   [ ] Teacher login works
-   [ ] Student login works
-   [ ] Invalid credentials are rejected
-   [ ] Correct dashboard opens for each role

## Teacher

-   [ ] Teacher dashboard loads
-   [ ] Student roster loads
-   [ ] Attendance screen loads
-   [ ] Attendance can be marked
-   [ ] Test creation works
-   [ ] Created test appears in test list
-   [ ] Teacher results load

## Student

-   [ ] Student dashboard loads
-   [ ] Attendance percentage appears
-   [ ] Available tests appear
-   [ ] Test opens correctly
-   [ ] Answers can be selected
-   [ ] Test submission works
-   [ ] Score is calculated
-   [ ] XP is calculated
-   [ ] Result screen displays correctly

## Persistence

-   [ ] Close and reopen the application
-   [ ] Verify database data remains available
-   [ ] Verify test results remain saved

## Offline Test

-   [ ] Enable airplane mode
-   [ ] Open QuestCore
-   [ ] Login
-   [ ] Open dashboard
-   [ ] Check attendance
-   [ ] Open a test
-   [ ] Submit a test
-   [ ] View result

------------------------------------------------------------------------

# Future Enhancements

The current MVP establishes the core classroom workflow. Several
features can be added later.

## 1. Local Mesh / P2P Networking

The original architecture can be expanded with local network
communication.

Potential architecture:

``` text
             Teacher Device
                   │
             Local Wi-Fi
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
   Student 1   Student 2   Student 3
```

Potential technologies:

-   mDNS service discovery
-   TCP communication
-   Local JSON message exchange

A teacher device could act as the local classroom host and distribute
tests or collect results without internet connectivity.

------------------------------------------------------------------------

## 2. QR-Based Attendance

Students could have unique QR identifiers.

Potential flow:

``` text
Student QR
    ↓
Teacher scans
    ↓
Student identified
    ↓
Attendance marked
```

The current MVP uses a simpler local attendance workflow, while QR
scanning can be added as a bonus feature.

------------------------------------------------------------------------

## 3. Badges and Achievements

XP can be expanded into a complete achievement system.

Examples:

``` text
🏆 First Test Completed
🔥 5 Tests Completed
⭐ 90%+ Score
📚 Perfect Attendance
🚀 500 XP
```

------------------------------------------------------------------------

## 4. Leaderboards

A classroom leaderboard could rank students based on:

-   XP
-   Average score
-   Completed tests
-   Attendance

------------------------------------------------------------------------

## 5. Timed Tests

Tests could optionally include:

``` text
Time Limit: 10 minutes
```

The application could automatically submit the test when the timer
reaches zero.

------------------------------------------------------------------------

## 6. Advanced Analytics

Teacher dashboards could include:

-   Average class score
-   Highest/lowest score
-   Attendance trends
-   Student performance trends
-   Subject-wise performance
-   Test difficulty analysis

------------------------------------------------------------------------

## 7. PDF Export

Teachers could eventually export:

-   Attendance reports
-   Student results
-   Class performance reports

as PDF documents.

------------------------------------------------------------------------

## 8. Cloud Synchronization

Although the MVP is offline-first, optional synchronization could be
added.

Example:

``` text
Local SQLite
     ↓
Internet available
     ↓
Sync Service
     ↓
Cloud Database
```

The important principle would be:

> Cloud connectivity should enhance the application, not be required for
> its core classroom functionality.

------------------------------------------------------------------------

# Limitations of the MVP

QuestCore is currently a hackathon MVP rather than a production-ready
education platform.

Known limitations include:

-   Local authentication is simplified
-   Passwords are stored locally for the demo
-   No production-grade authorization system
-   No cloud synchronization
-   No real-time multi-device networking in the current MVP
-   QR attendance is not part of the core MVP
-   PDF export is not currently implemented
-   Test editing/deletion may be expanded later
-   Advanced analytics are limited
-   The application currently focuses primarily on multiple-choice
    assessments

These limitations are intentional so that the core offline classroom
workflow can be demonstrated reliably within a short development cycle.

------------------------------------------------------------------------

# Why QuestCore?

QuestCore is built around a simple idea:

> **Learning should not stop because the internet does.**

Instead of treating offline functionality as an optional fallback,
QuestCore treats the local device as the primary classroom environment.

This makes the platform particularly relevant to environments where
connectivity is:

-   Expensive
-   Unstable
-   Limited
-   Unavailable

At the same time, gamification through XP provides a foundation for
making routine classroom activities more engaging for students.

------------------------------------------------------------------------

# Hackathon Value Proposition

QuestCore combines multiple practical concepts in one application:

### Offline-first

Core classroom workflows continue without internet access.

### Education

Attendance, assessments, and performance tracking are unified.

### Gamification

Students earn XP through learning activities.

### Mobile-first

The system is designed for phones and tablets rather than requiring
classroom computers.

### Extensible architecture

The MVP can evolve toward:

-   Local mesh networking
-   QR attendance
-   Cloud synchronization
-   Advanced analytics
-   Badges
-   Leaderboards
-   Timed assessments

------------------------------------------------------------------------

# Development Philosophy

QuestCore follows a simple development philosophy:

``` text
Offline First
      ↓
Local Persistence
      ↓
Simple UX
      ↓
Reliable Core Features
      ↓
Optional Connectivity
      ↓
Advanced Features
```

The goal is to make the fundamental classroom workflow dependable before
adding more complex networking and cloud features.

------------------------------------------------------------------------

# Contributing

Contributions are welcome.

A typical contribution workflow is:

``` bash
git clone <repository>
cd QuestCore
npm install
```

Create a feature branch:

``` bash
git checkout -b feature/your-feature
```

Make your changes and test them:

``` bash
npx tsc --noEmit
npx expo start
```

Commit:

``` bash
git add .
git commit -m "Add: your feature"
```

Push:

``` bash
git push origin feature/your-feature
```

Then open a pull request on GitHub.

------------------------------------------------------------------------

# License

This project is currently distributed under the license included in the
repository.

See:

``` text
LICENSE
```

for the applicable terms.

------------------------------------------------------------------------

# Project Status

**Current status: Hackathon MVP**

Core functionality implemented:

-   [x] Teacher authentication
-   [x] Student authentication
-   [x] Separate teacher/student dashboards
-   [x] Student management
-   [x] Attendance tracking
-   [x] Test creation
-   [x] Test listing
-   [x] Student test taking
-   [x] Automatic score calculation
-   [x] XP calculation
-   [x] SQLite result persistence
-   [x] Student result screen
-   [x] Teacher results
-   [x] Offline-first core workflow
-   [x] Android APK build configuration

Planned/bonus features:

-   [ ] QR attendance
-   [ ] Local mesh/P2P networking
-   [ ] PDF reports
-   [ ] Timed tests
-   [ ] Advanced analytics
-   [ ] Badges and achievements
-   [ ] Leaderboards
-   [ ] Cloud synchronization

------------------------------------------------------------------------

## Built With ❤️ for Offline-First Learning

**QuestCore** --- *Learn. Play. Track. Anywhere.*
