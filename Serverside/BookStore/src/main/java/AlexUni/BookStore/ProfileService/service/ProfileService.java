package AlexUni.BookStore.ProfileService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import AlexUni.BookStore.AuthenticationService.entity.User;
import AlexUni.BookStore.ProfileService.dto.UpdateProfileRequest;
import AlexUni.BookStore.ProfileService.repository.ProfileRepository;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User loadProfile(String userName) {
        return profileRepository.findByUsername(userName)
        .orElseThrow(() -> new RuntimeException("User with username " + userName + " not found!"));
    }

    public int updateProfile(String userName, UpdateProfileRequest updateProfileRequest) {
        User user = loadProfile(userName);
        user.setEmail(updateProfileRequest.getEmail());
        user.setFirstName(updateProfileRequest.getFirstName()); 
        user.setLastName(updateProfileRequest.getLastName());
        user.setPhoneNumber(updateProfileRequest.getPhoneNumber());
        user.setShippingAddress(updateProfileRequest.getShippingAddress());

        String newRawPassword = updateProfileRequest.getPassword();
    
        if (newRawPassword != null && !newRawPassword.isEmpty()) {
            String encodedPassword = passwordEncoder.encode(newRawPassword);
            user.setPassword(encodedPassword);
        }

        int rowsAffected = profileRepository.modifyProfile(user);
        
        return rowsAffected;
    }
    
}
