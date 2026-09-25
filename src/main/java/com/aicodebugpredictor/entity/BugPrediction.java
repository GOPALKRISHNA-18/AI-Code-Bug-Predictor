package com.aicodebugpredictor.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "bug_predictions")
public class BugPrediction {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
@Column(name = "line_number")
private int lineNumber;
@Column(name = "bug_type")
private String bugType;
@Column(nullable = false)
private String severity;
@Column(nullable = false)
private String title;
@Column(columnDefinition = "TEXT")
private String description;
@Column(columnDefinition = "TEXT")
private String suggestion;
@Column(nullable = false)
private int confidence;
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "analysis_id", nullable = false)
private Analysis analysis;
public BugPrediction() {
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
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

public Analysis getAnalysis() {
    return analysis;
}

public void setAnalysis(Analysis analysis) {
    this.analysis = analysis;
}


}
