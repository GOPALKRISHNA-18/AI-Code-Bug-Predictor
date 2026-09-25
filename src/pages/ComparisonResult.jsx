import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiGitBranch,FiPlus,FiMinus,FiEdit3,FiCheckCircle, FiAlertTriangle,FiShield,FiCode,FiFileText,FiRefreshCw,} from "react-icons/fi";
import api from "../services/api";
import "./ComparisonResult.css";
function ComparisonResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const comparisonId = searchParams.get("id");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    loadComparisonResult();
  }, [comparisonId]);
  const loadComparisonResult = async () => {
    setLoading(true);
    setError("");
    try {
      if (comparisonId) {
        try {
          const response = await api.get(
            `/comparison/${comparisonId}`
         );
          if (response.data) {
            setResult(response.data);
            setLoading(false);
            return;
          }
        } catch (backendError) {
          console.warn(
            "Comparison result was not found on backend:",
            backendError
          );
        }
      }
      const storedResult =sessionStorage.getItem("latestComparisonResult");
      if (storedResult) {
        setResult(JSON.parse(storedResult));
      } else {
        setError("Comparison result could not be found. Please compare the code versions again.");
      }
        } catch (err) {
      console.error("Unable to load comparison result:", err );
      setError("Unable to load the comparison result." );
    } finally {
      setLoading(false);
    }
  };
  const getRiskClass = (riskChange) => {
    if (!riskChange) {
      return "neutral";
    }
    const value = riskChange.toLowerCase();
    if (
      value.includes("increase") ||
      value.includes("high") ||
      value.includes("worse")
    ) {
      return "danger";
    }
    if (
      value.includes("decrease") ||
      value.includes("improve") ||
      value.includes("lower")
    ) {
      return "success";
    }
    return "neutral";
  };
  const getSeverityClass = (severity) => {
    if (!severity) {
      return "medium";
    }
    const value = severity.toLowerCase();
    if (value.includes("critical")) {
      return "critical";
    }
    if (value.includes("high")) {
      return "high";
    }
    if (value.includes("low")) {
      return "low";
    }
    return "medium";
  };
  const handleBackToCompare = () => {
    navigate("/compare");
  };
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  if (loading) {
    return (
      <div className="comparison-result-page">
        <div className="comparison-loading">
          <div className="loading-icon">
            <FiRefreshCw />
          </div>
          <h2>Loading Comparison Result...</h2>
         <p>
            Please wait while the comparison report is
            being prepared.
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="comparison-result-page">
        <div className="comparison-error">
          <div className="comparison-error-icon">
            <FiAlertTriangle />
          </div>
          <h2>Comparison Result Not Available</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={handleBackToCompare}
          >
            <FiGitBranch />
            Compare Code Again
          </button>
        </div>
      </div>
    );
  }
  if (!result) {
    return null;
  }
  const addedLines = result.addedLines ?? 0;
  const removedLines = result.removedLines ?? 0;
  const modifiedLines = result.modifiedLines ?? 0;
  const unchangedLines = result.unchangedLines ?? 0;
  const newBugs = result.newBugs ?? 0;
  return (
    <div className="comparison-result-page">
      <div className="comparison-result-header">
        <div className="result-header-left">
          <button
            type="button"
            className="result-back-button"
            onClick={handleBackToCompare}
          >
            <FiArrowLeft />
            Back to Compare
          </button>
          <div className="result-page-title">
            <div className="result-page-icon">
              <FiGitBranch />
           </div>
           <div>
              <h1>Comparison Result</h1>
              <p>
                Detailed analysis of changes between
                the two code versions.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="dashboard-button"
          onClick={handleBackToDashboard}
        >
          <FiArrowLeft />
          Dashboard
        </button>
      </div>
      <div className="comparison-result-container">
       <section className="result-card">
          <div className="result-section-heading">
           <div className="result-heading-icon">
              <FiFileText />
            </div>
            <div>
              <h2>Comparison Information</h2>
              <p>
                Details about the compared source code.
              </p>
            </div>
          </div>
          <div className="comparison-info-grid">
            <div className="info-item">
              <span>Project Name</span>
              <strong>
                {result.projectName || "Unnamed Project"}
              </strong>
            </div>
            <div className="info-item">
              <span>Language</span>
              <strong>
                {result.language || "Unknown"}
              </strong>
            </div>
            <div className="info-item">
              <span>Old File</span>
              <strong>
                {result.oldFileName || "Old Version"}
              </strong>
            </div>
            <div className="info-item">
              <span>New File</span>
              <strong>
                {result.newFileName || "New Version"}
              </strong>
           </div>
          </div>
        </section>
        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-heading-icon">
              <FiCode />
           </div>
            <div>
              <h2>Code Change Summary</h2>
              <p>
                Overview of the differences detected
                between both versions.
              </p>
            </div>
          </div>
          <div className="change-summary-grid">
            <div className="change-summary-card added">
              <div className="change-icon">
                <FiPlus />
              </div>
              <div>
                <span>Added Lines</span>
                <strong>{addedLines}</strong>
              </div>
            </div>
            <div className="change-summary-card removed">
              <div className="change-icon">
                <FiMinus />
              </div>
              <div>
                <span>Removed Lines</span>
                <strong>{removedLines}</strong>
              </div>
            </div>
            <div className="change-summary-card modified">
              <div className="change-icon">
                <FiEdit3 />
              </div>
              <div>
                <span>Modified Lines</span>
                <strong>{modifiedLines}</strong>
              </div>
            </div>
            <div className="change-summary-card unchanged">
              <div className="change-icon">
                <FiCheckCircle />
              </div>
              <div>
                <span>Unchanged Lines</span>
                <strong>{unchangedLines}</strong>
              </div>
            </div>
            <div className="change-summary-card bugs">
              <div className="change-icon">
                <FiAlertTriangle />
              </div>
              <div>
                <span>New Bugs</span>
                <strong>{newBugs}</strong>
              </div>
            </div>
          </div>
        </section>
        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-heading-icon">
              <FiShield />
            </div>
            <div>
              <h2>Risk Score Comparison</h2>
              <p>
                Comparison of the estimated code risk
                between both versions.
              </p>
            </div>
          </div>
          <div className="risk-result-container">
            <div className="risk-score-box">
              <span>Old Risk Score</span>
              <strong>
                {result.oldRiskScore ?? 0}
              </strong>
              <small>
                Previous version
              </small>
            </div>
            <div className="risk-transition">
              →
            </div>
            <div className="risk-score-box">
              <span>New Risk Score</span>
              <strong>
                {result.newRiskScore ?? 0}
              </strong>
              <small>
                Updated version
              </small>
            </div>
            <div
              className={`risk-result-change ${getRiskClass(
                result.riskChange
              )}`}
            >
              <span>Risk Change</span>

              <strong>
                {result.riskDifference ?? 0}
              </strong>
              <small>
                {result.riskChange ||
                  "No significant change"}
              </small>
            </div>
          </div>
        </section>
        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-heading-icon warning">
              <FiAlertTriangle />
            </div>
            <div>
              <h2>New Issues Detected</h2>
              <p>
                Potential issues that were introduced
                in the new version.
              </p>
            </div>
          </div>
          {Array.isArray(result.newIssues) &&
          result.newIssues.length > 0 ? (
            <div className="detailed-issues-list">
              {result.newIssues.map(
                (issue, index) => (
                  <div
                    className="detailed-issue"
                    key={`${issue.lineNumber || "line"}-${issue.type || "issue"}-${index}`}
                  >
                    <div className="issue-header">
                      <div className="issue-number">
                        #{index + 1}
                      </div>
                      <div className="issue-main-title">
                        <h3>
                          {issue.type || "Potential Code Issue"}
                        </h3>
                        <span>
                          Line{" "}
                          {issue.lineNumber ?? "-"}
                        </span>
                     </div>
                      <div
                        className={`severity-badge ${getSeverityClass(
                          issue.severity
                        )}`}
                      >
                        {issue.severity ||
                          "Medium"}
                      </div>
                    </div>
                    <div className="issue-content">
                      <div className="issue-description">
                        <strong>
                          Explanation
                        </strong>
                        <p>
                          {issue.message || "A potential issue was detected in the new code version."}
                        </p>
                      </div>

                      {issue.suggestion && (
                        <div className="issue-recommendation">
                          <strong>
                            Suggested Improvement
                          </strong>
                          <p>
                            {issue.suggestion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="no-issues">
              <div className="no-issues-icon">
                <FiCheckCircle />
              </div>
              <h3>No New Issues Detected</h3>
              <p>
                The comparison did not identify any
                newly introduced issues in the new
                version.
              </p>
            </div>
          )}
        </section>
        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-heading-icon">
              <FiGitBranch />
            </div>
            <div>
              <h2>Code Changes</h2>
              <p>
                Lines identified as added, removed,
                or modified.
              </p>
            </div>
          </div>
          <div className="code-change-columns">
            <div className="code-change-box added-box">
              <div className="code-change-heading">
                <FiPlus />
                <h3>Added Code</h3>
              </div>
              {Array.isArray(result.addedCode) && result.addedCode.length > 0 ? (
                <div className="code-lines">
                  {result.addedCode.map(
                    (line, index) => (
                      <div
                        className="code-line added-line"
                        key={`added-${index}`}
                      >
                        <span className="line-symbol">
                          +
                        </span>
                        <code>
                          {line}
                        </code>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="empty-code-message">
                  No added code detected.
                </div>
              )}
            </div>
           <div className="code-change-box removed-box">
              <div className="code-change-heading">
                <FiMinus />
                <h3>Removed Code</h3>
            </div>
              {Array.isArray(result.removedCode) &&
              result.removedCode.length > 0 ? (
                <div className="code-lines">
                  {result.removedCode.map(
                    (line, index) => (
                      <div
                        className="code-line removed-line"
                        key={`removed-${index}`}
                      >
                        <span className="line-symbol">
                          -
                        </span>
                        <code>
                          {line}
                        </code>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="empty-code-message">
                  No removed code detected.
                </div>
              )}
            </div>
          </div>
        </section>
        <div className="result-bottom-actions">
          <button
            type="button"
            className="secondary-result-button"
            onClick={handleBackToDashboard}
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>
          <button
            type="button"
            className="primary-result-button"
            onClick={handleBackToCompare}
          >
            <FiGitBranch />
            Compare Another Version
          </button>
        </div>
      </div>
    </div>
  );
}
export default ComparisonResult;