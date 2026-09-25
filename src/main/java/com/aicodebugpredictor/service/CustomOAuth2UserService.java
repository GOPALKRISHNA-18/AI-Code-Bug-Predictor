package com.aicodebugpredictor.service;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
@Service
public class CustomOAuth2UserService
        implements OAuth2UserService<
                OAuth2UserRequest,
                OAuth2User> {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(
            UserRepository userRepository
    ) {
        this.userRepository =
                userRepository;
    }

    @Override
    public OAuth2User loadUser(
            OAuth2UserRequest userRequest
    ) throws OAuth2AuthenticationException {

        DefaultOAuth2UserService delegate =
                new DefaultOAuth2UserService();

        OAuth2User oauth2User =
                delegate.loadUser(userRequest);

        String email =
                oauth2User.getAttribute("email");

        String name =
                oauth2User.getAttribute("name");

        String googleId =
                oauth2User.getAttribute("sub");

        String profileImage =
                oauth2User.getAttribute("picture");

        if (email == null || email.isBlank()) {

            throw new OAuth2AuthenticationException(
                    "Google account email could not be retrieved."
            );
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseGet(
                                User::new
                        );

        user.setEmail(email);

        if (name != null && !name.isBlank()) {
            user.setName(name);
        } else {
            user.setName(email.split("@")[0]);
        }

        user.setGoogleId(googleId);

        user.setProfileImage(profileImage);

       
        if (user.getPassword() == null) {

            user.setPassword(
                    "{google-oauth-user}"
                            + googleId
            );
        }

        userRepository.save(user);

        return oauth2User;
    }
}

