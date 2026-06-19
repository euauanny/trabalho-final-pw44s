package br.edu.utfpr.pb.pw44s.server.error;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
// Estrutura padrao enviada ao cliente quando ocorre um erro na API.
public class ApiError {

    // Momento do erro em milissegundos.
    private long timestamp = new Date().getTime();
    private int status;
    private String message;
    private String url;
    // Associa o nome de cada campo a sua mensagem de validacao.
    private Map<String, String> validationErrors;

    public ApiError(int status, String message, String url, Map<String, String> validationErrors) {
        this.status = status;
        this.message = message;
        this.url = url;
        this.validationErrors = validationErrors;
    }

    public ApiError(String message, String url, Integer status) {
        this.message = message;
        this.url = url;
        this.status = status;
    }
}
