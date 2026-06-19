package br.edu.utfpr.pb.pw44s.server.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_user")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter @Setter
// Entidade de usuario e implementacao exigida pelo Spring Security para autenticacao.
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Size(min = 4, max = 50)
    @Column(length = 50, unique = true)
    private String username;

    @NotNull
    @Size(min = 4, max = 50)
    @Column(length = 50, name = "display_name")
    private String displayName;

    @NotNull
    @Size(min = 6)
    // Exige pelo menos uma minuscula, uma maiuscula e um numero.
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$")
    private String password;

    @NotNull
    @Column(length = 100, unique = true)
    private String email;

    @Override
    @Transient
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Todos os usuarios cadastrados recebem a permissao ROLE_USER.
        return AuthorityUtils.createAuthorityList("ROLE_USER");
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isAccountNonExpired() {
        // O sistema nao implementa expiracao de conta.
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isAccountNonLocked() {
        // O sistema nao implementa bloqueio de conta.
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        // O sistema nao implementa expiracao de senha.
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isEnabled() {
        // Toda conta cadastrada fica habilitada imediatamente.
        return true;
    }

}
