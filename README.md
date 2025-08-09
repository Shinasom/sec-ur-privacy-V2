# SEC-UR Privacy

**The Social Network Built on Consent.**

This is the official repository for the professional refactor of the "Facial Recognition-Powered Social Media for User Photo Privacy" project. This version is being built following modern, secure, and scalable software engineering practices.

## Core Idea

[cite_start]A social media platform that uses facial recognition to detect individuals in uploaded photos[cite: 11]. [cite_start]It will mask the faces of all identified users by default and send a notification to request their approval[cite: 11]. [cite_start]A user's face is only unmasked after they provide explicit consent[cite: 11, 16].

## Tech Stack

- **Backend:** Python 3.11+ with Django & Django REST Framework
- [cite_start]**Database:** MySQL [cite: 113]
- **Frontend (User App):** React (or Next.js)
- **Deployment:** Docker & Google Cloud Run

## Getting Started (Development)

1. Clone this repository.
2. Create and activate a Python virtual environment: `python -m venv venv`
3. Install dependencies: `pip install -r requirements.txt`
4. Run database migrations: `python manage.py migrate`
5. Start the development server: `python manage.py runserver`
