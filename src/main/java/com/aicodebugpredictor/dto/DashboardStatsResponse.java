package com.aicodebugpredictor.dto;
import java.util.List;
public class DashboardStatsResponse {
    private long totalAnalyses;
    private long bugsDetected;
    private double averageRisk;
    private double averageCodeQuality;
    private long highRiskAnalyses;
    private long mediumRiskAnalyses;
    private long lowRiskAnalyses;
    private List<RecentAnalysisResponse> recentAnalyses;
    public DashboardStatsResponse() {
    }
    public long getTotalAnalyses() {
        return totalAnalyses;
    }
    public void setTotalAnalyses(long totalAnalyses) {
        this.totalAnalyses = totalAnalyses;
    }
    public long getBugsDetected() {
        return bugsDetected;
    }
    public void setBugsDetected(long bugsDetected) {
        this.bugsDetected = bugsDetected;
    }
    public double getAverageRisk() {
        return averageRisk;
    }
    public void setAverageRisk(double averageRisk) {
        this.averageRisk = averageRisk;
    }
    public double getAverageCodeQuality() {
        return averageCodeQuality;
    }
    public void setAverageCodeQuality(
            double averageCodeQuality
    ) {
        this.averageCodeQuality = averageCodeQuality;
    }
    public long getHighRiskAnalyses() {
        return highRiskAnalyses;
    }
    public void setHighRiskAnalyses(
            long highRiskAnalyses
    ) {
        this.highRiskAnalyses = highRiskAnalyses;
    }
    public long getMediumRiskAnalyses() {
        return mediumRiskAnalyses;
    }
    public void setMediumRiskAnalyses(
            long mediumRiskAnalyses
    ) {
        this.mediumRiskAnalyses = mediumRiskAnalyses;
    }
    public long getLowRiskAnalyses() {
        return lowRiskAnalyses;
    }
    public void setLowRiskAnalyses(
            long lowRiskAnalyses
    ) {
        this.lowRiskAnalyses = lowRiskAnalyses;
    }
    public List<RecentAnalysisResponse> getRecentAnalyses() {
        return recentAnalyses;
    }

    public void setRecentAnalyses(
            List<RecentAnalysisResponse> recentAnalyses
    ) {
        this.recentAnalyses = recentAnalyses;
    }
}

