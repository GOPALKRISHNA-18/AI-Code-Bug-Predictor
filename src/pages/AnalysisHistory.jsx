import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiAlertCircle,FiArrowLeft,FiBarChart2,FiCalendar,FiCheckCircle,FiCode,FiEye,FiFileText,FiFilter,FiRefreshCw,FiSearch,FiShield,FiTrash2,FiX,FiTrendingUp,} from "react-icons/fi";
import { getAnalysisHistory,deleteAnalysis,deleteAnalysisHistory,} from "../services/analysisService";
import "./AnalysisHistory.css";
const normalizeHistoryResponse = (response) => {
  if (!response) {
    return [];
  }
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response.content)) {
    return response.content;
  }
  if (
    response.data &&
    Array.isArray(response.data.content)
  ) {
    return response.data.content;
  }
  return [];
};
const getAnalysisId = (analysis) => {
  return (
    analysis?.id ??
    analysis?.analysisId
  );
};
const getRiskClass = (risk) => {
  const value =
    String(risk || "")
      .toLowerCase();
  if (value === "high") {
    return "high";
  }
  if (value === "medium") {
    return "medium";
  }
  return "low";
};
const getBugCount = (analysis) => {
  if (
    typeof analysis?.totalBugs === "number"
  ) {
    return analysis.totalBugs;
  }
  if (
    Array.isArray(analysis?.bugs)
  ) {
    return analysis.bugs.length;
  }
  return 0;
};
const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Unknown date";
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return date.toLocaleString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};
const AnalysisHistory = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingHistory, setDeletingHistory] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const loadHistory = async (
    showRefreshLoader = false
  ) => {
    try {
      setError("");
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
     }
      const response = await getAnalysisHistory();
      const history = normalizeHistoryResponse(response);
      setAnalyses(history);
    } catch (err) {
      console.error(
        "Failed to load analysis history:",
        err
      );
      const message = err?.response?.data?.message || err?.response?.data || err?.message || "Unable to load analysis history.";
      setError(
        typeof message === "string"
          ? message
          : "Unable to load analysis history."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    loadHistory();
  }, []);
  useEffect(() => {
    if (!successMessage) {
      return;
    }
    const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);
  const filteredAnalyses = useMemo(() => {
      const search = searchTerm
          .trim()
          .toLowerCase();
      return analyses.filter(
        (analysis) => {
          const projectName = String(analysis?.projectName ||"").toLowerCase();
          const language = String(analysis?.language || "" ).toLowerCase();
          const fileName = String(analysis?.fileName || "").toLowerCase();
          const risk = String(analysis?.overallRisk || "").toLowerCase();
          const matchesSearch =!search ||projectName.includes(search) ||language.includes(search) ||fileName.includes(search) ||risk.includes(search);
          const matchesRisk = riskFilter === "all" || risk === riskFilter;
          return (
            matchesSearch &&
            matchesRisk
          );
        }
      );
    }, [
      analyses,
      searchTerm,
      riskFilter,
    ]);
  const statistics = useMemo(() => {
      const total = analyses.length;
      const high = analyses.filter((item) =>String(item?.overallRisk || "" ).toLowerCase() === "high").length;
      const medium =analyses.filter((item) =>String(item?.overallRisk || "").toLowerCase() === "medium").length;
      const low = analyses.filter((item) => String(item?.overallRisk || "").toLowerCase() === "low").length;
      const totalBugs =analyses.reduce((sum, item) => sum + getBugCount(item), 0 );
      const averageRisk = total > 0 ? Math.round( analyses.reduce((sum, item) => sum + Number(item?.riskScore || 0),0 ) / total): 0;
      const averageQuality =total > 0 ? Math.round( analyses.reduce((sum, item) =>sum +Number(item?.codeQualityScore || 0 ),0) / total): 0;
      return {
        total,
        high,
        medium,
        low,
        totalBugs,
        averageRisk,
        averageQuality,
      };
    }, [analyses]);
  const handleViewAnalysis = (analysis ) => {
    const analysisId = getAnalysisId(analysis);
    if (!analysisId) {
      setError(
        "Unable to open this analysis because its ID is missing."
      );
      return;
    }
    navigate(
      `/analysis-result?id=${analysisId}`
    );
  };
  const handleDeleteAnalysis = async (
    analysis
  ) => {
    const analysisId = getAnalysisId(analysis);
    if (!analysisId) {
      setError("Unable to delete this analysis because its ID is missing.");
      return;
    }
    const projectName = analysis?.projectName || "this analysis";
    const confirmed = window.confirm(`Are you sure you want to delete "${projectName}"?\n\nThis analysis will be permanently removed from your history.`);
    if (!confirmed) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      setDeletingId(
        analysisId
      );
      await deleteAnalysis(
        analysisId
      );
      setAnalyses(
        (previous) =>
          previous.filter(
            (item) =>
              getAnalysisId(item) !==
              analysisId
          )
      );
      setSuccessMessage(
        "Analysis deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete analysis:",
        err
      );
      const message = err?.response?.data?.message || err?.response?.data || err?.message || "Unable to delete the analysis.";
      setError(
        typeof message === "string"
          ? message
          : "Unable to delete the analysis."
      );
    } finally {
      setDeletingId(null);
    }
  };
  const handleDeleteHistory = async () => {
    if (analyses.length === 0) {
      return;
   }
    const confirmed = window.confirm(`Are you sure you want to delete your entire analysis history?\n\nThis will permanently delete all ${analyses.length} analyses.\n\nThis action cannot be undone.`);
    if (!confirmed) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      setDeletingHistory(true);
      await deleteAnalysisHistory();
      setAnalyses([]);
      setSearchTerm("");
      setRiskFilter("all");
      setSuccessMessage(
        "Your entire analysis history has been deleted."
      );
    } catch (err) {
      console.error("Failed to delete analysis history:",
        err
      );
      const message = err?.response?.data?.message || err?.response?.data || err?.message || "Unable to delete analysis history.";
      setError( typeof message === "string"
          ? message
          : "Unable to delete analysis history."
      );

    } finally {
      setDeletingHistory(false);
    }
  };
  const handleClearFilters = () => {
    setSearchTerm("");
    setRiskFilter("all");
  };
  if (loading) {
    return (
      <div className="analysis-history-page">
        <div className="history-state-card">
          <div className="history-loading-icon">
            <FiRefreshCw />
          </div>
          <h2>
            Loading Analysis History
          </h2>
          <p>
            Fetching your previous code analyses...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="analysis-history-page">
     <div className="history-topbar">
        <Link
          to="/dashboard"
          className="history-back-button"
        >
          <FiArrowLeft />
          <span>
            Back to Dashboard
          </span>
        </Link>
        <div className="history-topbar-title">
          <div className="history-title-icon">
            <FiBarChart2 />
          </div>
          <div>
            <h1>
              Analysis History
            </h1>
            <p>
              View and manage your previous code analyses
            </p>
          </div>
        </div>
        <div className="history-header-actions">
          <button
            type="button"
            className="history-refresh-button"
            onClick={() => loadHistory(true)}
            disabled={
              refreshing ||
              deletingHistory
            }
          >
            <FiRefreshCw
              className={
                refreshing
                  ? "history-spin"
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
            type="button"
            className="history-delete-all-button"
            onClick={
              handleDeleteHistory
            }
            disabled={
              analyses.length === 0 ||
              deletingHistory ||
              deletingId !== null
            }
          >
            {deletingHistory ? (
              <FiRefreshCw className="history-spin" />
            ) : (
              <FiTrash2 />
            )}
            <span>
              {deletingHistory
                ? "Deleting..."
                : "Delete History"}
            </span>
          </button>
        </div>
      </div>
      {successMessage && (
        <div className="history-success-message">
          <FiCheckCircle />
          <span>
            {successMessage}
          </span>
          <button
            type="button"
            onClick={() =>
              setSuccessMessage("")
            }
          >
            <FiX />
          </button>
        </div>
      )}
      {error && (
        <div className="history-error-message">
          <FiAlertCircle />
          <span>
            {error}
          </span>
          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <FiX />
          </button>
        </div>
      )}
      <div className="history-stats-grid">
        <div className="history-stat-card">
          <div className="history-stat-icon blue">
            <FiFileText />
          </div>
          <div>
            <span>
              Total Analyses
            </span>
            <strong>
              {statistics.total}
            </strong>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon red">
            <FiAlertCircle />
          </div>
          <div>
            <span>
              Total Bugs
           </span>
            <strong>
              {statistics.totalBugs}
            </strong>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon orange">
            <FiTrendingUp />
          </div>
          <div>
            <span>
              Average Risk
            </span>
            <strong>
              {statistics.averageRisk}%
            </strong>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon green">
            <FiShield />
          </div>
          <div>
            <span>
              Average Quality
            </span>
            <strong>
              {statistics.averageQuality}%
            </strong>
          </div>
        </div>
      </div>
      <div className="history-toolbar">
        <div className="history-search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by project, file, language or risk..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)
            }
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")
              }
            >
              <FiX />
            </button>
          )}
        </div>
        <div className="history-filter-box">
          <FiFilter />
          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)
            }
          >
            <option value="all">
              All Risk Levels
            </option>
            <option value="high">
              High Risk
            </option>
            <option value="medium">
              Medium Risk
            </option>
            <option value="low">
              Low Risk
            </option>
          </select>
        </div>
        {(searchTerm || riskFilter !== "all") && (
          <button
            type="button"
            className="history-clear-filter"
            onClick={
              handleClearFilters
            }
          >
            Clear Filters
          </button>
        )}
      </div>
      <div className="history-list-header">
        <div>
          <h2>
            Your Analyses
          </h2>
          <p>
            Showing{" "}
            <strong>
              {filteredAnalyses.length}
            </strong>{" "}
            of{" "}
            <strong>
              {analyses.length}
            </strong>{" "}
            analyses
          </p>
        </div>
        {analyses.length > 0 && (
          <button
            type="button"
            className="history-list-delete-button"
            onClick={
              handleDeleteHistory
            }
            disabled={
              deletingHistory || deletingId !== null
            }
          >
            <FiTrash2 />
            <span>
              Delete All
            </span>
          </button>
        )}
      </div>
      {filteredAnalyses.length > 0 ? (
        <div className="history-analysis-list">
          {filteredAnalyses.map((analysis,index) => {
              const analysisId = getAnalysisId(
                  analysis
                );
              const risk = getRiskClass(analysis?.overallRisk);
              const bugCount = getBugCount(analysis);
              const isDeleting = deletingId === analysisId;
              return (
                <article
                  className="history-analysis-card"
                  key={
                    analysisId
                      ? `analysis-${analysisId}`
                      : `analysis-${index}`
                  }
                >
                 <div
                    className={`history-card-icon ${risk}`}
                  >
                    <FiCode />
                  </div>
                  <div className="history-card-main">
                    <div className="history-card-heading">
                      <div>
                        <h3>
                          {analysis?.projectName || "Untitled Project"}
                        </h3>
                        <p>
                          {analysis?.fileName || "Source code analysis"}
                        </p>
                      </div>
                      <span
                        className={`history-risk-badge ${risk}`}
                      >
                        {String(analysis?.overallRisk || "LOW" ).toUpperCase()}
                      </span>
                    </div>
                    <div className="history-card-details">
                      <div className="history-detail-item">
                        <FiCode />
                        <span>
                          {analysis?.language || "Unknown"}
                        </span>
                      </div>
                      <div className="history-detail-item">
                        <FiCalendar />
                        <span>
                          {formatDate(
                            analysis?.createdAt
                          )}
                        </span>
                      </div>
                      <div className="history-detail-item">
                        <FiAlertCircle />
                        <span>
                          {bugCount}{" "}
                          {bugCount === 1
                            ? "Bug"
                            : "Bugs"}
                        </span>
                      </div>
                      <div className="history-detail-item">
                        <FiTrendingUp />
                        <span>
                          Risk{" "}
                          {Number( analysis?.riskScore || 0 )}%
                        </span>
                      </div>
                      <div className="history-detail-item">
                        <FiShield />
                        <span>
                          Quality{" "}
                          {Number(
                            analysis?.codeQualityScore || 0 )}%
                        </span>
                      </div>
                    </div>
                    <div className="history-card-bottom">
                      <div className="history-card-metrics">
                        <span>
                          {Number(analysis?.totalLines || 0)} lines
                        </span>
                        <span>
                          {Number(
                            analysis?.functionCount || 0 )} functions
                        </span>
                        <span>
                          Complexity{" "}
                          {analysis?.complexityLevel || "LOW"}
                        </span>
                      </div>
                      <div className="history-card-actions">
                        <button
                          type="button"
                          className="history-view-button"
                          onClick={() => handleViewAnalysis(analysis)
                          }
                          disabled={
                            isDeleting || deletingHistory
                          }
                        >
                          <FiEye />
                          <span>
                            View Result
                          </span>
                        </button>
                       <button
                          type="button"
                          className="history-delete-button"
                          onClick={() => handleDeleteAnalysis(analysis)
                          }
                          disabled={
                            isDeleting || deletingHistory
                          }
                        >

                          {isDeleting ? (
                            <FiRefreshCw className="history-spin" />
                          ) : (
                            <FiTrash2 />
                          )}
                          <span>
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      ) : (
        <div className="history-state-card">
          {analyses.length === 0 ? (
            <>
              <div className="history-empty-icon">
                <FiFileText />
              </div>
              <h2>
                No Analysis History
              </h2>
              <p>
                You have not analyzed any code yet.
                Start your first analysis to see it here.
              </p>
              <Link
                to="/analyze"
                className="history-primary-button"
              >
                <FiCode />
                Analyze Code
              </Link>
            </>
          ) : (
           <>
              <div className="history-empty-icon">
                <FiSearch />
              </div>
              <h2>
                No Matching Analyses
              </h2>
              <p>
                No analysis matches your current
                search or risk filter.
              </p>
              <button
                type="button"
                className="history-primary-button"
                onClick={
                  handleClearFilters
                }
              >
                <FiX />
                Clear Filters
              </button>
            </>
          )}
        </div>
      )}
      <div className="history-bottom-actions">
        <Link
          to="/analyze"
          className="history-secondary-button"
        >
          <FiCode />
          New Analysis
        </Link>
        <Link
          to="/dashboard"
          className="history-secondary-button"
        >
          <FiBarChart2 />
          Dashboard
        </Link>
      </div>
    </div>
  );
};
export default AnalysisHistory;