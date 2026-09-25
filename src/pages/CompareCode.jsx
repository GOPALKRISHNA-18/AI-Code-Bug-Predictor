import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {FiArrowLeft,FiCode,FiCopy,FiRefreshCw,FiRepeat,FiTrash2,FiGitBranch,FiCheck, FiAlertTriangle,FiEye,} from "react-icons/fi";
import api from "../services/api";
import "./CompareCode.css";
const languageOptions = [
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "go", label: "Go" },
];
const defaultCode = `public class Example {
    public void calculate() {
        int value = 10;
        if (value > 5) {
            System.out.println("Value is greater than 5");
        }
    }
}`;
function CompareCode() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("java");
  const [oldFileName, setOldFileName] = useState(
    "old-version.java"
  );
  const [newFileName, setNewFileName] = useState(
    "new-version.java"
  );
  const [oldCode, setOldCode] = useState(defaultCode);
  const [newCode, setNewCode] = useState(defaultCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [result, setResult] = useState(null);
  const handleCompare = async () => {
    setError("");
    setSuccess("");
    setResult(null);
    sessionStorage.removeItem( "latestComparisonResult" );
    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }
    if (!oldCode.trim()) {
      setError( "Please enter the old version of the code." );
      return;
    }
    if (!newCode.trim()) {
      setError( "Please enter the new version of the code.");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post( "/comparison/compare",
        {
          projectName: projectName.trim(),
          language,
          oldFileName,
          newFileName,
          oldCode,
          newCode,
        }
      );
     setResult(response.data);
      sessionStorage.setItem( "latestComparisonResult",JSON.stringify(response.data));
      setSuccess( "Code comparison completed successfully.");
    } catch (err) {
      console.error( "Code comparison failed:",err);
      const message = err?.response?.data?.message || err?.response?.data || "Unable to compare the code versions.";
      setError( typeof message === "string"
          ? message
          : "Unable to compare the code versions."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleSwap = () => {
    const temporaryCode = oldCode;
    const temporaryFileName = oldFileName;
    setOldCode(newCode);
    setNewCode(temporaryCode);
    setOldFileName(newFileName);
    setNewFileName(temporaryFileName);
    setResult(null);
    setSuccess("");
    setError("");
    sessionStorage.removeItem(
      "latestComparisonResult"
    );
  };
  const handleReset = () => {
    setProjectName("");
    setLanguage("java");
    setOldFileName("old-version.java");
    setNewFileName("new-version.java");
    setOldCode(defaultCode);
    setNewCode(defaultCode);
    setResult(null);
    setSuccess("");
    setError("");
    sessionStorage.removeItem(
      "latestComparisonResult"
    );
  };
  const handleCopyOldCode = async () => {
    try {
      await navigator.clipboard.writeText(oldCode);
      setSuccess( "Old code copied successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        "Unable to copy old code."
      );
    }
  };
  const handleCopyNewCode = async () => {
    try {
      await navigator.clipboard.writeText(newCode);
      setSuccess("New code copied successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to copy new code.");
    }
  };
  const handleClearOldCode = () => {
    setOldCode("");
    setResult(null);
    sessionStorage.removeItem(
      "latestComparisonResult"
    );
  };
  const handleClearNewCode = () => {
    setNewCode("");
    setResult(null);
    sessionStorage.removeItem(
      "latestComparisonResult"
    );
  };
  const handleViewResult = () => {
    if (!result) {
      return;
    }
   sessionStorage.setItem(
      "latestComparisonResult",
      JSON.stringify(result)
    );
    if (result.comparisonId) {
      navigate(
        `/comparison-result?id=${result.comparisonId}`
      );
      return;
    }
    navigate("/comparison-result");
  };
  const getRiskClass = (riskChange) => {
    if (!riskChange) {
      return "neutral";
    }
    const value = riskChange.toLowerCase();
    if (value.includes("increase") || value.includes("high") || value.includes("worse")
    ) {
      return "danger";
    }
    if (value.includes("decrease") || value.includes("improve") || value.includes("lower")
    ) {
      return "success";
    }
    return "neutral";
  };
  return (
    <div className="compare-page">
      <div className="compare-header">
        <div className="compare-header-left">
         <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FiArrowLeft />
            <span>
              Back to Dashboard
            </span>
         </button>
          <div className="page-heading">
            <div className="page-heading-icon">
              <FiGitBranch />
            </div>
            <div>
              <h1>
                Code Version Comparison
             </h1>
              <p>
                Compare two versions of your source
                code and identify newly introduced
                bugs and risk changes.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="reset-button"
          onClick={handleReset}
        >
          <FiRefreshCw />
          Reset
        </button>
      </div>
      <div className="compare-container">
        <section className="compare-card project-card">
          <div className="section-title">
            <div className="section-title-icon">
              <FiCode />
            </div>
            <div>
              <h2>
                Project Information
              </h2>
              <p>
                Enter the basic details before
                comparing the two code versions.
              </p>
            </div>
          </div>
          <div className="project-grid">
           <div className="form-group">
              <label htmlFor="projectName">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(event) =>
                  setProjectName(
                    event.target.value
                  )
                }
                placeholder="Example: Student Management System"
              />
            </div>
            <div className="form-group">
              <label htmlFor="language">
                Programming Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target.value
                  )
                }
              >
                {languageOptions.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </section>
        {error && (
        <div className="message-box error-message">
           <FiAlertTriangle />
            <span>
              {error}
            </span>
          </div>
        )}
        {success && (
          <div className="message-box success-message">
            <FiCheck />
            <span>
              {success}
            </span>
          </div>
        )}
        <section className="code-comparison-grid">
          <div className="compare-card editor-card">
            <div className="editor-card-header">
              <div>
                <div className="version-title">
                  <span className="version-dot old-dot"></span>
                  <h2>
                   Old Version
                  </h2>
                </div>
                <p>
                 Previous version of the
                  source code.
                </p>
              </div>
              <button
                type="button"
                className="icon-action-button"
                onClick={handleCopyOldCode}
                title="Copy old code"
              >
                <FiCopy />
              </button>
            </div>
            <div className="file-input-wrapper">
              <label htmlFor="oldFileName">
                File Name
              </label>
              <input
                id="oldFileName"
                type="text"
                value={oldFileName}
                onChange={(event) =>
                  setOldFileName(
                    event.target.value
                  )
                }
                placeholder="old-version.java"
              />
            </div>
            <div className="editor-wrapper">
              <Editor
                height="430px"
                language={language}
                theme="vs-dark"
                value={oldCode}
                onChange={(value) =>
                  setOldCode(value || "")
                }
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: {
                    top: 15,
                    bottom: 15,
                  },
                }}
              />
            </div>
            <button
              type="button"
              className="clear-code-button"
              onClick={handleClearOldCode}
            >
              <FiTrash2 />
              Clear Old Code
           </button>
          </div>
          <div className="swap-wrapper">
            <button
              type="button"
              className="swap-button"
              onClick={handleSwap}
              title="Swap code versions"
            >
              <FiRepeat />
            </button>
          </div>
          <div className="compare-card editor-card">
            <div className="editor-card-header">
              <div>
                <div className="version-title">
                  <span className="version-dot new-dot"></span>
                  <h2>
                    New Version
                  </h2>
                </div>
                <p>
                  Updated version of the
                  source code.
                </p>
              </div>
              <button
                type="button"
                className="icon-action-button"
                onClick={handleCopyNewCode}
                title="Copy new code"
              >
                <FiCopy />
              </button>
            </div>
            <div className="file-input-wrapper">
              <label htmlFor="newFileName">
                File Name
              </label>
              <input
                id="newFileName"
                type="text"
                value={newFileName}
                onChange={(event) =>
                  setNewFileName(
                    event.target.value
                  )
                }
                placeholder="new-version.java"
              />
            </div>
            <div className="editor-wrapper">
              <Editor
                height="430px"
                language={language}
                theme="vs-dark"
                value={newCode}
                onChange={(value) =>
                  setNewCode(value || "")
                }
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: {
                    top: 15,
                    bottom: 15,
                  },
                }}
              />
            </div>
           <button
              type="button"
              className="clear-code-button"
              onClick={handleClearNewCode}
            >
              <FiTrash2 />
              Clear New Code
            </button>
          </div>
        </section>
        <div className="compare-action-area">
          <button
            type="button"
            className="compare-main-button"
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>

                Comparing Code...
              </>
            ) : (
              <>
                <FiGitBranch />
                Compare Versions
              </>
            )}
          </button>
        </div>
        {result && (
          <section className="compare-card result-card">
            <div className="result-header">
              <div className="section-title">
                <div className="section-title-icon">
                  <FiEye />
                </div>
                <div>
                  <h2>
                    Comparison Result
                  </h2>
                  <p>
                    Summary of changes between
                    the two versions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="view-result-button"
                onClick={handleViewResult}
              >
                <FiEye />
                View Detailed Result
              </button>
            </div>
            <div className="result-stat-grid">
             <div className="result-stat added-stat">
                <span className="result-stat-label">
                  Added Lines
                </span>
                <strong>
                  {result.addedLines ?? 0}
                </strong>
              </div>
             <div className="result-stat removed-stat">
                <span className="result-stat-label">
                  Removed Lines
                </span>
                <strong>
                  {result.removedLines ?? 0}
                </strong>
              </div>
              <div className="result-stat modified-stat">
                <span className="result-stat-label">
                  Modified Lines
                </span>
                <strong>
                  {result.modifiedLines ?? 0}
                </strong>
              </div>
              <div className="result-stat unchanged-stat">
                <span className="result-stat-label">
                  Unchanged Lines
                </span>
               <strong>
                  {result.unchangedLines ?? 0}
                </strong>
              </div>
             <div className="result-stat bug-stat">
                <span className="result-stat-label">
                  New Bugs
                </span>
                <strong>
                  {result.newBugs ?? 0}
                </strong>
              </div>
            </div>
            <div className="risk-comparison">
              <div className="risk-item">
                <span>
                  Old Risk Score
                </span>
                <strong>
                  {result.oldRiskScore ?? 0}
                </strong>
              </div>
              <div className="risk-arrow">
                →
             </div>
              <div className="risk-item">
                <span>
                  New Risk Score
                </span>
                <strong>
                  {result.newRiskScore ?? 0}
                </strong>
              </div>
              <div
                className={`risk-change ${getRiskClass(
                  result.riskChange
                )}`}
              >
                {result.riskChange ||
                  "No significant change"}
              </div>
            </div>
            {Array.isArray(
              result.newIssues
            ) &&
              result.newIssues.length > 0 && (
                <div className="issues-section">
                  <div className="issues-title">
                    <FiAlertTriangle />
                    <h3>
                      New Issues Detected
                    </h3>
                  </div>
                  <div className="issues-list">
                    {result.newIssues.map(
                      (issue, index) => (
                        <div
                          className="issue-item"
                          key={`${issue.lineNumber || "line"}-${issue.type || "issue"}-${index}`}
                        >
                          <div className="issue-top">
                            <span className="issue-line">
                              Line{" "}
                              {issue.lineNumber ??
                                "-"}
                            </span>
                            <span className="issue-severity">
                              {issue.severity ||
                               "Medium"}
                            </span>
                          </div>
                          <h4>
                            {issue.type ||
                              "Code Issue"}
                          </h4>
                          <p>
                            {issue.message ||
                              "Potential issue detected in the new version."}
                          </p>
                          {issue.suggestion && (
                            <div className="issue-suggestion">
                              <strong>
                                Suggestion:
                              </strong>{" "}
                              {issue.suggestion}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </section>
        )}
      </div>
    </div>
  );
}
export default CompareCode;