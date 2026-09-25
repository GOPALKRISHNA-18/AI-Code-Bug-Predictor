package com.aicodebugpredictor.dto;
import java.time.LocalDateTime;
public class DashboardTrendResponse {
    private Long id;
    private String projectName;
    private int riskScore;
    private int codeQualityScore;
    private int totalBugs;
    private String overallRisk;
    private LocalDateTime createdAt;
    public DashboardTrendResponse() {
    }
    public DashboardTrendResponse(
            Long id,
            String projectName,
            int riskScore,
            int codeQualityScore,
            int totalBugs,
            String overallRisk,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.projectName = projectName;
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

    public void setProjectName(
            String projectName
    ) {
        this.projectName = projectName;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(
            int riskScore
    ) {
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

    public void setOverallRisk(String overallRisk ) {
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