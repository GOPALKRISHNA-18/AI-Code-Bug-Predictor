package com.aicodebugpredictor.dto;
public class BugPrediction {
    private Long id;
    private String title;
    private String type;
    private String severity;
    private int line;
    private int confidence;
    private String description;
    private String suggestion;
    public BugPrediction() {
    }
    public BugPrediction(
            Long id,
            String title,
            String type,
            String severity,
            int line,
            int confidence,
            String description,
            String suggestion
    ) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.severity = severity;
        this.line = line;
        this.confidence = confidence;
        this.description = description;
        this.suggestion = suggestion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public int getLine() {
        return line;
    }

    public void setLine(int line) {
        this.line = line;
    }

    public int getConfidence() {
        return confidence;
    }

    public void setConfidence(int confidence) {
        this.confidence = confidence;
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
}
