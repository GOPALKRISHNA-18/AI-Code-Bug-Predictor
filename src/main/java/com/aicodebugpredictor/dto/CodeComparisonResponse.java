package com.aicodebugpredictor.dto;
import java.util.ArrayList;
import java.util.List;
public class CodeComparisonResponse {
    private Long comparisonId;
    private String projectName;
    private String language;
    private String oldFileName;
    private String newFileName;
    private int addedLines;
    private int removedLines;
    private int modifiedLines;
    private int unchangedLines;
    private int oldTotalLines;
    private int newTotalLines;
    private int newBugs;
    private int oldRiskScore;
    private int newRiskScore;
    private int riskDifference;
    private String riskChange;
    private List<String> addedCode = new ArrayList<>();
    private List<String> removedCode = new ArrayList<>();
    private List<String> modifiedCode = new ArrayList<>();
    private List<ComparisonIssue> newIssues =
            new ArrayList<>();
    public CodeComparisonResponse() {
    }
    public Long getComparisonId() {
        return comparisonId;
    }
    public String getProjectName() {
        return projectName;
    }
    public String getLanguage() {
        return language;
    }
    public String getOldFileName() {
        return oldFileName;
    }
    public String getNewFileName() {
        return newFileName;
    }
    public int getAddedLines() {
        return addedLines;
    }
    public int getRemovedLines() {
        return removedLines;
    }
    public int getModifiedLines() {
        return modifiedLines;
    }
    public int getUnchangedLines() {
        return unchangedLines;
    }
    public int getOldTotalLines() {
        return oldTotalLines;
    }
    public int getNewTotalLines() {
        return newTotalLines;
    }
    public int getNewBugs() {
        return newBugs;
    }
    public int getOldRiskScore() {
        return oldRiskScore;
    }
    public int getNewRiskScore() {
        return newRiskScore;
    }
    public int getRiskDifference() {
        return riskDifference;
    }
    public String getRiskChange() {
        return riskChange;
    }
    public List<String> getAddedCode() {
        return addedCode;
    }
    public List<String> getRemovedCode() {
        return removedCode;
    }
    public List<String> getModifiedCode() {
        return modifiedCode;
    }
    public List<ComparisonIssue> getNewIssues() {
        return newIssues;
    }
    public void setComparisonId(Long comparisonId) {
        this.comparisonId = comparisonId;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public void setOldFileName(String oldFileName) {
        this.oldFileName = oldFileName;
    }
    public void setNewFileName(String newFileName) {
        this.newFileName = newFileName;
    }

    public void setAddedLines(int addedLines) {
        this.addedLines = addedLines;
    }

    public void setRemovedLines(int removedLines) {
        this.removedLines = removedLines;
    }

    public void setModifiedLines(int modifiedLines) {
        this.modifiedLines = modifiedLines;
    }

    public void setUnchangedLines(int unchangedLines) {
        this.unchangedLines = unchangedLines;
    }

    public void setOldTotalLines(int oldTotalLines) {
        this.oldTotalLines = oldTotalLines;
    }

    public void setNewTotalLines(int newTotalLines) {
        this.newTotalLines = newTotalLines;
    }

    public void setNewBugs(int newBugs) {
        this.newBugs = newBugs;
    }

    public void setOldRiskScore(int oldRiskScore) {
        this.oldRiskScore = oldRiskScore;
    }

    public void setNewRiskScore(int newRiskScore) {
        this.newRiskScore = newRiskScore;
    }

    public void setRiskDifference(int riskDifference) {
        this.riskDifference = riskDifference;
    }

    public void setRiskChange(String riskChange) {
        this.riskChange = riskChange;
    }

    public void setAddedCode(List<String> addedCode) {
        this.addedCode = addedCode;
    }

    public void setRemovedCode(List<String> removedCode) {
        this.removedCode = removedCode;
    }

    public void setModifiedCode(List<String> modifiedCode) {
        this.modifiedCode = modifiedCode;
    }

    public void setNewIssues(
            List<ComparisonIssue> newIssues
    ) {
        this.newIssues = newIssues;
    }
    public static class ComparisonIssue {
       private int lineNumber;
        private String type;
        private String severity;
        private String message;
        private String suggestion;
        public ComparisonIssue() {
        }
        public ComparisonIssue(
                int lineNumber,
                String type,
                String severity,
                String message,
                String suggestion
        ) {
            this.lineNumber = lineNumber;
            this.type = type;
            this.severity = severity;
            this.message = message;
            this.suggestion = suggestion;
        }

        public int getLineNumber() {
            return lineNumber;
        }

        public String getType() {
            return type;
        }

        public String getSeverity() {
            return severity;
        }

        public String getMessage() {
            return message;
        }

        public String getSuggestion() {
            return suggestion;
        }

        public void setLineNumber(int lineNumber) {
            this.lineNumber = lineNumber;
        }

        public void setType(String type) {
            this.type = type;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public void setSuggestion(String suggestion) {
            this.suggestion = suggestion;
        }
    }
}