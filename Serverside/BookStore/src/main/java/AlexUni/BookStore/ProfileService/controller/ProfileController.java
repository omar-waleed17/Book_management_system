package AlexUni.BookStore.ProfileService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AlexUni.BookStore.AuthenticationService.dto.ApiResponse;
import AlexUni.BookStore.AuthenticationService.entity.User;
import AlexUni.BookStore.ProfileService.dto.UpdateProfileRequest;
import AlexUni.BookStore.ProfileService.service.ProfileService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/customer")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;

    private String authenticateUserGetName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        return authentication.getName();
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "User not authenticated"));
        try {
            User user = profileService.loadProfile(userName);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> postMethodName(@Valid @RequestBody UpdateProfileRequest updateProfileRequest) {
        String userName = authenticateUserGetName();
        if (userName == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "User not authenticated"));
        int rowsAffected = profileService.updateProfile(userName, updateProfileRequest);
        if (rowsAffected > 0) {
            return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully ", rowsAffected + " rows affected"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to update profile"));
        }
    }
    
    
}
