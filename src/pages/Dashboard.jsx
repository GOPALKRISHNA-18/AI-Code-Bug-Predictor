import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {FiActivity,FiAlertTriangle,FiBarChart2,FiCode,FiFileText,FiShield, FiPlus,FiRefreshCw,FiTrendingUp,FiEye,} from "react-icons/fi";
import {LineChart, Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,PieChart,Pie,Cell,BarChart,Bar,} from "recharts";
import {getDashboardStats,getDashboardTrend,getBugAnalytics,} from "../services/analysisService";
import "./Dashboard.css";
const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [bugAnalytics, setBugAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");
  const loadDashboardData = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
       }
        setError("");
        const [
          statsResponse,
          trendResponse,
        ] = await Promise.all([
          getDashboardStats(),
          getDashboardTrend(),
        ]);
        setStats(
          statsResponse || null
        );
        const formattedTrend = Array.isArray(trendResponse)
            ? [...trendResponse].reverse()
            : [];
        setTrendData(formattedTrend);
      } catch (err) {
        console.error("Dashboard loading error:",err);
        const backendMessage = err?.response?.data?.message || err?.response?.data;
        setError( typeof backendMessage === "string"
            ? backendMessage
            : "Unable to load dashboard data. Please make sure the Spring Boot backend is running."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );
  const loadBugAnalytics = useCallback(
    async () => {
      try {
        setAnalyticsLoading(true);
        setAnalyticsError("");
        const response = await getBugAnalytics();
        setBugAnalytics( response || null);
      } catch (err) {
        console.error("Bug analytics loading error:", err);
        const backendMessage = err?.response?.data?.message || err?.response?.data;
        setAnalyticsError(typeof backendMessage === "string"
            ? backendMessage
            : "Unable to load bug analytics."
        );
      } finally {
        setAnalyticsLoading(false);
      }
    },
    []
  );
  useEffect(() => {
    loadDashboardData();
    loadBugAnalytics();
  }, [
    loadDashboardData,
    loadBugAnalytics,
  ]);
  const handleRefresh = async () => {
    await Promise.all([
      loadDashboardData(true),
      loadBugAnalytics(),
    ]);
  };
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }
    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };
  const dashboardStats = useMemo(() => {
    if (!stats) {
      return {
        totalAnalyses: 0,
        totalBugs: 0,
        averageRisk: 0,
        averageQuality: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
        recentAnalyses: [],
      };
    }
    return {
      totalAnalyses:
        Number(
          stats.totalAnalyses ??
          stats.total ??
          0
        ),
      totalBugs:
        Number(
          stats.bugsDetected ??
          stats.totalBugs ??
          stats.bugs ??
          0
        ),
      averageRisk:
        Number(
          stats.averageRisk ??
          stats.avgRisk ??
          0
        ),
      averageQuality:
        Number(
          stats.averageCodeQuality ??
          stats.averageQuality ??
          stats.avgQuality ??
          0
        ),
      highRisk:
        Number(
          stats.highRiskAnalyses ??
          stats.highRiskCount ??
          stats.highRisk ??
          0
        ),
      mediumRisk:
        Number(
          stats.mediumRiskAnalyses ??
          stats.mediumRiskCount ??
          stats.mediumRisk ??
          0
        ),
      lowRisk:
        Number(
          stats.lowRiskAnalyses ??
          stats.lowRiskCount ??
          stats.lowRisk ??
          0
        ),
      recentAnalyses:
        Array.isArray(
          stats.recentAnalyses
        )
          ? stats.recentAnalyses
          : [],
    };
  }, [stats]);
  const chartData = useMemo(() => {
    return trendData.map(
      (item, index) => {
        const projectName =
          item.projectName ||
          item.name ||
          `Analysis ${index + 1}`;
        return {
        ...item,
          name:
            projectName.length > 14
              ? `${projectName.substring(
                  0,
                  14
                )}...`
              : projectName,
          riskScore:
            Number(
              item.riskScore ??
              item.averageRisk ??
              item.avgRisk ??
              0
            ),
          codeQualityScore:
            Number(
              item.codeQualityScore ??
              item.averageQuality ??
              item.avgQuality ??
              0
            ),
       };

      }
    );
  }, [trendData]);
  const severityData = useMemo(() => {
    if (!bugAnalytics) {
      return [];
    }
    return [
      {
        name: "High",
        value:
          Number(
            bugAnalytics.highSeverityBugs
          ) || 0,
      },
      {
        name: "Medium",
        value:
          Number(
            bugAnalytics.mediumSeverityBugs
          ) || 0,
      },
      {
        name: "Low",
        value:
          Number(
            bugAnalytics.lowSeverityBugs
          ) || 0,
      },
    ];
  }, [bugAnalytics]);
  const bugTypeData = useMemo(() => {
    if (!bugAnalytics ||!Array.isArray(bugAnalytics.bugTypes)) {
      return [];
    }
    return bugAnalytics.bugTypes.map(
      (item) => ({
        name:
          item.bugType ||
          item.type ||
          item.name ||
          "Other",
        count:
          Number(
            item.count ??
            item.value ??
            0
          ),
      })
    );
  }, [bugAnalytics]);
  const totalBugs = Number(bugAnalytics?.totalBugs ?? dashboardStats.totalBugs) || 0;
  const riskDistribution = useMemo(() => {
    return [
      {
        name: "High",
        value: dashboardStats.highRisk,
      },
      {
        name: "Medium",
        value: dashboardStats.mediumRisk,
      },
      {
        name: "Low",
        value: dashboardStats.lowRisk,
      },
    ];
  }, [dashboardStats]);
  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (
      !active ||
      !payload ||
      !payload.length
    ) {
      return null;
    }
    return (
      <div className="dashboard-chart-tooltip">
       {label && (
          <p className="tooltip-title">
            {label}
          </p>
        )}
        {payload.map(
          (item, index) => (
            <p
              key={`${item.dataKey}-${index}`}
              className="tooltip-row"
            >
              <span>
                {item.name}
              </span>
              <strong>
                {item.value}
              </strong>
           </p>
          )
        )}
      </div>
    );
  };
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loader">
          <FiRefreshCw />
        </div>
        <h2>
          Loading Dashboard
        </h2>
        <p>
          Preparing your code analytics...
        </p>
      </div>
    );
  }
  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-page-title">
            <span>
              AI CODE BUG PREDICTOR
            </span>
            <h1>
              Dashboard
            </h1>
            <p>
              Monitor your code quality,
              bugs and analysis trends.
           </p>
          </div>
          <div className="dashboard-header-actions">
            <button
              className="dashboard-refresh-button"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "refresh-spinning"
                    : ""
                }
              />
              <span>
                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </span>
            </button>
            <button
              className="dashboard-analyze-button"
              onClick={() =>
                navigate("/analyze")
              }
            >
              <FiPlus />
              <span>
                Analyze Code
              </span>
            </button>
          </div>
        </header>
        {error && (
          <div className="dashboard-error">
            <FiAlertTriangle />
            <div>
              <strong>
                Dashboard Error
              </strong>
              <span>
                {error}
              </span>
            </div>
            <button
              onClick={() =>
                loadDashboardData()
              }
            >
              Retry
            </button>
          </div>
        )}
        <section className="dashboard-welcome compact-section">
          <div>
            <span className="dashboard-welcome-label">
              AI CODE ANALYSIS
            </span>
            <h2>
              Monitor your code quality
              and bug risk
            </h2>
            <p>
              Analyze your source code,
              identify potential bugs,
              and track your code quality
              over time.
            </p>
          </div>
         <div className="dashboard-welcome-icon">
            <FiActivity />
          </div>
        </section>
        <section className="dashboard-stat-grid compact-section">
          <div className="dashboard-stat-card">
            <div className="stat-card-icon">
              <FiFileText />
            </div>
            <div className="stat-card-content">
              <span>
                Total Analyses
              </span>
              <strong>
                {dashboardStats.totalAnalyses}
              </strong>
             <small>
                Code analyses completed
              </small>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-card-icon danger">
              <FiAlertTriangle />
            </div>
            <div className="stat-card-content">
              <span>
                Bugs Detected
              </span>
              <strong>
                {dashboardStats.totalBugs}
              </strong>
              <small>
                Potential issues found
              </small>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-card-icon warning">
              <FiActivity />
            </div>
            <div className="stat-card-content">
              <span>
                Average Risk
              </span>
              <strong>
                {dashboardStats.averageRisk}%
              </strong>
              <small>
                Overall risk score
              </small>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-card-icon success">
              <FiShield />
            </div>
            <div className="stat-card-content">
             <span>
                Code Quality
              </span>
             <strong>
                {dashboardStats.averageQuality}%
              </strong>
              <small>
                Average quality score
              </small>
            </div>
          </div>
        </section>
        <section className="dashboard-section compact-section">
          <div className="dashboard-section-heading">
            <div>
              <span>
                RISK OVERVIEW
              </span>
              <h2>
                Analysis Risk Levels
              </h2>
            </div>
            <FiShield />
          </div>
          <div className="dashboard-risk-grid">
            <div className="dashboard-risk-card high">
             <div className="risk-card-icon">
               <FiAlertTriangle />
              </div>
              <div>
                <span>
                  High Risk
                </span>
                <strong>
                  {dashboardStats.highRisk}
                </strong>
                <small>
                  Analyses
                </small>
              </div>
            </div>
            <div className="dashboard-risk-card medium">
              <div className="risk-card-icon">
                <FiActivity />
              </div>
              <div>
                <span>
                  Medium Risk
                </span>
                <strong>
                  {dashboardStats.mediumRisk}
                </strong>
                <small>
                  Analyses
                </small>
              </div>
            </div>
            <div className="dashboard-risk-card low">
             <div className="risk-card-icon">
                <FiShield />
              </div>
              <div>
                <span>
                  Low Risk
                </span>
                <strong>
                  {dashboardStats.lowRisk}
                </strong>
                <small>
                  Analyses
                </small>
              </div>
            </div>
          </div>
         <div className="dashboard-risk-chart-card">
            {riskDistribution.some(
              (item) =>
                item.value > 0
            ) ? (
              <ResponsiveContainer
                width="100%"
                height={260}
              >
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={4}
                  >
                    <Cell
                      fill="var(--risk-high)"
                    />
                    <Cell
                      fill="var(--risk-medium)"
                    />
                    <Cell
                      fill="var(--risk-low)"
                    />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="dashboard-empty-chart small">
                <FiShield />
                <p>
                  No risk distribution
                  available yet.
                </p>
              </div>
            )}
          </div>
        </section>
       <section className="dashboard-section compact-section">
          <div className="dashboard-section-heading">
            <div>
              <span>
                PERFORMANCE TREND
              </span>
              <h2>
                Risk & Code Quality
              </h2>
            </div>
            <FiBarChart2 />
          </div>
          <div className="dashboard-chart-card">
            {chartData.length === 0 ? (
              <div className="dashboard-empty-chart">
                <FiBarChart2 />
                <h3>
                  No trend data available
                </h3>
                <p>
                  Analyze some code to see
                  your risk and quality trend.
                </p>
                <button
                  onClick={() =>
                    navigate("/analyze")
                  }
                >
                  Analyze Code
                </button>
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 15,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--chart-axis)"
                    tick={{
                      fill:
                        "var(--chart-text)",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="var(--chart-axis)"
                    tick={{
                      fill:
                        "var(--chart-text)",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="riskScore"
                    name="Risk Score"
                    stroke="var(--chart-risk)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="codeQualityScore"
                    name="Code Quality"
                    stroke="var(--chart-quality)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
        <section className="dashboard-section compact-section">
          <div className="dashboard-section-heading">
            <div>
              <span>
                BUG ANALYTICS
              </span>
              <h2>
                Bug Severity & Types
              </h2>
            </div>
            <FiAlertTriangle />
          </div>
          {analyticsError && (
            <div className="dashboard-error analytics-error">
              <FiAlertTriangle />
              <div>
                <strong>
                  Bug Analytics Error
                </strong>
                <span>
                  {analyticsError}
                </span>
              </div>
              <button
                onClick={
                  loadBugAnalytics
                }
              >
                Retry
              </button>
            </div>
          )}
          {analyticsLoading ? (
            <div className="dashboard-analytics-loading">
              <div className="dashboard-loader">
                <FiRefreshCw />
              </div>
              <p>
                Loading bug analytics...
              </p>
            </div>
          ) : (
            <>
                <div className="bug-severity-summary">
                <div className="bug-severity-card total">
                  <div className="bug-severity-icon">
                    <FiBarChart2 />
                  </div>
                  <div>
                    <span>
                      Total Bugs
                    </span>
                    <strong>
                      {totalBugs}
                    </strong>
                  </div>
                </div>
                <div className="bug-severity-card high">
                  <div className="bug-severity-icon">
                    <FiAlertTriangle />
                  </div>
                  <div>
                    <span>
                      High Severity
                    </span>
                    <strong>
                      {Number(
                        bugAnalytics?.highSeverityBugs
                      ) || 0}
                    </strong>
                  </div>
                </div>
                <div className="bug-severity-card medium">
                  <div className="bug-severity-icon">
                    <FiActivity />
                  </div>
                  <div>
                    <span>
                      Medium Severity
                    </span>
                    <strong>
                      {Number(bugAnalytics?.mediumSeverityBugs) || 0}
                    </strong>
                  </div>
                </div>
                <div className="bug-severity-card low">
                 <div className="bug-severity-icon">
                    <FiShield />
                  </div>
                  <div>
                    <span>
                      Low Severity
                    </span>
                    <strong>
                      {Number(bugAnalytics?.lowSeverityBugs) || 0}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="bug-analytics-grid">
                <div className="bug-analytics-card">
                  <div className="analytics-card-header">
                    <div>
                      <span>
                        SEVERITY
                      </span>
                      <h3>
                        Bug Severity Distribution
                      </h3>
                    </div>
                    <FiAlertTriangle />
                  </div>
                  {severityData.some(
                    (item) =>
                      item.value > 0
                  ) ? (
                    <div className="bug-pie-wrapper">
                      <ResponsiveContainer
                        width="100%"
                        height={280}
                      >
                        <PieChart>
                          <Pie
                            data={severityData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={95}
                            innerRadius={55}
                            paddingAngle={4}
                          >
                            <Cell
                              fill="var(--bug-high)"
                            />
                            <Cell
                              fill="var(--bug-medium)"
                            />
                            <Cell
                              fill="var(--bug-low)"
                            />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="bug-pie-center">
                        <strong>
                          {totalBugs}
                        </strong>
                        <span>
                          Bugs
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="dashboard-empty-chart small">
                      <FiShield />
                      <p>
                        No bug severity
                        data available yet.
                      </p>
                    </div>
                  )}
                </div>
                <div className="bug-analytics-card">
                  <div className="analytics-card-header">
                    <div>
                      <span>
                        BUG TYPES
                      </span>
                      <h3>
                        Detected Bug Types
                      </h3>
                    </div>
                    <FiBarChart2 />
                  </div>
                 {bugTypeData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height={280}
                    >
                      <BarChart
                        data={bugTypeData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: -15,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--chart-grid)"
                        />
                       <XAxis
                          dataKey="name"
                          stroke="var(--chart-axis)"
                          tick={{
                            fill:
                              "var(--chart-text)",
                            fontSize: 11,
                          }}
                        />
                        <YAxis
                          allowDecimals={false}
                          stroke="var(--chart-axis)"
                          tick={{
                            fill:
                              "var(--chart-text)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />
                        <Bar
                          dataKey="count"
                          name="Bugs"
                          fill="var(--chart-bar)"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="dashboard-empty-chart small">
                      <FiCode />
                      <p>
                        No bug type data
                        available yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
        <section className="dashboard-section compact-section">
          <div className="dashboard-section-heading">
            <div>
              <span>
                ACTIVITY
              </span>
              <h2>
                Recent Analyses
              </h2>
            </div>
            <button
              className="view-history-button"
              onClick={() =>
                navigate("/history")
              }
            >
              View History
            </button>
          </div>
          <div className="recent-analysis-list">
            {dashboardStats.recentAnalyses.length > 0 ? (
              dashboardStats.recentAnalyses.map(
                (analysis, index) => {
                  const analysisId =
                    analysis.id ??
                    analysis.analysisId;
                  return (
                    <div
                      className="recent-analysis-card"
                      key={
                        analysisId ??
                        `${analysis.projectName}-${index}`
                      }
                    >
                      <div className="recent-analysis-icon">
                        <FiCode />
                      </div>
                      <div className="recent-analysis-info">
                        <h3>
                          {analysis.projectName ||
                            "Untitled Project"}
                        </h3>
                        <div className="recent-analysis-meta">
                          <span>
                            {analysis.language ||
                              "Unknown"}
                          </span>
                          <span>
                            •
                         </span>
                          <span>
                            {analysis.fileName ||
                              "No file"}
                          </span>
                          <span>
                            •
                          </span>
                          <span>
                            {formatDate(
                              analysis.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="recent-analysis-stats">
                        <div>
                          <span>
                            Risk
                          </span>
                          <strong>
                            {analysis.riskScore ?? 0}
                          </strong>
                        </div>
                        <div>
                          <span>
                            Bugs
                          </span>
                          <strong>
                            {analysis.totalBugs ?? 0}
                         </strong>
                        </div>
                        <div>
                          <span>
                            Quality
                          </span>
                          <strong>
                            {analysis.codeQualityScore ?? 0}
                          </strong>
                        </div>
                      </div>
                      <button
                        className="recent-analysis-view"
                        onClick={() => {
                          if (analysisId) {
                            navigate(
                              `/analysis-result?id=${analysisId}`
                            );
                          } else {
                            navigate(
                              "/history"
                            );
                          }
                        }}
                      >
                        <FiEye />
                        <span>
                          View
                        </span>
                      </button>
                    </div>
                  );
                }
             )

            ) : (
              <div className="dashboard-empty-state">
                <FiFileText />
                <h3>
                  No analyses yet
                </h3>
                <p>
                  Start by analyzing your
                  first piece of source code.
                </p>
                <button
                  onClick={() =>
                    navigate("/analyze")
                  }
                >
                  Analyze Code
                </button>
              </div>
            )}
          </div>
        </section>
        <section className="dashboard-cta">
          <div className="dashboard-cta-icon">
            <FiCode />
          </div>
          <div>
            <h2>
              Find potential bugs before
              they reach production
            </h2>
            <p>
              Analyze your source code,
              understand risk areas and
              improve code quality.
            </p>
          </div>
          <button
            onClick={() =>
              navigate("/analyze")
            }
          >
            Analyze Code
            <FiPlus />
          </button>
        </section>
      </main>
    </div>
  );
};
export default Dashboard;