# Copilot Instructions for ElevateX

## Overview
ElevateX is a platform designed to facilitate collaboration between students and mentors. Students can upload their projects and form teams, while mentors can be assigned to guide them. The platform also includes features like project showcases, event management, and user authentication.

---

## Key Features

1. **Project Management**
   - Students can create and upload projects with details like title, description, SDGs (Sustainable Development Goals), and authors.
   - Projects are displayed in a grid format on the home page with search and filter functionality.

2. **Mentor Assignment**
   - Mentors can sign up and specify their areas of expertise.
   - Mentors are assigned to projects to provide guidance and feedback.

3. **Authentication**
   - Separate signup and login flows for students and mentors.
   - OTP-based verification for secure account creation.

4. **Showcase Events**
   - Upcoming events and news are highlighted on the landing page.
   - A gallery section displays moments from past events.

5. **Dynamic Project Details**
   - Each project has a dedicated page displaying detailed information, including SDGs, authors, and descriptions.

---

## Key Files and Their Purpose

### 1. `client/src/pages/ProjectDetails.jsx`
- **Purpose**: Displays detailed information about a specific project.
- **Enhancements**:
  - Add a "Related Projects" section at the bottom to suggest similar projects.
  - Use badges or icons for SDGs to improve visual appeal.
  - Include a "Back to Projects" button for better navigation.

### 2. `client/src/pages/Home.jsx`
- **Purpose**: Displays a grid of projects with search and filter functionality.
- **Enhancements**:
  - Add animations to project cards for hover effects (refer to `ProjectCard.jsx` for motion effects).
  - Display a message or illustration when no projects match the search/filter criteria.

### 3. `client/src/pages/LandingPage.jsx`
- **Purpose**: Serves as the main landing page for the application.
- **Enhancements**:
  - Add a "How It Works" section to explain the platform's process (refer to the `processSteps` array in this file).
  - Include a "Testimonials" section to showcase user feedback (refer to the `testimonials` array in this file).
  - Highlight upcoming events and news dynamically using the `upcomingEvents` array.

### 4. `client/src/components/ProjectCard.jsx`
- **Purpose**: Represents individual project cards in the grid.
- **Enhancements**:
  - Add a "View Details" button to navigate directly to the project details page.
  - Use lazy loading for project images to improve performance.

### 5. `client/src/components/Navbar.jsx`
- **Purpose**: Provides navigation across the platform.
- **Enhancements**:
  - Add a sticky header with quick links to key sections like "Projects," "About," and "Contact."
  - Include a profile dropdown for logged-in users.

---

## Suggested Improvements

### General UI/UX
- Use consistent spacing and typography across all pages.
- Add a dark mode toggle for better accessibility.
- Improve responsiveness for smaller devices.

### Performance
- Optimize images using a CDN or compression tools.
- Implement code-splitting to reduce initial load time.

### Backend Integration
- Replace hardcoded project data in `ProjectDetails.jsx` and `Home.jsx` with dynamic API calls.
- Add API endpoints for filtering projects by SDGs or authors.

---

## Development Workflow

### Prerequisites
- Ensure Node.js, Bun, and MongoDB are installed (refer to the [README.md](../README.md) for setup instructions).

### Running the Application
1. Start the backend:
   ```sh
   bun server