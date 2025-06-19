

# 🚀 GitHub Contribution Analyzer

## 📌 Overview

**GitHub Contribution Analyzer** is a developer-focused tool that analyzes the **quality and impact** of contributions on GitHub, rather than just the quantity of commits. It provides an insightful visual breakdown of contribution metrics like **LOC added/removed, PRs merged, and top repositories**, offering a deeper understanding of how much value a developer brings to open-source projects.

---

## 🎯 Key Features

### 🧑‍💻 **User Profile Overview**

* Displays GitHub avatar, name, bio, company, location, followers/following.
* Highlights public repository count and join date.

### 📁 **Repository Insight**

* Overview of total repositories, forked repositories, original projects.
* Aggregated stats on total stars, forks, and watchers.

### 🌟 **Impact Score**

* Calculated using:

  * **Stars & Forks (33.3%)**
  * **Code Contributions (27.8%)**
  * **PR Success Rate (22.2%)**
  * **Commits (16.7%)**

### 📊 **Contribution Metrics**

* **Lines of Code (LOC) Added**
* **LOC Removed**
* **Total Commits**
* **Pull Requests Merged**

### 🌐 **Language Analysis**

* Shows top programming languages used across repositories.
* Displays **percentage breakdown** and **total LOC** written per language.
* Color-coded for clarity and presented in a pie chart or list view.

### 🧭 **Radar Balance Chart**

* Compares developer’s balance across:

  * Commits
  * PRs
  * Issues
  * Stars
  * Forks
* Helps visualize areas of strength and engagement.

### 📆 **Activity Timeline**

* Tracks last **6 months of activity**.
* Combined bar chart showing monthly **commits** and **PRs**.
* Helps analyze consistency and recent contributions.

### 🔝 **Top Repositories**

* **Top Original Repositories**: Based on LOC and recent activity.
* **Top Forked Repositories**: Shows contributions to external projects.
* Repository details include:

  * Name, stars, forks
  * LOC added/removed
  * Last updated time

---

## 🛠️ Tech Stack

### 🔙 Backend

* **Node.js** & **Express.js**

  * Handles API routing, GitHub data fetching, and score calculation.

### 🌐 Frontend

* **React.js** + **Vite** – Fast and modern React setup
* **Tailwind CSS** – Utility-first styling for rapid UI development
* **Recharts** – For dynamic and interactive visualizations

### 🔗 APIs & Tools

* **GitHub REST API v3** – For user, repo, commit, PR, and language data

---

## 🚀 Installation & Setup

### 🧰 1. Clone the Repository

```bash
git clone https://github.com/yourusername/github-contribution-analyzer.git
cd GitImpact
```

---

### 🧪 2. Backend Setup

```bash
cd Backend
npm install
npm start
```

Create a `.env` file:

```env
PORT=3000
GITHUB_ACCESS_TOKEN=your_github_token
```

---

### 🎨 3. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_BACKEND_URL
```

---

## 🤝 Contributing

We welcome contributions! Here’s how you can help:

1. **Fork** the repository
2. **Create a new branch**
3. **Commit** your changes
4. **Push** to your fork
5. Submit a **Pull Request**

---

## 🧠 Future Ideas

* Weekly/Monthly email reports for contributors
* Exportable profiles (PDF/JSON)
* GitHub GraphQL API support for optimized queries

---

## 📸 UI Preview
![image](https://github.com/user-attachments/assets/19bfe501-1735-4476-9ab7-0ae778d8ae57)

![image](https://github.com/user-attachments/assets/0d6c3aa5-3117-4171-81c7-eb456ad7a525)

![image](https://github.com/user-attachments/assets/8b7ad3dc-81fb-4292-a258-6af4a14ef121)



---


