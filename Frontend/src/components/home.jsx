import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,RadarChart,PolarGrid,PolarAngleAxis,PolarRadiusAxis,Radar,LineChart,Line,
  PieChart,Pie,Cell,AreaChart,Area,
} from "recharts";
import {Github,Star,BookOpen,Users,Calendar,MapPin,Briefcase,Code,GitPullRequest,Bug,Award,Download,Share2,GitFork,Eye,Activity,Zap,TrendingUp,Clock,Database,
} from "lucide-react";
import { Info  } from "lucide-react";


export default function GitHubDashboard() {

  const {username} = useParams();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [stars, setStars] = useState(0);
  const [forkedRepo, setForkedRepo] = useState(0);
  const [watchers, setWatchers] = useState(0);
  const [originalRepos, setOriginalRepos] = useState(0);

  const [totalLoc, setTotalLoc] = useState(0);
  const [deletedLoc, setDeletedLoc] = useState(0);
  const [commits, setCommits] = useState(0);

  const [totalPRs, setTotalPRs] = useState(0);
  const [prsMerged, setPrsMerged] = useState(0);

  const [topOriginalRepos, setTopOriginalRepos] = useState([]);
  const [topForkedRepos, setTopForkedRepos] = useState([]);
  const [topLanguages, setTopLanguages] = useState([]);

  const [prActivity, setPrActivity] = useState([]);
  const [commitActivity, setCommitActivity] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  const [showImpactTooltip, setShowImpactTooltip] = useState(false);
  const [repoFilter, setRepoFilter] = useState('all');
  const [repoSort, setRepoSort] = useState('stars');

  const [impactScore, setImpactScore] = useState(0);

  const [loadingSteps, setLoadingSteps] = useState([
    { label: "Fetching User Profile", done: false },
    { label: "Fetching Repository Data", done: false },
    { label: "Calculating LOC", done: false },
    { label: "Analyzing Pull Requests", done: false },
    { label: "Calculating Impact Score", done: false },
  ]);

  const markStepDone = (index) => {
    setLoadingSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, done: true } : step
      )
    );
  };

  function generateLanguageData(repos) {
    const colors = {
      JavaScript: "#F7DF1E",
      TypeScript: "#3178C6",
      Python: "#3776AB",
      React: "#61DAFB",
      CSS: "#1572B6",
      HTML: "#E34F26",
      Go: "#00ADD8",
      Java: "#b07219",
      C: "#555555",
      "C++": "#f34b7d",
      Rust: "#dea584",
    };
    const locByLang = {};
    let total = 0;

    for (const { language, loc = 0 } of repos) {
      if (!language) continue;
      locByLang[language] = (locByLang[language] || 0) + loc;
      total += loc;
    }

    return Object.entries(locByLang)
      .map(([language, loc]) => ({
        name: language,
        value: Math.round((loc / total) * 100),
        color: colors[language] || "#999999",
        loc,
      }))
      .sort((a, b) => b.loc - a.loc);
  }

  function generateMonthlyPRActivity(prs) {
    const MONTHS = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const now = new Date();
    const monthBuckets = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: MONTHS[d.getMonth()],
        prs: 0
      };
    });

    for (const pr of prs) {
      const d = new Date(pr.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = monthBuckets.find((b) => b.key === key);
      if (bucket) bucket.prs += 1;
    }

    return monthBuckets.map(({ month, prs }) => ({ month, prs }));
  }

  function generateMonthlyCommitActivity(commitsList) {
    const MONTHS = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const now = new Date();
    const monthBuckets = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: MONTHS[d.getMonth()],
        commits: 0
      };
    });

    for (const c of commitsList) {
      const d = new Date(c.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = monthBuckets.find((b) => b.key === key);
      if (bucket) bucket.commits += 1;
    }

    return monthBuckets.map(({ month, commits }) => ({ month, commits }));
  }

  function generateActivityData(prAct, commitAct) {
    return prAct.map((b, i) => ({
      month: b.month,
      prs: b.prs,
      commits: commitAct[i]?.commits || 0
    }));
  }

  function calculateImpactScore(loc, commits, PRs) {
    const locScore = Math.min(100, loc / 100);
    const commitScore = Math.min(100, commits );
    const prScore   = Math.min(100, PRs * 2);
    const total     = Math.floor((locScore + commitScore + prScore) / 3);
    setImpactScore(total);
    console.log(total);
  }

  async function fetchUserData() {
    const res = await fetch(`http://localhost:3000/api/user/fetch/${username}`);
    const u = await res.json();
    return {
      username: u.login,
      name: u.name,
      avatar: u.avatar_url,
      bio: u.bio,
      location: u.location,
      company: u.company,
      publicRepos: u.public_repos,
      followers: u.followers,
      following: u.following,
      joinDate: new Date(u.created_at).toLocaleDateString(),
      githubUrl: u.html_url,
    };
  }

  async function fetchRepoData() {
    const res = await fetch(`http://localhost:3000/api/repo/fetch/${username}`);
    const repos = await res.json();
    const totalStars   = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalWatchers = repos.reduce((sum, r) => sum + (r.watchers_count   || 0), 0);
    const forks        = repos.filter((r) => r.fork).length;
    const originals    = repos.length - forks;
    return { totalStars, totalWatchers, totalForks: forks, originalCount: originals };
  }

  async function fetchTotalLOC() {
    const res  = await fetch(`http://localhost:3000/api/contri/fetchloc/${username}`);
    const body = await res.json();
    // body: { totalLoc, deleteLOC, totalCommits, repoStats, activity }
    return {
      loc: body.totalLoc,
      deleteLoc: body.deleteLOC,
      commitCount: body.totalCommits,
      repoStats: body.repoStats,
      monthlyCommitActivity: body.activity,
    };
  }

  async function fetchPullRequestData() {
    const res = await fetch(`http://localhost:3000/api/pr/fetch/${username}`);
    const prs = await res.json();
    return {
      totalPRs: prs.length,
      mergedCount: prs.filter((p) => p.merged).length,
      monthlyPRActivity: generateMonthlyPRActivity(prs),
    };
  }

  function generateRadarData({ commits, totalPRs, stars, forkedRepo, issues = 0 }) {
  return [
    { subject: "Commits", A: Math.min(100, commits), fullMark: 100 },
    { subject: "PRs", A: Math.min(100, totalPRs * 2), fullMark: 100 },
    { subject: "Issues", A: Math.min(100, issues * 5), fullMark: 100 },
    { subject: "Stars", A: Math.min(100, stars), fullMark: 100 },
    { subject: "Forks", A: Math.min(100, forkedRepo*2), fullMark: 100 },
  ];
}

  const getImpactScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-purple-600';
    if (score >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getImpactScoreDescription = (score) => {
    if (score >= 80) return 'Exceptional Impact';
    if (score >= 60) return 'Strong Impact';
    if (score >= 40) return 'Moderate Impact';
    return 'Growing Impact';
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const user = await fetchUserData();
        setUserData(user);
        markStepDone(0);

        const { totalStars, totalWatchers, totalForks, originalCount } =
          await fetchRepoData();
        setStars(totalStars);
        setWatchers(totalWatchers);
        setForkedRepo(totalForks);
        setOriginalRepos(originalCount);
        markStepDone(1);

        const {
          loc,
          deleteLoc: del,
          commitCount,
          repoStats,
          monthlyCommitActivity,
        } = await fetchTotalLOC();
        setTotalLoc(loc);
        setDeletedLoc(del);
        setCommits(commitCount);
        setCommitActivity(monthlyCommitActivity);

        setTopOriginalRepos(
          repoStats.filter((r) => !r.fork).sort((a, b) => b.loc - a.loc).slice(0, 3)
        );
        setTopForkedRepos(
          repoStats.filter((r) => r.fork).sort((a, b) => b.loc - a.loc).slice(0, 3)
        );
        setTopLanguages(generateLanguageData(repoStats));
        markStepDone(2);

        const { totalPRs: prCount, mergedCount, monthlyPRActivity } =
          await fetchPullRequestData();
        setTotalPRs(prCount);
        setPrsMerged(mergedCount);
        setPrActivity(monthlyPRActivity);
        markStepDone(3);

        setActivityData(generateActivityData(monthlyPRActivity, monthlyCommitActivity));

        calculateImpactScore(loc,commits,prCount);
        markStepDone(4);

        const radar = generateRadarData({
        commits: commitCount,
        totalPRs: prCount,
        stars: totalStars,
        forkedRepo: totalForks,
        issues: 0, 
      });
      setRadarData(radar);

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 }
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name}${interval !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

  function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
  }


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
        {/* Enhanced Spinner */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-t-transparent border-r-transparent border-b-blue-300 border-l-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>

        {/* Title with animation */}
        <h2 className="text-3xl font-bold mb-6 tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
          Analyzing Your GitHub Profile...
        </h2>

        {/* Enhanced Steps */}
        <div className="w-full max-w-lg bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
          <ul className="space-y-4">
            {loadingSteps.map((step, index) => (
              <li key={index} className="flex items-center gap-3 text-lg group">
                <span className="text-2xl transition-all duration-300">
                  {step.done ? "✅" : "⏳"}
                </span>
                <span className={`transition-all duration-300 ${
                  step.done 
                    ? "text-green-400 font-medium" 
                    : "text-gray-300"
                }`}>
                  {step.label}
                </span>
                {step.done && (
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            GitHub Contribution Analyzer
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Comprehensive analysis of developer impact and contributions
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Enhanced User Info Card */}
          <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative mb-6">
                <img
                  src={userData.avatar}
                  alt="User avatar"
                  className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              
              <div className="text-center md:text-left mb-4">
                <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
                <div className="flex items-center justify-center md:justify-start text-gray-400 mb-2">
                  <Github size={16} className="mr-1" />
                  <span>{userData.username}</span>
                </div>
                <p className="text-gray-300 text-sm">{userData.bio}</p>
              </div>

              <div className="flex flex-col space-y-2 mb-6 text-gray-300 text-sm w-full">
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin size={14} className="mr-2 text-gray-400" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Briefcase size={14} className="mr-2 text-gray-400" />
                  <span>{userData.company}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Calendar size={14} className="mr-2 text-gray-400" />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 w-full">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">
                    {userData.publicRepos}
                  </div>
                  <div className="text-xs text-blue-100">Repositories</div>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">
                    {userData.followers}
                  </div>
                  <div className="text-xs text-green-100">Followers</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-3 text-center col-span-2">
                  <div className="text-xl font-bold text-white">
                    {userData.following}
                  </div>
                  <div className="text-xs text-purple-100">Following</div>
                </div>
              </div>

              <a
                href={userData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full"
              >
                <Github size={16} className="mr-2" />
                View GitHub Profile
              </a>
            </div>
          </div>

          {/* Enhanced Repository Overview */}
          <div className="lg:col-span-5 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center">
              <Database size={20} className="mr-2" />
              Repository Overview
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold">{userData.publicRepos}</div>
                <div className="text-blue-100 text-sm">Total Repositories</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold">{stars.toLocaleString()}</div>
                <div className="text-yellow-100 text-sm">Total Stars</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-white transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold">{forkedRepo}</div>
                <div className="text-purple-100 text-sm">Total Forks</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-white transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold">{originalRepos}</div>
                <div className="text-green-100 text-sm">Original Repos</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
                <div className="text-xl font-bold text-orange-400">
                  {forkedRepo}
                </div>
                <div className="text-xs text-gray-400">Forked Repos</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
                <div className="text-xl font-bold text-pink-400">
                  {watchers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Watchers</div>
              </div>
            </div>
          </div>

          {/* Enhanced Impact Summary with Tooltip */}
          <div className="lg:col-span-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-400 flex items-center">
                <Zap size={20} className="mr-2" />
                Impact Score
                <div className="relative ml-2">
  <button
    onMouseEnter={() => setShowImpactTooltip(true)}
    onMouseLeave={() => setShowImpactTooltip(false)}
    className="text-gray-400 hover:text-blue-400 transition-colors"
  >
    <Info size={16} />
  </button>
  {showImpactTooltip && (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl border border-gray-600 z-10">
      <div className="font-semibold mb-1">Impact Score Calculation:</div>
      <div className="text-gray-300">
        • Stars & Forks (30%)<br/>
        • Code Contributions (25%)<br/>
        • PR Success Rate (20%)<br/>
        • Community Engagement (15%)<br/>
        • Consistency (10%)
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  )}
</div>
              </h2>
              <div className="text-center">
                <div className={`bg-gradient-to-br ${getImpactScoreColor(impactScore)} text-white text-2xl md:text-3xl font-bold w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                  {impactScore}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {getImpactScoreDescription(impactScore)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600">
                <div className="flex items-center text-gray-300 mb-1">
                  <Code size={14} className="mr-2 text-green-400" />
                  <span className="text-sm">LOC Added</span>
                </div>
                <div className="text-lg font-bold text-green-400">
                  {totalLoc.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600">
                <div className="flex items-center text-gray-300 mb-1">
                  <Code size={14} className="mr-2 text-red-400" />
                  <span className="text-sm">LOC Removed</span>
                </div>
                <div className="text-lg font-bold text-red-400">
                  {deletedLoc.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600">
                <div className="flex items-center text-gray-300 mb-1">
                  <Github size={14} className="mr-2 text-blue-400" />
                  <span className="text-sm">Commits</span>
                </div>
                <div className="text-lg font-bold text-blue-400">{commits.toLocaleString()}</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600">
                <div className="flex items-center text-gray-300 mb-1">
                  <GitPullRequest size={14} className="mr-2 text-purple-400" />
                  <span className="text-sm">PRs Merged</span>
                </div>
                <div className="text-lg font-bold text-purple-400">
                  {Math.round((prsMerged/totalPRs)*100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Top Languages */}
          <div className="lg:col-span-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center">
              <Code size={20} className="mr-2" />
              Top Languages
            </h2>

            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topLanguages.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 768 ? 60 : 80}
                      dataKey="value"
                      label={false}
                    >
                      {topLanguages.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#4B5563",
                        color: "#F9FAFB",
                        borderRadius: "12px"
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full lg:w-1/2 space-y-3 mt-4 lg:mt-0">
                {topLanguages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm"
                        style={{ backgroundColor: lang.color }}
                      ></div>
                      <span className="text-white font-medium text-sm">
                        {lang.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">{lang.value}%</div>
                      <div className="text-gray-400 text-xs">
                        {lang.loc.toLocaleString()} LOC
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Contribution Balance Radar */}
          <div className="lg:col-span-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center">
              <Activity size={20} className="mr-2" />
              Developer Profile
            </h2>

            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={window.innerWidth < 768 ? 60 : 90} data={radarData}>
                  <PolarGrid stroke="#4B5563" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    stroke="#4B5563"
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    domain={[0, 100]}
                  />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#4B5563",
                      color: "#F9FAFB",
                      borderRadius: "12px"
                    }}
                    formatter={(value) => [`${value}/100`, 'Score']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Activity Timeline */}
          <div className="lg:col-span-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center">
              <TrendingUp size={20} className="mr-2" />
              Activity Timeline (Last 6 Months)
            </h2>

            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="month" tick={{ fill: "#9CA3AF" }} />
                  <YAxis tick={{ fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#4B5563",
                      color: "#F9FAFB",
                      borderRadius: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Commits"
                  />
                  <Area
                    type="monotone"
                    dataKey="prs"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                    name="Pull Requests"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Top Personal Repositories */}
          <div className="lg:col-span-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-400 flex items-center mb-4 md:mb-0">
                <BookOpen size={20} className="mr-2" />
                Top Personal Repositories
              </h2>
            </div>

            <div className="space-y-4">
              {topOriginalRepos.map((repo, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                        {repo.name}
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                        </a>
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {repo.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-4">
                      <div className="flex items-center text-sm">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        <span className="text-gray-300 font-medium">{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <GitFork size={14} className="text-gray-400 mr-1" />
                        <span className="text-gray-300">{repo.forks}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs mb-2 md:mb-0">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full shadow-sm">
                        {repo.language}
                      </span>
                      <span className="text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {timeAgo(repo.pushedAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-green-400 font-medium">{repo.loc.toLocaleString()} LOC</span>
                      <span className="text-purple-400 font-medium">
                        {repo.commitCount} commits
                      </span>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center"
                      >
                        <Github size={12} className="mr-1" />
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Top Forked Repositories */}
          <div className="lg:col-span-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center">
              <GitFork size={20} className="mr-2" />
              Top Forked Repositories
            </h2>

            <div className="space-y-4">
              {topForkedRepos.map((repo, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                        {repo.name}
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-gray-400 hover:text-purple-400 transition-colors"
                        >
                        </a>
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        forked from {repo.originalOwner}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {repo.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-4">
                      <div className="flex items-center text-sm">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        <span className="text-gray-300 font-medium">{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <GitFork size={14} className="text-gray-400 mr-1" />
                        <span className="text-gray-300">{repo.forks}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs mb-2 md:mb-0">
                      <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full shadow-sm">
                        {repo.language}
                      </span>
                      <span className="text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {timeAgo(repo.pushedAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-orange-400 font-medium">{repo.loc.toLocaleString()} LOC</span>
                      <span className="text-blue-400 font-medium">
                        {repo.commitCount} commits
                      </span>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center"
                      >
                        <Github size={12} className="mr-1" />
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>GitHub Contribution Analyzer &copy; 2025</p>
        </footer>
      </div>
    </div>
  );
}