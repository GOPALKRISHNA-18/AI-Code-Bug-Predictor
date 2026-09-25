package com.aicodebugpredictor.dto;
import jakarta.validation.constraints.NotBlank;
public class CompareCodeRequest {
    @NotBlank(message = "Old code is required")
    private String oldCode;
    @NotBlank(message = "New code is required")
    private String newCode;
    @NotBlank(message = "Programming language is required")
    private String language;
    private String oldFileName;
    private String newFileName;
    public CompareCodeRequest() {
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
}

