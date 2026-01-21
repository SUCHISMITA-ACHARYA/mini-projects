
Expense Sharing Application 

Overview

This is a simple expense sharing web application that allows users to create groups, add shared expenses, and view balances showing who owes money to whom. The application focuses on correct expense splitting logic as required by the assignment.The backend is built using Django and Django REST Framework, and the frontend uses HTML, CSS, and JavaScript.

How It Works: 

-Create a group by providing a group name and member names<br>
-Add expenses by specifying the payer, amount, and split type<br>

Supported split types:<br>
-Equal split<br>
-Exact split<br>
-Percentage split<br>

Backend API Paths:<br>
All APIs return JSON and are prefixed with /api.

Create group<br>
POST /api/group

Add expense<br>
POST /api/expense

View balances<br>
GET /api/balances/<group_name>/<user_name>

Reset application<br>
POST /api/reset

Example:

http://127.0.0.1:8000/api/balances/Trip/A

Admin Dashboard:

Admin URL:<br>
-http://127.0.0.1:8000/admin

Admin credentials:<br>
-Username: ESA<br>
-Password: ESA


This project fulfills all requirements from the assignment:

1. Group creation and user management
2. Expense creation with multiple split types
3. Accurate balance calculation
4. Clear display of who owes whom
5. Ability to test multiple scenarios
6. Clean backend and frontend integration
