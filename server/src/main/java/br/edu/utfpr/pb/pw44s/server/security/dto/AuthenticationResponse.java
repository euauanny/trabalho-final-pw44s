package br.edu.utfpr.pb.pw44s.server.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
// Corpo devolvido ao frontend depois de um login bem-sucedido.
public class AuthenticationResponse {

    // Token enviado nas proximas requisicoes protegidas.
    private String token;
    // Dados basicos do usuario, sem incluir sua senha.
    private UserResponseDTO user;

}
