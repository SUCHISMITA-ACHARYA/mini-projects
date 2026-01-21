🎥 Video Processing Platform

Overview

This is a full-stack video processing platform built for an assignment.
Users can log in, upload videos (based on role), see real-time processing progress, and watch videos.


User Roles:

Viewer:

Email: viewer@test.com<br>
Password: 1234

-Can log in<br>
-Can browse and play videos<br>
-Cannot upload videos<br>

Editor:

Email: editor@test.com<br>
Password: 1234

-Can log in<br>
-Can upload videos<br>
-Can see real-time processing progress<br>
-Can view video status (Safe / Flagged)<br>

Features:

1. JWT-based login system.
2. Role-based access control (RBAC).
3. Video upload using Multer.
4. Real-time processing progress using Socket.io.
5. Simulated video moderation (Safe / Flagged).
6. Video playback using HTML5 video player.
7. Clean and role-aware UI.

Tech Stack:

Frontend:

-React (Vite)<br>
-CSS<br>
-Axios<br>
-Socket.io Client<br>

Backend:

-Node.js<br>
-Express<br>
-MongoDB<br>
-Mongoose<br>
-Multer<br>
-Socket.io<br>
-JWT

How to Run:

Backend-

cd backend<br>
npm install<br>
node index.js<br>

Runs on: http://localhost:5000<br>

Frontend-

cd frontend<br>
npm install<br>
npm run dev<br>

Runs on: http://localhost:5173

Notes-

Video processing and moderation are mocked to demonstrate workflow.<br> 
Focus is on architecture, access control, and real-time updates.<br>
UI is kept simple, clean, and functional.

