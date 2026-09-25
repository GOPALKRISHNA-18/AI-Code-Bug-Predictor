package com.aicodebugpredictor.dto;
import com.aicodebugpredictor.entity.User;
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String profileImage;
    public ProfileResponse() {
    }
    public ProfileResponse(
            User user
    ) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.profileImage = user.getProfileImage();

    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getProfileImage() {
        return profileImage;
    }
    public void setProfileImage(
            String profileImage
    ) {
        this.profileImage = profileImage;
    }
}