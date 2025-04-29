# ElevateX

## Overview
The **Project Showcase Website** is a dynamic platform where users can display their projects with descriptions, images, and links. Built with a modern tech stack, this website provides an interactive and responsive UI with a powerful backend to handle data storage and retrieval efficiently.

## Features
- 🖼️ **Project Display:** Showcase projects with images, descriptions, and tags.
- 🔍 **Search & Filter:** Find projects based on keywords and categories.
- 📊 **User Profiles:** Users can create accounts and manage their projects.
- ⚡ **Fast & Responsive:** Optimized with Vite and TailwindCSS for quick performance.
- 🛠️ **Admin Panel:** Admins can manage users and content.
- 🔐 **Authentication:** Secure login and registration with JWT.
- 📡 **API-Driven Backend:** REST API for seamless data interaction.

## Tech Stack
### Frontend
- **React** – UI development
- **Vite** – Fast build tool
- **Tailwind CSS** – Styling
- **React Router** – Navigation
- **Axios** – API requests
- **Other Libraries** – Additional enhancements

### Backend
- **Bun** – Fast JavaScript runtime
- **Node.js** – Server environment
- **Express** – Backend framework
- **Mongoose** – MongoDB ORM
- **JWT** – Authentication
- **Cors & Helmet** – Security enhancements

## Setup & Installation
### Prerequisites
- Node.js & Bun installed
- MongoDB instance (local/cloud)

### Steps
#### Clone Repository
```sh
 git clone https://github.com/yourusername/project-showcase.git
 cd project-showcase
```
#### Install Dependencies
##### Main Dir
```sh
 bun install
```
##### Frontend
```sh
 cd frontend
 bun install
```
##### Backend
```sh
 cd backend
 bun install
```
#### Environment Variables
Create a **.env** file in the backend folder:
```
MONGO_URI=your_mongo_connection_string
EMAIL = your_company_mail
EMAIL_PASSWORD = your_email_pass
JWT_SECRET=your_secret_key
PORT=5000
```
#### Run the Application
##### Go to main directory i.e elevateX
##### Start Backend
```sh
 bun server
```
##### Start Frontend
```sh
 bun client
```
The app will be available at `http://localhost:5173`

## Contributing
Feel free to contribute by submitting issues or pull requests.

## License
This project is open-source and available under the MIT License.

## 📽️ Demo Video

Watch the full project demonstration and presentation here:  
👉 [YouTube Video Link](https://youtu.be/-7je8hHQoKA)
## 📹 Presentation

Watch the full presentation here:  
👉 [Presenatation Link](https://www.canva.com/design/DAGmCdNuR0Y/XjlNMhIbtygi1_IkZ0Fy4A/edit)
