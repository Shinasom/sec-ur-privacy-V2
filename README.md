# Unmask

**The Social Network Built on Consent.**

This is the official repository for the professional refactor of the "Facial Recognition-Powered Social Media for User Photo Privacy" project. This version is being built following modern, secure, and scalable software engineering practices.

## Core Idea

[cite_start]A social media platform that uses facial recognition to detect individuals in uploaded photos[cite: 11]. [cite_start]It will mask the faces of all identified users by default and send a notification to request their approval[cite: 11]. [cite_start]A user's face is only unmasked after they provide explicit consent[cite: 11, 16].

## Tech Stack

- **Backend:** Python 3.11+ with Django & Django REST Framework
- [cite_start]**Database:** postgreSQL [cite: 113]
- **Frontend (User App):** React (or Next.js)
- **Deployment:** Docker & Google Cloud Run

## Getting Started (Development)

### **Part 1: Prerequisites**

Before you begin, ensure you have the following software installed on your system:

1.  **Python (3.11+):** The backend is built with Python. You can download it from [python.org](https://www.python.org/downloads/).
2.  **Node.js (18.x or newer):** The frontend is a Next.js application. You can download it from [nodejs.org](https://nodejs.org/).
3.  **PostgreSQL:** This is our database. You can download it from [postgresql.org](https://www.postgresql.org/download/).
    * During installation, you will be asked to set a password for the default `postgres` user. **Remember this password.**
4.  **Git:** To clone the project repository. You can get it from [git-scm.com](https://git-scm.com/downloads).

### **Part 2: Backend Setup (Django API)**

Follow these steps in your terminal.

**1. Clone the Repository**
```bash
git clone <your-repository-url>
cd <repository-folder-name>/backend
```

**2. Create and Activate a Virtual Environment**
This isolates the project's Python dependencies.
```bash
# Create the virtual environment
python -m venv venv

# Activate it (on Windows)
venv\Scripts\activate

# Activate it (on macOS/Linux)
source venv/bin/activate
```
You should see `(venv)` at the beginning of your terminal prompt.

**3. Install Dependencies**
```bash
pip install -r requirements.txt
```
This will install Django, Django REST Framework, psycopg2-binary, and all other required packages.

**4. Set Up the PostgreSQL Database**
* Open the `psql` command-line tool or a GUI tool like pgAdmin.
* Create a new user and a new database for the project. **Run these SQL commands:**
    ```sql
    CREATE USER secuser WITH PASSWORD 'mainproject';
    CREATE DATABASE sec_ur_privacy OWNER secuser;
    ```
    *(These credentials match what's in the `settings.py` file. You can change them, but you'll need to update the settings file accordingly.)*

**5. Run Database Migrations**
This command creates all the necessary tables in your new database.
```bash
python manage.py migrate
```

**6. Create a Superuser (Admin Account)**
This account is for accessing the Django admin interface.
```bash
python manage.py createsuperuser
```
Follow the prompts to create a username, email, and password.

**7. Run the Backend Server**
```bash
python manage.py runserver
```
By default, the backend API will now be running at **`http://127.0.0.1:8000/`**. Keep this terminal window open.

### **Part 3: Frontend Setup (Next.js App)**

Open a **new, separate terminal window** for these steps.

**1. Navigate to the Frontend Directory**
```bash
cd <repository-folder-name>/frontend
```

**2. Install Dependencies**
```bash
npm install
```
This will install React, Next.js, Axios, Tailwind CSS, and all other required packages from `package.json`.

**3. Run the Frontend Development Server**
```bash
npm run dev
```
The frontend application will now be running at **`http://localhost:3000/`**.

### **Part 4: You're All Set!**

You can now open your web browser and navigate to **`http://localhost:3000/`**.

* The Next.js app will load.
* You can register a new user or log in.
* The frontend will automatically make API calls to your Django backend running on port 8000.

To stop the servers, go to each terminal window and press `Ctrl + C`.
