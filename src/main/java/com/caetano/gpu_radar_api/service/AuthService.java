package com.caetano.gpu_radar_api.service;

import com.caetano.gpu_radar_api.dto.auth.AuthResponse;
import com.caetano.gpu_radar_api.dto.auth.LoginRequest;
import com.caetano.gpu_radar_api.dto.auth.RegisterRequest;
import com.caetano.gpu_radar_api.entity.UserAccount;
import com.caetano.gpu_radar_api.exception.BusinessRuleException;
import com.caetano.gpu_radar_api.repository.UserAccountRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService customUserDetailsService,
            JwtService jwtService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userAccountRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("Email is already registered.");
        }

        UserAccount userAccount = new UserAccount(
                request.name(),
                request.email(),
                passwordEncoder.encode(request.password()),
                "USER"
        );

        UserAccount savedUser = userAccountRepository.save(userAccount);

        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(savedUser.getEmail());

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserAccount userAccount = userAccountRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessRuleException("Invalid credentials."));

        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(userAccount.getEmail());

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                "Bearer",
                userAccount.getId(),
                userAccount.getName(),
                userAccount.getEmail()
        );
    }
}