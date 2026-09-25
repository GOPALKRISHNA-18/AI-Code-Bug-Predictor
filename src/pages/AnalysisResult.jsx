import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiAlertCircle,FiArrowLeft,FiBarChart2,FiCheckCircle,FiCode,FiDownload,FiFileText,FiInfo,FiLayers,FiList,FiRefreshCw,FiShield,FiTarget,FiTrendingUp,FiXCircle,FiZap,} from "react-icons/fi";
import { getAnalysisById } from "../services/analysisService";
import Navbar from "../components/Navbar";
import "./AnalysisResult.css";
const AnalysisResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [analysis, setAnalysis] = useState(
    location.state?.analysis || null
  );
  const [loading, setLoading] = useState(
    !location.state?.analysis
  );
  const [error, setError] = useState("");
  useEffect(() => {
    const analysisId = searchParams.get("id");
    if (
      location.state?.analysis
    ) {
      setAnalysis(location.state.analysis);
      setLoading(false);
      return;
    }
    if (!analysisId) {
      setLoading(false);
      setError("No analysis result was selected.");
      return;
    }
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAnalysisById(analysisId);
        setAnalysis(response);
      } catch (err) {
        console.error("Failed to load analysis:",err);
        setError("Unable to load the analysis result.");
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [
    location.state,
    searchParams,
  ]);
  const bugs = useMemo(() => {
    if (!analysis) {
      return [];
   }
    return (
      analysis.bugs || analysis.bugPredictions || []);
  }, [analysis]);

  const severityCounts = useMemo(() => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
    };
    bugs.forEach((bug) => {
      const severity = String( bug.severity || "").toLowerCase();
      if (
        severity === "high"
      ) {
        counts.high++;
      } else if (
        severity === "medium"
      ) {
        counts.medium++;
      } else {
        counts.low++;
      }
    });
    return counts;
  }, [bugs]);
  const getSeverityIcon = (severity) => {
    const value = String( severity || "").toLowerCase();
    if (
      value === "high"
    ) {
      return (
        <FiXCircle />
      );
    }
    if (
      value === "medium"
    ) {
      return (
        <FiAlertCircle />
      );
    }
    return (
      <FiInfo />
    );
  };
 const getSeverityClass = (severity) => {
    const value = String(severity || "").toLowerCase();
    if (
      value === "high"
    ) {
      return "severity-high";
    }
    if (
      value === "medium"
    ) {
      return "severity-medium";
    }
    return "severity-low";
  };
  const getComplexityClass = (level ) => {
    const value = String(level || "").toLowerCase();
    if (
      value === "very high"
    ) {
      return "complexity-very-high";
    }
    if (
      value === "high"
    ) {
      return "complexity-high";
    }
    if (
      value === "moderate"
    ) {
      return "complexity-moderate";
    }
    if (
      value === "low"
    ) {
      return "complexity-low";
    }
    return "complexity-unknown";
  };
  const getComplexityIcon = ( level) => {
    const value = String(level || "").toLowerCase();
   if (
      value === "very high"
          || value === "high"
    ) {
      return (
        <FiAlertCircle />
      );
    }
    if (
      value === "moderate"
    ) {
      return (
        <FiZap />
      );
    }
    if (
      value === "low"
    ) {
      return (
        <FiCheckCircle />
      );
    }
    return (
      <FiBarChart2 />
    );
  };
  const downloadReport = () => {
    if (!analysis) {
      return;
    }
    const report = `
AI CODE BUG PREDICTOR
ANALYSIS REPORT
========================================
Project Name:
${analysis.projectName || "N/A"}
Language:
${analysis.language || "N/A"}
File:
${analysis.fileName || "N/A"}
Risk Score:
${analysis.riskScore ?? 0}/100
Overall Risk:
${analysis.overallRisk || "N/A"}
Code Quality Score:
${analysis.codeQualityScore ?? 0}/100
CODE COMPLEXITY
========================================
Total Lines:
${analysis.totalLines ?? 0}
Code Lines:
${analysis.codeLines ?? 0}
Comment Lines:
${analysis.commentLines ?? 0}
Blank Lines:
${analysis.blankLines ?? 0}
Functions / Methods:
${analysis.functionCount ?? 0}
Classes:
${analysis.classCount ?? 0}
Decision Points:
${analysis.decisionPoints ?? 0}
Cyclomatic Complexity:
${analysis.cyclomaticComplexity ?? 0}
Complexity Level:
${analysis.complexityLevel || "UNKNOWN"}
BUG SUMMARY
========================================
Total Bugs:
${analysis.totalBugs ?? bugs.length}
High Severity:
${severityCounts.high}
Medium Severity:
${severityCounts.medium}
Low Severity:
${severityCounts.low}
DETECTED ISSUES
========================================
${bugs
  .map(
    (bug, index) => `
${index + 1}. ${bug.title || "Issue"}
Line:
${bug.lineNumber || "N/A"}
Type:
${bug.bugType || "N/A"}
Severity:
${bug.severity || "N/A"}
Confidence:
${bug.confidence ?? 0}%
Description:
${bug.description || "N/A"}
Suggestion:
${bug.suggestion || "N/A"}
----------------------------------------
`
  )
  .join("")}
`;
    const blob = new Blob([report],
        {
          type:
            "text/plain;charset=utf-8",
        }
      );
    const url = URL.createObjectURL( blob );
    const link = document.createElement( "a");
    link.href = url;
    link.download =`${analysis.projectName || "analysis"}-report.txt`;
    document.body.appendChild(
      link
    );
    link.click();
    document.body.removeChild(
      link
    );
    URL.revokeObjectURL(
      url
    );
  };
  if (loading) {
    return (
     <>
        <Navbar />
        <main className="analysis-result-page">
          <div className="analysis-loading">
            <div className="analysis-loading-icon">
              <FiRefreshCw />
            </div>
            <h2>
              Loading Analysis...
            </h2>
            <p>
              Please wait while we
              retrieve the analysis
              result.
            </p>
          </div>
        </main>
      </>
    );
  }
  if (error || !analysis) {
    return (
      <>
        <Navbar />
        <main className="analysis-result-page">
          <div className="analysis-error">
            <div className="analysis-error-icon">
              <FiAlertCircle />
            </div>
            <h2>
              Analysis Not Found
            </h2>
            <p>
              {error ||"The requested analysis could not be found."}
            </p>
            <button
              className="analysis-primary-button"
              onClick={() =>
                navigate(
                  "/analyze"
                )
              }
            >
              <FiCode />
              Analyze New Code
            </button>
          </div>
        </main>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <main className="analysis-result-page">
        <div className="analysis-result-container">
          <section className="analysis-result-header">
            <div className="analysis-header-left">
              <button
                className="analysis-back-button"
                onClick={() =>
                  navigate(
                    "/analyze"
                  )
                }
              >
                <FiArrowLeft />
                Back to Analyzer
              </button>
              <div className="analysis-title-row">
                <div className="analysis-title-icon">
                  <FiFileText />
                </div>
                <div>
                  <h1>
                    Analysis Result
                  </h1>
                  <p>
                    Detailed code quality,
                    complexity and bug
                    prediction report.
                  </p>
                </div>
              </div>
            </div>
            <div className="analysis-header-actions">
              <button
               className="analysis-secondary-button"
                onClick={() =>
                  navigate(
                    "/history"
                  )
                }
              >
                <FiList />
                History
              </button>
              <button
                className="analysis-primary-button"
                onClick={
                  downloadReport
                }
              >
                <FiDownload />
                Download Report
              </button>
            </div>
          </section>
          <section className="analysis-project-card">
            <div className="analysis-project-main">
              <div className="analysis-project-icon">
                <FiCode />
              </div>
              <div>
                <span className="analysis-label">
                  Project
                </span>
                <h2>
                  {analysis.projectName || "Unnamed Project"}
                </h2>
                <p>
                  {analysis.fileName || "Source file"}
                </p>
              </div>
            </div>
            <div className="analysis-project-meta">
              <div className="analysis-meta-item">
                <span>
                  Language
                </span>
                <strong>
                  {analysis.language || "Unknown"}
                </strong>
              </div>
              <div className="analysis-meta-item">
                <span>
                  Analysis ID
                </span>
                <strong>
                  #
                  {analysis.analysisId ||
                    analysis.id ||
                    "N/A"}
                </strong>
              </div>
            </div>
          </section>
          <section className="analysis-summary-grid">
            <div className="analysis-summary-card">
              <div className="summary-card-icon risk-icon">
                <FiShield />
              </div>
              <div>
                <span>
                  Risk Score
                </span>
                <strong>
                  {analysis.riskScore ?? 0}
                  <small>
                    /100
                  </small>
                </strong>
               <p>
                  {analysis.overallRisk ||"LOW"} Risk
                </p>
              </div>
            </div>
            <div className="analysis-summary-card">
              <div className="summary-card-icon quality-icon">
                <FiCheckCircle />
              </div>
              <div>
                <span>
                  Code Quality
                </span>
                <strong>
                  {analysis.codeQualityScore ??
                    0}
                  <small>
                    /100
                  </small>
                </strong>
                <p>
                  Quality Score
                </p>
              </div>
            </div>
            <div className="analysis-summary-card">
              <div className="summary-card-icon bugs-icon">
                <FiAlertCircle />
              </div>
              <div>
                <span>
                  Total Bugs
                </span>
                <strong>
                  {analysis.totalBugs ??
                    bugs.length}
                </strong>
                <p>
                  Issues Detected
                </p>
              </div>
            </div>
            <div className="analysis-summary-card">
              <div className="summary-card-icon complexity-icon">
                <FiBarChart2 />
              </div>
              <div>
                <span>
                  Complexity
                </span>
               <strong>
                  {analysis.cyclomaticComplexity ??
                    0}
                </strong>
                <p>
                  {analysis.complexityLevel ||
                    "UNKNOWN"}
                </p>
              </div>
            </div>
          </section>
          <section className="complexity-analysis-section">
            <div className="section-heading">
              <div className="section-heading-icon">
                <FiBarChart2 />
              </div>
              <div>
                <h2>
                  Code Complexity & Quality Analysis
                </h2>
                <p>
                  Structural metrics calculated
                  from the submitted source code.
                </p>
              </div>
            </div>
            <div className="complexity-overview">
              <div className="complexity-main-card">
                <div className="complexity-main-icon">
                  {getComplexityIcon(
                    analysis.complexityLevel
                  )}
                </div>
                <div>
                  <span>
                    Cyclomatic Complexity
                  </span>
                  <strong>
                    {analysis.cyclomaticComplexity ??
                      0}
                  </strong>
                  <div
                    className={`complexity-badge ${getComplexityClass(
                      analysis.complexityLevel
                    )}`}
                  >
                    {analysis.complexityLevel ||
                      "UNKNOWN"}
                  </div>
                </div>
              </div>
              <div className="complexity-quality-card">
                <div className="quality-progress">
                  <div
                    className="quality-progress-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          analysis.codeQualityScore ??
                            0
                        )
                      )}%`,
                    }}
                  />
                </div>
                <div className="quality-progress-info">
                 <span>
                    Code Quality
                  </span>
                  <strong>
                    {analysis.codeQualityScore ??
                      0}
                    %
                  </strong>
                </div>
              </div>
            </div>
           <div className="complexity-metrics-grid">
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiFileText />
                </div>
                <div>
                  <span>
                    Total Lines
                  </span>
                  <strong>
                    {analysis.totalLines ??
                      0}
                  </strong>
                </div>
              </div>
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiCode />
                </div>
                <div>
                  <span>
                    Code Lines
                  </span>
                  <strong>
                    {analysis.codeLines ??
                      0}
                  </strong>
                </div>
              </div>
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiFileText />
                </div>
                <div>
                  <span>
                    Comment Lines
                  </span>
                  <strong>
                    {analysis.commentLines ??
                      0}
                  </strong>
                </div>
              </div>
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiLayers />
                </div>
                <div>
                  <span>
                    Blank Lines
                  </span>
                  <strong>
                    {analysis.blankLines ??
                      0}
                  </strong>
                </div>
              </div>
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiZap />
                </div>
                <div>
                  <span>
                    Functions / Methods
                  </span>
                  <strong>
                    {analysis.functionCount ??
                      0}
                  </strong>
                </div>
              </div>
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiLayers />
                </div>
                <div>
                  <span>
                    Classes
                  </span>
                  <strong>
                    {analysis.classCount ??
                      0}
                  </strong>
                </div>
              </div>
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiGitBranchIcon />
                </div>
                <div>
                  <span>
                    Decision Points
                  </span>
                  <strong>
                    {analysis.decisionPoints ??
                      0}
                  </strong>
                </div>
              </div>
              <div className="complexity-metric-card">
                <div className="metric-icon">
                  <FiTrendingUp />
                </div>
                <div>
                  <span>
                    Complexity Level
                  </span>
                 <strong
                    className={getComplexityClass(
                      analysis.complexityLevel
                    )}
                  >
                    {analysis.complexityLevel ||
                      "UNKNOWN"}
                  </strong>
                </div>
              </div>
            </div>
           <div className="complexity-explanation">
              <FiInfo />
              <div>
                <strong>
                  What does this mean?
                </strong>
                <p>
                  Cyclomatic complexity represents
                  the number of independent decision
                  paths detected in the source code.
                  Higher complexity generally means
                  that the code has more execution
                  paths to review and test.
                </p>
              </div>
            </div>
          </section>
          <section className="bug-summary-section">
            <div className="section-heading">
              <div className="section-heading-icon">
                <FiTarget />
             </div>
              <div>
                <h2>
                  Bug Prediction Summary
                </h2>
                <p>
                  Detected issues grouped by
                  severity.
                </p>
              </div>
            </div>
           <div className="bug-summary-grid">
              <div className="bug-summary-card high">
                <FiXCircle />
                <div>
                  <span>
                    High Severity
                  </span>
                  <strong>
                    {severityCounts.high}
                  </strong>
                </div>
              </div>
              <div className="bug-summary-card medium">
                <FiAlertCircle />
                <div>
                  <span>
                    Medium Severity
                  </span>
                  <strong>
                    {severityCounts.medium}
                  </strong>
                </div>
              </div>
              <div className="bug-summary-card low">
                <FiInfo />
                <div>
                  <span>
                    Low Severity
                  </span>
                  <strong>
                    {severityCounts.low}
                  </strong>
                </div>
              </div>
            </div>
          </section>
         <section className="detected-bugs-section">
            <div className="section-heading">
              <div className="section-heading-icon">
               <FiAlertCircle />
             </div>
              <div>
                <h2>
                  Detected Issues
                </h2>
                <p>
                  Review each predicted issue
                  and its suggested improvement.
                </p>
              </div>
            </div>
            {bugs.length === 0 ? (
              <div className="no-bugs-card">
                <div className="no-bugs-icon">
                  <FiCheckCircle />
                </div>
                <h3>
                  No Issues Detected
                </h3>
                <p>
                  No problems were detected by
                  the current code analysis rules.
                </p>
              </div>
            ) : (
              <div className="bugs-list">
                {bugs.map(
                  (bug, index) => (
                    <article
                      className="bug-detail-card"
                      key={
                        `${bug.lineNumber}-${bug.title}-${index}`
                      }
                    >
                      <div className="bug-detail-header">
                        <div className="bug-number">
                          #{index + 1}
                        </div>
                        <div className="bug-title-area">
                         <h3>
                            {bug.title ||
                              "Potential Issue"}
                          </h3>
                          <div className="bug-meta">
                          <span>
                              Line{" "}
                              {bug.lineNumber ||
                                "N/A"}
                            </span>
                            <span>
                              {bug.bugType ||
                                "General"}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`bug-severity ${getSeverityClass(
                            bug.severity
                          )}`}
                        >
                          {getSeverityIcon(
                            bug.severity
                          )}
                          <span>
                            {bug.severity ||
                              "LOW"}
                          </span>
                        </div>
                      </div>
                      <div className="bug-detail-body">
                       <div className="bug-description-block">
                          <div className="bug-block-title">
                            <FiInfo />
                            Why is this a problem?
                          </div>
                          <p>
                            {bug.description || "No description available."}
                          </p>
                        </div>
                        <div className="bug-description-block">
                          <div className="bug-block-title">
                            <FiZap />
                            Suggested Improvement
                          </div>
                          <p>
                            {bug.suggestion ||"Review and improve this section of the code."}
                          </p>
                        </div>
                        <div className="bug-confidence">
                          <span>
                            Prediction Confidence
                          </span>
                          <div className="confidence-bar">
                            <div
                              className="confidence-fill"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    bug.confidence ??
                                      0
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                          <strong>
                            {bug.confidence ??
                              0}
                            %
                          </strong>
                        </div>
                     </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
         <section className="quality-insight-card">
            <div className="quality-insight-icon">
              <FiTrendingUp />
            </div>
            <div>
              <h2>
                Code Quality Recommendation
              </h2>
              <p>
                {analysis.codeQualityScore >= 80
                  ? "The analyzed code has a relatively strong quality score. Continue reviewing detected issues and maintain consistent coding practices."
                  : analysis.codeQualityScore >= 60
                  ? "The code has some areas that can be improved. Review the detected issues and complexity metrics before deployment."
                  : "The analysis identified several areas that may require improvement. Focus on resolving detected bugs and reducing unnecessary complexity."}
              </p>
            </div>
          </section>
          <section className="analysis-next-actions">
            <button
              className="analysis-secondary-button"
              onClick={() =>
                navigate(
                  "/history"
                )
              }
            >
              <FiList />
              View Analysis History
            </button>
            <button
              className="analysis-primary-button"
              onClick={() =>
                navigate(
                  "/analyze"
                )
              }
            >
              <FiRefreshCw />
              Analyze Another Code
            </button>
          </section>
        </div>
      </main>
    </>
  );
};
const FiGitBranchIcon = () => {
  return (
    <FiCode />
  );
};
export default AnalysisResult;