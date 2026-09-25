package com.aicodebugpredictor.dto;
import jakarta.validation.constraints.NotBlank;
public class CodeAnalysisRequest {
@NotBlank(message = "Project name is required")
private String projectName;
@NotBlank(message = "Programming language is required")
private String language;
private String fileName;
@NotBlank(message = "Source code is required")
private String code;
public CodeAnalysisRequest() {
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
