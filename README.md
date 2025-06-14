# 🚀 GitHub Contribution Analyzer

## 📌 Overview
GitHub Contribution Analyzer helps developers measure the **actual impact** of their contributions rather than just commit count. It provides detailed insights into meaningful contributions, including:
- **Lines of Code (LOC) added/removed**
- **Pull Requests (PRs) merged**
- **Issues resolved**

With a visually appealing **developer profile page**, this project allows users to track their GitHub activity in a more meaningful way. 🎯

---

## 🎨 Features
✅ **Impact-Based Contribution Score** – Ranks users based on real contributions, not just commits.
✅ **Activity Breakdown** – View **LOC changes, PRs, issues, and commits**.
✅ **Top Repository Contributions** – Identify repositories where the most impact was made.
✅ **Gamification & Badges** – Earn badges for meaningful contributions.

---

## 🔧 Tech Stack
### **Backend:**
- **Node.js & Express.js** – Handles API requests.
- **MongoDB** – Stores user profiles & contribution data.
- **GitHub OAuth** – Authentication via GitHub API.

### **Frontend:**
- **React + TailwindCSS** – For a clean, modern UI.
- **Recharts/D3.js** – Visual graphs for contribution analysis.
- **ShadCN/UI or Material UI** – Professional UI components.

### **APIs & Tools:**
- **GitHub REST** – Fetch contribution details.
- **OAuth 2.0** – Secure authentication.

---

## 🛠️ Installation & Setup
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/github-contribution-analyzer.git
cd github-contribution-analyzer
```

### **2️⃣ Backend Setup**
```sh
cd backend
npm install
npm start
```
Create a `.env` file and add:
```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
```

### **3️⃣ Frontend Setup**
```sh
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing
We welcome contributions! 🚀 Feel free to:
1. Fork the repo 🍴
2. Create a new branch 🌿
3. Make your changes 💡
4. Submit a PR 📬



