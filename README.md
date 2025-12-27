# Rachel Cooray | Portfolio Website

A personal portfolio website built with **Flutter Web**, designed to showcase projects, skills, and experience with a premium, responsive UI.

## 🚀 Features

- **Premium UI/UX**: Dark theme, glassmorphism, and smooth animations.
- **Interactive Elements**: 3D hover effects, carousels, and flip cards.
- **Responsive Design**: Optimized for Desktop and Mobile (Web-first).
- **Data Driven**: Content loaded dynamically from local assets (easily configurable).
- **Contact Form**: Functional email form using a lightweight Node.js server (or convertible to Formspree).

## 🛠️ Tech Stack

- **Frontend**: Flutter (Dart)
- **Backend (Optional)**: Node.js (Express, Nodemailer) - *Used only for the 'Contact Me' form.*
- **Deployment**: Static Web Hosting (Vercel/Render/GitHub Pages)

## 🏃‍♂️ Getting Started

### Prerequisites
- Flutter SDK installed
- Node.js (optional, for local contact form testing)

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

3. **Run the Backend (Optional)**
   *Only required if you want to test the email sending functionality locally.*
   ```bash
   cd server
   npm install
   node app.js
   ```

## 📦 Deployment

To deploy the frontend as a static site:

```bash
cd client
flutter build web --release
```

The `build/web` folder is ready to be uploaded to any static hosting provider.

---
© 2024 Rachel Cooray
