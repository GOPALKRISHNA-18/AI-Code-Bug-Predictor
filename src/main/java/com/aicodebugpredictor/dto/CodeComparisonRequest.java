package com.aicodebugpredictor.dto;
import jakarta.validation.constraints.NotBlank;
public class CodeComparisonRequest {
    @NotBlank(message = "Project name is required.")
    private String projectName;
    @NotBlank(message = "Programming language is required.")
    private String language;
    private String oldFileName;
    private String newFileName;
    @NotBlank(message = "Old code is required.")
    private String oldCode;
    @NotBlank(message = "New code is required.")
    private String newCode;
    public CodeComparisonRequest() {
    }
    public String getProjectName() {
        return projectName;
    }
    public String getLanguage() {
        return language;
    }
    public String getOldFileName() {
        return oldFileName;
    }
    public String getNewFileName() {
        return newFileName;
    }
    public String getOldCode() {
        return oldCode;
    }
    public String getNewCode() {
        return newCode;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public void setOldFileName(String oldFileName) {
        this.oldFileName = oldFileName;
    }
    public void setNewFileName(String newFileName) {
        this.newFileName = newFileName;
    }
    public void setOldCode(String oldCode) {
        this.oldCode = oldCode;
    }
    public void setNewCode(String newCode) {
        this.newCode = newCode;
    }
}