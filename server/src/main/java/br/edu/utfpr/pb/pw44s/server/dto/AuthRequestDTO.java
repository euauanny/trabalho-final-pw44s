package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;

@Data
// Formato do JSON enviado pelo frontend para realizar o login.
public class AuthRequestDTO {

    private String username;

    private String password;
}
