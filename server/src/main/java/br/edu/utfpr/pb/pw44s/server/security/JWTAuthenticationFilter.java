package br.edu.utfpr.pb.pw44s.server.security;

import br.edu.utfpr.pb.pw44s.server.dto.AuthRequestDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.security.dto.AuthenticationResponse;
import br.edu.utfpr.pb.pw44s.server.security.dto.UserResponseDTO;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import tools.jackson.core.exc.StreamReadException;
import tools.jackson.databind.DatabindException;
import tools.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Date;

@NoArgsConstructor
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private AuthenticationManager authenticationManager;
    private AuthService authService;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager,
                                   AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                @NonNull HttpServletResponse response)
                                                throws AuthenticationException {

        try {
            AuthRequestDTO credentials = new AuthRequestDTO();
            User user = new User();
            if (request.getInputStream() != null || request.getInputStream().available() > 0) {
                credentials = new ObjectMapper().readValue(request.getInputStream(), AuthRequestDTO.class);
                user = (User) authService.loadUserByUsername(credentials.getUsername());
            }
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            credentials.getUsername(),
                            credentials.getPassword(),
                            user.getAuthorities()
                    )
            );

        } catch (StreamReadException | DatabindException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(@NonNull HttpServletRequest request,
                                            HttpServletResponse response,
                                            @NonNull FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        User user = (User) authService.loadUserByUsername(authResult.getName());
        String token = JWT.create()
                .withSubject(authResult.getName())
                .withExpiresAt(
                    new Date(System.currentTimeMillis()  + SecurityConstants.EXPIRATION_TIME)
                )
                .sign(Algorithm.HMAC512(SecurityConstants.SECRET));

        response.setContentType("application/json");
        response.getWriter().write(
                new ObjectMapper().writeValueAsString(
                        new AuthenticationResponse(token, new UserResponseDTO(user)))
        );

    }

    @Override
    public AuthenticationSuccessHandler getSuccessHandler() {
        return super.getSuccessHandler();
    }
}
