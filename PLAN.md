SEC-UR Privacy v2 - Project Plan & Roadmap (Updated)
This document outlines the strategic plan, scope, and architecture for the refactor of the SEC-UR Privacy project.

1. Primary Goal
To refactor the legacy codebase into a modern, secure, scalable, and professional full-stack application. The new architecture will follow industry best practices and resolve all identified security vulnerabilities and design flaws of the original implementation.

2. Current Status (As of August 26, 2025)
The project is significantly ahead of schedule. The core functionality for the Phase 1 MVP has been successfully implemented and tested across the full stack.

COMPLETED
 Backend: Secure User Authentication, Photo Management, Core Consent Workflow (Recognition, Masking, Unmasking), and Admin Panel.

COMPLETED
 Frontend: Component-based UI architecture (Next.js), user registration/login forms, photo upload modal, and live data integration for the main photo feed and consent management pages.

3. Phased Delivery Plan (Revised)
With the core features built, the plan is now updated to focus on hardening the MVP and then expanding its social features across both the frontend and backend.

Phase 1: MVP Hardening & Optimization
Goal: Evolve the functional MVP into a robust, scalable, and production-ready application by implementing critical performance optimizations and security enhancements.

Revised Target Deadline: Mid-September 2025.

Estimated Remaining Workload: 15-20 Hours.

Scope (Remaining Full-Stack Tasks for Phase 1):
Asynchronous Task Processing (Backend):

Integrate Celery and Redis to move the process_photo_for_faces service to a background task.

Performance Optimization (Backend):

Pre-calculate and store face encodings on the CustomUser model to dramatically speed up face comparisons.

API Security Hardening (Backend & Frontend):

Backend: Refactor the UserViewSet to prevent unauthorized listing or modification of user data.

Frontend: Remove all insecure API calls (e.g., /api/users/) from components and rely on data provided by secure, specific endpoints.

Configuration Management (Backend):

Secure the settings.py file by moving secrets to environment variables using python-decouple.

Phase 2: Social Feature Expansion
Goal: Build upon the stable foundation by adding standard social media features to create a more feature-complete application for the final submission.

Target Deadline: End of October 2025.

Estimated Workload: 30-40 Hours.

Scope (Full-Stack Features for Phase 2):
Friend/Follower System:

Backend: Create models and API endpoints for sending, viewing, and managing friend requests.

Frontend: Build the UI for searching users, sending requests, and viewing a friend list.

Post Engagement:

Backend: Create models and API endpoints for Likes and Comments.

Frontend: Add like buttons and comment sections to the Post component.

Direct Messaging:

Backend: Implement a basic real-time chat API (e.g., using Django Channels).

Frontend: Build a private messaging interface.

User Interaction:

Backend: Create API endpoints for submitting feedback and reporting posts.

Frontend: Develop UI components for feedback forms and report buttons.

4. High-Level Architecture
The project is built on a modern, decoupled, three-part architecture:

Backend API: A "headless" API built with Django and Django REST Framework.

Admin Panel: Utilizes the built-in Django Admin site for secure system management.

User Web App: A user-facing frontend built with Next.js that consumes the backend API.

5. Final Deadline
Final Project Submission: First week of December 2025.
