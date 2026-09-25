package com.aicodebugpredictor.dto;
import java.util.ArrayList;
import java.util.List;
public class CompareCodeResponse {
    private String language;
    private int addedLines;
    private int removedLines;
    private int unchangedLines;
    private List<Integer> newLines = new ArrayList<>();
    private int newRiskScore;
    private int oldRiskScore;
    private int riskDifference;
    private String riskChange;
    private int newCodeQualityScore;
    private int oldCodeQualityScore;
    private int qualityDifference;
    private String qualityChange;
    private List<PotentialIssue> newPotentialIssues = new ArrayList<>();
    private List<ChangedLine> changedLines = new ArrayList<>();
    public CompareCodeResponse() {
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public int getAddedLines() {
        return addedLines;
    }

    public void setAddedLines(int addedLines) {
        this.addedLines = addedLines;
    }

    public int getRemovedLines() {
        return removedLines;
    }

    public void setRemovedLines(int removedLines) {
        this.removedLines = removedLines;
    }

    public int getUnchangedLines() {
        return unchangedLines;
    }

    public void setUnchangedLines(int unchangedLines) {
        this.unchangedLines = unchangedLines;
    }

    public List<Integer> getNewLines() {
        return newLines;
    }

    public void setNewLines(List<Integer> newLines) {
        this.newLines = newLines;
    }

    public int getNewRiskScore() {
        return newRiskScore;
    }

    public void setNewRiskScore(int newRiskScore) {
        this.newRiskScore = newRiskScore;
    }

    public int getOldRiskScore() {
        return oldRiskScore;
    }

    public void setOldRiskScore(int oldRiskScore) {
        this.oldRiskScore = oldRiskScore;
    }

    public int getRiskDifference() {
        return riskDifference;
    }

    public void setRiskDifference(int riskDifference) {
        this.riskDifference = riskDifference;
    }

    public String getRiskChange() {
        return riskChange;
    }

    public void setRiskChange(String riskChange) {
        this.riskChange = riskChange;
    }

    public int getNewCodeQualityScore() {
        return newCodeQualityScore;
    }

    public void setNewCodeQualityScore(
            int newCodeQualityScore
    ) {
        this.newCodeQualityScore = newCodeQualityScore;
    }

    public int getOldCodeQualityScore() {
        return oldCodeQualityScore;
    }

    public void setOldCodeQualityScore(
            int oldCodeQualityScore
    ) {
        this.oldCodeQualityScore = oldCodeQualityScore;
    }

    public int getQualityDifference() {
        return qualityDifference;
    }

    public void setQualityDifference(
            int qualityDifference
    ) {
        this.qualityDifference = qualityDifference;
    }

    public String getQualityChange() {
        return qualityChange;
    }

    public void setQualityChange(
            String qualityChange
    ) {
        this.qualityChange = qualityChange;
    }

    public List<PotentialIssue>
    getNewPotentialIssues() {
        return newPotentialIssues;
    }

    public void setNewPotentialIssues(
            List<PotentialIssue> newPotentialIssues
    ) {
        this.newPotentialIssues = newPotentialIssues;
    }

    public List<ChangedLine>
    getChangedLines() {
        return changedLines;
    }

    public void setChangedLines(
            List<ChangedLine> changedLines
    ) {
        this.changedLines = changedLines;
    }
    public static class PotentialIssue {
        private int lineNumber;
        private String title;
        private String severity;
        private String bugType;
        private String description;
        private String suggestion;
        public PotentialIssue() {
        }
        public PotentialIssue(
                int lineNumber,
                String title,
                String severity,
                String bugType,
                String description,
                String suggestion
        ) {
            this.lineNumber = lineNumber;
            this.title = title;
            this.severity = severity;
            this.bugType = bugType;
            this.description = description;
            this.suggestion = suggestion;
        }
        public int getLineNumber() {
            return lineNumber;
        }
        public void setLineNumber(
                int lineNumber
        ) {
            this.lineNumber = lineNumber;
        }
        public String getTitle() {
            return title;
        }
        public void setTitle(String title) {
            this.title = title;
        }
        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity =  severity;
        }
        public String getBugType() {
            return bugType;
        }

        public void setBugType(String bugType) {
            this.bugType = bugType;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription( String description ) {
            this.description = description;
        }

        public String getSuggestion() {
            return suggestion;
        }

        public void setSuggestion( String suggestion) {
            this.suggestion = suggestion;
        }
    }

    public static class ChangedLine {
        private int lineNumber;
        private String type;
        private String content;

        public ChangedLine() {
        }
        public ChangedLine(
                int lineNumber,
                String type,
                String content
        ) {
            this.lineNumber = lineNumber;
            this.type = type;
            this.content = content;
        }
        public int getLineNumber() {
            return lineNumber;
        }

        public void setLineNumber(int lineNumber ) {
            this.lineNumber = lineNumber;
        }
        public String getType() {
            return type;
        }
        public void setType(String type) {
            this.type = type;
        }
        public String getContent() {
            return content;
        }
        public void setContent(String content ) {
            this.content = content;
        }
    }
}

