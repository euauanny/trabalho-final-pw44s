package br.edu.utfpr.pb.pw44s.server.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// Representa uma permissao do Spring Security no JSON de resposta.
public class AuthorityResponseDTO {

    private String authority;

}
