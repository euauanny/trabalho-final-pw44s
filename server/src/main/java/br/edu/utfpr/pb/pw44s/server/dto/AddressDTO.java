package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {

    private Long id;

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
