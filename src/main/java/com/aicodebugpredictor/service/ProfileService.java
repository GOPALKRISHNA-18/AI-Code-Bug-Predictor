package com.aicodebugpredictor.service;
import com.aicodebugpredictor.dto.ProfileResponse;
import com.aicodebugpredictor.dto.ProfileUpdateRequest;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class ProfileService {
    private final UserRepository userRepository;
    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
   private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null ) {
            throw new RuntimeException("Authenticated user not found.");
        }
        return userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new RuntimeException("User not found."));
    }
    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        User user =  getCurrentUser();
        return new ProfileResponse(user);
    }
    @Transactional
    public ProfileResponse updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUser();
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required.");
        }
        user.setName(request.getName().trim());
        User savedUser = userRepository.save(user);
        return new ProfileResponse(savedUser);
    }
    @Transactional
    public ProfileResponse updateProfileImage(String imageData) {
        User user =  getCurrentUser();
        if (imageData == null || imageData.trim().isEmpty()) {
            throw new RuntimeException("Profile image is required.");
        }
        user.setProfileImage(imageData);
        User savedUser = userRepository.save(user);
        return new ProfileResponse(savedUser);
    }
    @Transactional
    public ProfileResponse removeProfileImage() {
        User user = getCurrentUser();
        user.setProfileImage(null);
        User savedUser =  userRepository.save(user);
        return new ProfileResponse(savedUser);
    }

}