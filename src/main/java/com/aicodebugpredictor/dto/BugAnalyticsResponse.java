package com.aicodebugpredictor.dto;
import java.util.List;
public class BugAnalyticsResponse {
    private long totalBugs;
    private long highSeverityBugs;
    private long mediumSeverityBugs;
    private long lowSeverityBugs;
    private List<BugTypeCountResponse> bugTypes;
    public BugAnalyticsResponse() {
    }
    public BugAnalyticsResponse(
            long totalBugs,
            long highSeverityBugs,
            long mediumSeverityBugs,
            long lowSeverityBugs,
            List<BugTypeCountResponse> bugTypes
    ) {
        this.totalBugs = totalBugs;
        this.highSeverityBugs = highSeverityBugs;
        this.mediumSeverityBugs = mediumSeverityBugs;
        this.lowSeverityBugs = lowSeverityBugs;
        this.bugTypes = bugTypes;
    }
    public long getTotalBugs() {
        return totalBugs;
    }
    public void setTotalBugs(long totalBugs) {
        this.totalBugs = totalBugs;
    }

    public long getHighSeverityBugs() {
        return highSeverityBugs;
    }
    public void setHighSeverityBugs(
            long highSeverityBugs
    ) {
        this.highSeverityBugs = highSeverityBugs;
    }
    public long getMediumSeverityBugs() {
        return mediumSeverityBugs;
    }
    public void setMediumSeverityBugs(
            long mediumSeverityBugs
    ) {
        this.mediumSeverityBugs = mediumSeverityBugs;
    }
    public long getLowSeverityBugs() {
        return lowSeverityBugs;
    }
    public void setLowSeverityBugs(
            long lowSeverityBugs
    ) {
        this.lowSeverityBugs = lowSeverityBugs;
    }
    public List<BugTypeCountResponse> getBugTypes() {
        return bugTypes;
    }
    public void setBugTypes(
            List<BugTypeCountResponse> bugTypes
    ) {
        this.bugTypes = bugTypes;
    }
}