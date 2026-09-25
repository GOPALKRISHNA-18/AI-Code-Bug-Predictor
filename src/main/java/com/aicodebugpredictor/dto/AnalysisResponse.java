package com.aicodebugpredictor.dto;
import java.util.List;
public class AnalysisResponse {
    private Long analysisId;
    private String projectName;
    private String language;
    private String fileName;
    private String sourceCode;
    private int riskScore;
    private int codeQualityScore;
    private int totalBugs;
    private String overallRisk;
    private List<BugPrediction> bugs;
    private int totalLines;
    private int codeLines;
    private int commentLines;
    private int blankLines;
    private int functionCount;
    private int classCount;
    private int decisionPoints;
    private int cyclomaticComplexity;
    private String complexityLevel;
    public AnalysisResponse() {
    }
    public AnalysisResponse(
            Long analysisId,
            String projectName,
            String language,
            String fileName,
            String sourceCode,
            int riskScore,
            int codeQualityScore,
            int totalBugs,
            String overallRisk,
            List<BugPrediction> bugs,
            int totalLines,
            int codeLines,
            int commentLines,
            int blankLines,
            int functionCount,
            int classCount,
            int decisionPoints,
            int cyclomaticComplexity,
            String complexityLevel
    ) {
        this.analysisId = analysisId;
        this.projectName = projectName;
        this.language = language;
        this.fileName = fileName;
        this.sourceCode = sourceCode;
        this.riskScore = riskScore;
        this.codeQualityScore = codeQualityScore;
        this.totalBugs = totalBugs;
        this.overallRisk = overallRisk;
        this.bugs = bugs;
        this.totalLines = totalLines;
        this.codeLines = codeLines;
        this.commentLines = commentLines;
        this.blankLines = blankLines;
        this.functionCount = functionCount;
        this.classCount = classCount;
        this.decisionPoints = decisionPoints;
        this.cyclomaticComplexity = cyclomaticComplexity;
        this.complexityLevel = complexityLevel;
    }
    public Long getAnalysisId() {
        return analysisId;
    }
    public void setAnalysisId(Long analysisId) {
        this.analysisId = analysisId;
    }
    public String getProjectName() {
        return projectName;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    public String getSourceCode() {
        return sourceCode;
    }
    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }
    public int getRiskScore() {
        return riskScore;
    }
    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }
    public int getCodeQualityScore() {
        return codeQualityScore;
    }
    public void setCodeQualityScore(int codeQualityScore) {
        this.codeQualityScore = codeQualityScore;
    }
    public int getTotalBugs() {
        return totalBugs;
    }
    public void setTotalBugs(int totalBugs) {
        this.totalBugs = totalBugs;
    }
    public String getOverallRisk() {
        return overallRisk;
    }
    public void setOverallRisk(String overallRisk) {
        this.overallRisk = overallRisk;
    }
    public List<BugPrediction> getBugs() {
        return bugs;
    }
    public void setBugs(List<BugPrediction> bugs) {
        this.bugs = bugs;
    }
    public int getTotalLines() {
        return totalLines;
    }
    public void setTotalLines(int totalLines) {
        this.totalLines = totalLines;
    }
    public int getCodeLines() {
        return codeLines;
    }
    public void setCodeLines(int codeLines) {
        this.codeLines = codeLines;
    }
    public int getCommentLines() {
        return commentLines;
    }
    public void setCommentLines(int commentLines) {
        this.commentLines = commentLines;
    }
    public int getBlankLines() {
        return blankLines;
    }
    public void setBlankLines(int blankLines) {
        this.blankLines = blankLines;
    }
    public int getFunctionCount() {
        return functionCount;
    }
    public void setFunctionCount(int functionCount) {
        this.functionCount = functionCount;
    }
    public int getClassCount() {
        return classCount;
    }
    public void setClassCount(int classCount) {
        this.classCount = classCount;
    }
    public int getDecisionPoints() {
        return decisionPoints;
    }
    public void setDecisionPoints(int decisionPoints) {
        this.decisionPoints = decisionPoints;
    }
    public int getCyclomaticComplexity() {
        return cyclomaticComplexity;
    }
    public void setCyclomaticComplexity(int cyclomaticComplexity) {
        this.cyclomaticComplexity = cyclomaticComplexity;
    }
    public String getComplexityLevel() {
        return complexityLevel;
    }
    public void setComplexityLevel(String complexityLevel) {
        this.complexityLevel = complexityLevel;
    }
    public static class BugPrediction {
        private int lineNumber;
        private String bugType;
        private String severity;
        private String title;
        private String description;
        private String suggestion;
        private int confidence;
        public BugPrediction() {
        }
        public BugPrediction(
                int lineNumber,
                String bugType,
                String severity,
                String title,
                String description,
                String suggestion,
                int confidence
        ) {
            this.lineNumber = lineNumber;
            this.bugType = bugType;
            this.severity = severity;
            this.title = title;
            this.description = description;
            this.suggestion = suggestion;
            this.confidence = confidence;
        }
        public int getLineNumber() {
            return lineNumber;
        }
        public void setLineNumber(int lineNumber) {
            this.lineNumber = lineNumber;
        }
        public String getBugType() {
            return bugType;
        }
        public void setBugType(String bugType) {
            this.bugType = bugType;
        }
        public String getSeverity() {
            return severity;
        }
        public void setSeverity(String severity) {
            this.severity = severity;
        }
        public String getTitle() {
            return title;
        }
        public void setTitle(String title) {
            this.title = title;
        }
        public String getDescription() {
            return description;
        }
        public void setDescription(String description) {
            this.description = description;
        }
        public String getSuggestion() {
            return suggestion;
        }
        public void setSuggestion(String suggestion) {
            this.suggestion = suggestion;
        }
        public int getConfidence() {
            return confidence;
        }
        public void setConfidence(int confidence) {
            this.confidence = confidence;
        }
    }
}