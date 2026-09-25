package com.aicodebugpredictor.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "analyses")
public class Analysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "project_name", nullable = false)
    private String projectName;
    @Column(nullable = false)
    private String language;
    @Column(name = "file_name")
    private String fileName;
    @Lob
    @Column(name = "source_code", columnDefinition = "LONGTEXT")
    private String sourceCode;
    @Column(name = "risk_score", nullable = false)
    private int riskScore;
    @Column(name = "code_quality_score", nullable = false)
    private int codeQualityScore;
    @Column(name = "total_bugs", nullable = false)
    private int totalBugs;
    @Column(name = "overall_risk", nullable = false)
    private String overallRisk;
    @Column(name = "total_lines", nullable = false)
    private int totalLines;
    @Column(name = "code_lines", nullable = false)
    private int codeLines;
    @Column(name = "comment_lines", nullable = false)
    private int commentLines;
    @Column(name = "blank_lines", nullable = false)
    private int blankLines;
    @Column(name = "function_count", nullable = false)
    private int functionCount;
    @Column(name = "class_count", nullable = false)
    private int classCount;
    @Column(name = "decision_points", nullable = false)
    private int decisionPoints;
    @Column(name = "cyclomatic_complexity", nullable = false)
    private int cyclomaticComplexity;
    @Column(name = "complexity_level", nullable = false)
    private String complexityLevel;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @OneToMany(
            mappedBy = "analysis",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<BugPrediction> bugs = new ArrayList<>();

    public Analysis() {
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
    public List<BugPrediction> getBugs() {
        return bugs;
    }

    public void setBugs(List<BugPrediction> bugs) {
        this.bugs = bugs;
    }

    public void addBug(BugPrediction bug) {
        bugs.add(bug);
        bug.setAnalysis(this);
    }
}