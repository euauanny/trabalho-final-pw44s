package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_address")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
// Entidade JPA que representa um endereco armazenado em tb_address.
public class Address {

    // IDENTITY deixa o banco gerar um id numerico a cada insercao.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Guarda o dono do endereco sem expor essa escolha ao frontend.
    @NotNull
    private Long userId;

    @NotNull
    private String logradouro;

    @NotNull
    private String complemento;

    @NotNull
    private String numero;

    @NotNull
    private String bairro;

    @NotNull
    private String cep;

}
