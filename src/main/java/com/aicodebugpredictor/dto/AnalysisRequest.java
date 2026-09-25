package com.aicodebugpredictor.dto;
public class AnalysisRequest {
    private String projectName;
    private String language;
    private String fileName;
    private String code;
    public AnalysisRequest() {
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
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
}

