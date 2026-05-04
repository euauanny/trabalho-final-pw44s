package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User save(User user) {
        // verifica se já existe usuário com o mesmo email
        if (this.userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("Email já cadastrado");
        }

        user.setPassword( passwordEncoder.encode(user.getPassword()) );
        return this.userRepository.save(user);
    }

}
