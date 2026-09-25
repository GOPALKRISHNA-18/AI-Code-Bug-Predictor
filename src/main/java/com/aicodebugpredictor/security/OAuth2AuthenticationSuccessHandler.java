package com.aicodebugpredictor.security;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
@Component
public class OAuth2AuthenticationSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    public OAuth2AuthenticationSuccessHandler(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();

        String email =
                oauth2User.getAttribute("email");

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Google user account not found"
                                        )
                        );

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        String name =
                user.getName() == null
                        ? ""
                        : user.getName();

        String encodedToken =
                URLEncoder.encode(
                        token,
                        StandardCharsets.UTF_8
                );

        String encodedName =
                URLEncoder.encode(
                        name,
                        StandardCharsets.UTF_8
                );

        String encodedEmail =
                URLEncoder.encode(
                        user.getEmail(),
                        StandardCharsets.UTF_8
                );

        String redirectUrl =
                "http://localhost:5173/oauth2/success"
                        + "?token="
                        + encodedToken
                        + "&userId="
                        + user.getId()
                        + "&name="
                        + encodedName
                        + "&email="
                        + encodedEmail;

        getRedirectStrategy().sendRedirect(
                request,
                response,
                redirectUrl
        );
    }
}

