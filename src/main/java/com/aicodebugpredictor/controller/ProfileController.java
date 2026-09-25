package com.aicodebugpredictor.controller;
import com.aicodebugpredictor.dto.ProfileResponse;
import com.aicodebugpredictor.dto.ProfileUpdateRequest;
import com.aicodebugpredictor.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {
    private final ProfileService profileService;
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }
    @GetMapping("/me")
    public ResponseEntity<?> getProfile() {
        try {
            ProfileResponse response =  profileService.getProfile();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage() != null ? e.getMessage(): "Unable to load profile."));
        }
    }
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @Valid
            @RequestBody
            ProfileUpdateRequest request
    ) {
        try {
            ProfileResponse response = profileService.updateProfile(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage() != null ? e.getMessage() : "Unable to update profile."));
        }
    }
    @PostMapping("/image")
    public ResponseEntity<?> updateProfileImage(
            @RequestBody
            Map<String, String> request
    ) {
        try {
            String imageData =  request.get("image");
            ProfileResponse response =  profileService.updateProfileImage(imageData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage(): "Unable to update profile image."));
        }
    }
   @DeleteMapping("/image")
    public ResponseEntity<?> removeProfileImage() {
        try {
            ProfileResponse response =  profileService.removeProfileImage();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage() != null ? e.getMessage() : "Unable to remove profile image."));
        }
    }
}