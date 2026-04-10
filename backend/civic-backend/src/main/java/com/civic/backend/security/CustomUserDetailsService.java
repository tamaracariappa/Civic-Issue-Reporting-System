package com.civic.backend.security;

import com.civic.backend.model.User;
import com.civic.backend.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userIdText) throws UsernameNotFoundException {
        Integer userId;
        try {
            userId = Integer.valueOf(userIdText);
        } catch (NumberFormatException ex) {
            throw new UsernameNotFoundException("Invalid user id in token");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        return new org.springframework.security.core.userdetails.User(
                user.getUserId().toString(),
                "",
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserRole().toUpperCase()))
        );
    }
}
