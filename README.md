# Rachel Cooray | Portfolio Website

A personal portfolio website built with **Flutter Web**, designed to showcase projects, skills, and experience with a premium, responsive UI.

**[🌐 View Live Site](https://rachelcooray.github.io/portfolio/)**

## 🚀 Features

- **Premium UI/UX**: Dark theme, glassmorphism, and smooth animations.
- **Interactive Elements**: 3D hover effects, carousels, and flip cards.
- **Responsive Design**: Optimized for Desktop and Mobile (Web-first).
- **Data Driven**: Content loaded dynamically from local assets (easily configurable).
- **Contact Form**: Functional email form using a lightweight Node.js server.

## 🛠️ Tech Stack

- **Frontend**: Flutter (Dart) - Hosted on *GitHub Pages*
- **Backend**: Node.js (Express, Nodemailer) - Hosted on *Render*
- **Database (Optional)**: Postgres (configured but currently unused for static content)

## 🏃‍♂️ Getting Started

### Prerequisites
- Flutter SDK installed
- Node.js (for backend)

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/rachelcooray/portfolio.git
   cd portfolio
   ```

2. **Run the Frontend**
   ```bash
   cd client
   flutter run -d chrome
   ```

3. **Run the Backend (Contact Form)**
   The backend handles email submissions.

   **Setup Environment Variables:**
   Create a `.env` file in the `server` directory with your credentials:
   ```env
   PORT=3000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **Start the Server:**
   ```bash
   cd server
   npm install
   node app.js
   ```

## 📦 Deployment

### Frontend (GitHub Pages)
The frontend is automatically deployed to GitHub Pages via **GitHub Actions**.
- Push changes to the `main` branch.
- The workflow in `.github/workflows/deploy.yml` builds the app and deploys it to the `gh-pages` branch.

### Backend (Render)
The backend is hosted on Render as a Web Service.
- Connect your GitHub repo to Render.
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node app.js`
- **Environment Variables**: Add `EMAIL_USER` and `EMAIL_PASS` in the Render Dashboard.

---
© 2026 Rachel Cooray
