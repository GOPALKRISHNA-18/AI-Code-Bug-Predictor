package com.aicodebugpredictor.dto;
public class BugTypeCountResponse {
    private String bugType;
    private long count;
    public BugTypeCountResponse() {
    }
    public BugTypeCountResponse(
            String bugType,
            long count
    ) {
        this.bugType = bugType;
        this.count = count;
    }

    public String getBugType() {
        return bugType;
    }

    public void setBugType(
            String bugType
    ) {
        this.bugType = bugType;
    }

    public long getCount() {
        return count;
    }

    public void setCount(
            long count
    ) {
        this.count = count;
    }
}