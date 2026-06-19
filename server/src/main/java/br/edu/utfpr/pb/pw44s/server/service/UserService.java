package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
// Contem as regras de negocio usadas no cadastro de usuario.
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User save(User user) {
        // Username e email sao unicos; a verificacao gera erro antes de salvar.
        if (this.userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalStateException("Usuario ja cadastrado");
        }

        if (this.userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("Email ja cadastrado");
        }

        // A senha nunca e armazenada em texto puro.
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return this.userRepository.save(user);
    }
}
