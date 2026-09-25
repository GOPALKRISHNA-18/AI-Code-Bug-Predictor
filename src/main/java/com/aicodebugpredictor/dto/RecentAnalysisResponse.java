package com.aicodebugpredictor.dto;
import java.time.LocalDateTime;
public class RecentAnalysisResponse {
    private Long id;
    private String projectName;
    private String language;
    private String fileName;
    private int riskScore;
    private int codeQualityScore;
    private int totalBugs;
    private String overallRisk;
    private LocalDateTime createdAt;
    public RecentAnalysisResponse() {
    }
    public RecentAnalysisResponse(
            Long id,
            String projectName,
            String language,
            String fileName,
            int riskScore,
            int codeQualityScore,
            int totalBugs,
            String overallRisk,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.projectName = projectName;
        this.language = language;
        this.fileName = fileName;
        this.riskScore = riskScore;
        this.codeQualityScore = codeQualityScore;
        this.totalBugs = totalBugs;
        this.overallRisk = overallRisk;
        this.createdAt = createdAt;
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

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public int getCodeQualityScore() {
        return codeQualityScore;
    }

    public void setCodeQualityScore(
            int codeQualityScore
    ) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}

