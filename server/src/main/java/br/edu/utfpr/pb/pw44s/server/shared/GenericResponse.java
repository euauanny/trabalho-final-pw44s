package br.edu.utfpr.pb.pw44s.server.shared;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// Resposta simples usada quando a API precisa devolver apenas uma mensagem.
public class GenericResponse {

    private String message;

}
