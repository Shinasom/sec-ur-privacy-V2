# SEC-UR Privacy v2 - Project Plan & Roadmap

This document outlines the strategic plan, scope, and architecture for the refactor of the SEC-UR Privacy project.

## 1. Primary Goal

To refactor the legacy codebase into a modern, secure, scalable, and professional full-stack application. The new architecture will follow industry best practices and resolve all identified security vulnerabilities and design flaws of the original implementation.

## 2. Phased Delivery Plan

To meet all project requirements before the final December deadline, we will follow a two-phase iterative development plan.

---

### **Phase 1: The Core MVP (Minimum Viable Product)**

- [cite_start]**Goal:** Deliver a complete, polished, and deployable version of the project that flawlessly demonstrates its core, unique value proposition: privacy-first, consent-based photo sharing[cite: 803, 809].
- **Target Deadline:** End of October 2025.
- **Estimated Workload:** 60-75 Hours.

#### **Scope (In-Scope Features for Phase 1):**

- **Secure User Authentication:**
  - [cite_start]User Registration with a facial image and secure password hashing[cite: 507, 543].
  - Secure user login that provides an authentication token for the API.
- **Photo Management:**
  - Ability for users to upload a profile picture.
  - [cite_start]Ability to upload a new photo post to the platform[cite: 509].
- **Core Consent Workflow:**
  - [cite_start]Automatic facial recognition on uploaded photos to identify registered users[cite: 512, 513].
  - [cite_start]Automatic masking of all identified faces by default upon upload[cite: 519].
  - [cite_start]Automatic creation and sending of `ConsentRequest` notifications to identified users[cite: 514].
  - A user-facing UI to view pending requests and "Approve" or "Deny" them.
  - [cite_start]A social feed that displays photos with faces correctly masked or unmasked based on real-time consent status[cite: 522].
- **Admin Management:**
  - [cite_start]A secure, automatically generated Django Admin Panel for system management (user review, content moderation, etc.)[cite: 525].

---

### **Phase 2: Social Feature Expansion**

- **Goal:** Build upon the stable MVP foundation by adding standard social media features to create a more feature-complete application for the final submission.
- **Target Deadline:** End of November 2025.
- **Estimated Workload:** 30-40 Hours.

#### **Scope (In-Scope Features for Phase 2):**

- **Friend/Follower System:**
  - [cite_start]Ability to send, view, accept, and reject friend requests[cite: 532, 1142, 1143].
- **Post Engagement:**
  - [cite_start]Ability to Like and Comment on posts[cite: 529, 531].
- **Direct Messaging:**
  - [cite_start]A basic private chat system between connected users[cite: 607, 699].
- **User Interaction:**
  - [cite_start]Ability to search for other users on the platform[cite: 526].
  - [cite_start]A system for users to send feedback or report posts[cite: 657, 1150].

---

## 3. High-Level Architecture

The project is built on a modern, decoupled, three-part architecture:

1.  **Backend API:** A "headless" API built with Django and Django REST Framework. Its only job is to manage data and serve it as JSON.
2.  **Admin Panel:** Utilizes the built-in Django Admin site for secure, zero-effort system management.
3.  **User Web App:** A user-facing frontend built with React (using a professional template to accelerate development) that consumes the backend API.

## 4. Final Deadline

- **Final Project Submission:** First week of December 2025.
