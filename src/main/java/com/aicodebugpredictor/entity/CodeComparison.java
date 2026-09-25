package com.aicodebugpredictor.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "code_comparisons")
public class CodeComparison {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "project_name", nullable = false)
    private String projectName;
    @Column(nullable = false)
    private String language;
    @Column(name = "old_file_name")
    private String oldFileName;
    @Column(name = "new_file_name")
    private String newFileName;
    @Lob
    @Column(
            name = "old_code",
            columnDefinition = "LONGTEXT"
    )
    private String oldCode;
    @Lob
    @Column(
            name = "new_code",
            columnDefinition = "LONGTEXT"
    )
    private String newCode;

    @Column(name = "added_lines", nullable = false)
    private int addedLines;

    @Column(name = "removed_lines", nullable = false)
    private int removedLines;
    @Column(name = "modified_lines", nullable = false)
    private int modifiedLines;
    @Column(name = "unchanged_lines", nullable = false)
    private int unchangedLines;
    @Column(name = "old_total_lines", nullable = false)
    private int oldTotalLines;
    @Column(name = "new_total_lines", nullable = false)
    private int newTotalLines;
    @Column(name = "new_bugs", nullable = false)
    private int newBugs;
    @Column(name = "old_risk_score", nullable = false)
    private int oldRiskScore;
    @Column(name = "new_risk_score", nullable = false)
    private int newRiskScore;
    @Column(name = "risk_difference", nullable = false)
    private int riskDifference;
    @Column(name = "risk_change")
    private String riskChange;
    @Lob
    @Column(
            name = "added_code",
            columnDefinition = "LONGTEXT"
    )
    private String addedCode;

    @Lob
    @Column(
            name = "removed_code",
            columnDefinition = "LONGTEXT"
    )
    private String removedCode;

    @Lob
    @Column(
            name = "modified_code",
            columnDefinition = "LONGTEXT"
    )
    private String modifiedCode;

    @Lob
    @Column(
            name = "new_issues",
            columnDefinition = "LONGTEXT"
    )
    private String newIssues;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public CodeComparison() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getOldFileName() {
        return oldFileName;
    }

    public void setOldFileName(String oldFileName) {
        this.oldFileName = oldFileName;
    }

    public String getNewFileName() {
        return newFileName;
    }

    public void setNewFileName(String newFileName) {
        this.newFileName = newFileName;
    }

    public String getOldCode() {
        return oldCode;
    }

    public void setOldCode(String oldCode) {
        this.oldCode = oldCode;
    }

    public String getNewCode() {
        return newCode;
    }

    public void setNewCode(String newCode) {
        this.newCode = newCode;
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

    public int getModifiedLines() {
        return modifiedLines;
    }

    public void setModifiedLines(int modifiedLines) {
        this.modifiedLines = modifiedLines;
    }

    public int getUnchangedLines() {
        return unchangedLines;
    }

    public void setUnchangedLines(int unchangedLines) {
        this.unchangedLines = unchangedLines;
    }

    public int getOldTotalLines() {
        return oldTotalLines;
    }

    public void setOldTotalLines(int oldTotalLines) {
        this.oldTotalLines = oldTotalLines;
    }

    public int getNewTotalLines() {
        return newTotalLines;
    }

    public void setNewTotalLines(int newTotalLines) {
        this.newTotalLines = newTotalLines;
    }

    public int getNewBugs() {
        return newBugs;
    }

    public void setNewBugs(int newBugs) {
        this.newBugs = newBugs;
    }

    public int getOldRiskScore() {
        return oldRiskScore;
    }

    public void setOldRiskScore(int oldRiskScore) {
        this.oldRiskScore = oldRiskScore;
    }

    public int getNewRiskScore() {
        return newRiskScore;
    }

    public void setNewRiskScore(int newRiskScore) {
        this.newRiskScore = newRiskScore;
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

    public String getAddedCode() {
        return addedCode;
    }

    public void setAddedCode(String addedCode) {
        this.addedCode = addedCode;
    }

    public String getRemovedCode() {
        return removedCode;
    }

    public void setRemovedCode(String removedCode) {
        this.removedCode = removedCode;
    }

    public String getModifiedCode() {
        return modifiedCode;
    }

    public void setModifiedCode(String modifiedCode) {
        this.modifiedCode = modifiedCode;
    }

    public String getNewIssues() {
        return newIssues;
    }

    public void setNewIssues(String newIssues) {
        this.newIssues = newIssues;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}