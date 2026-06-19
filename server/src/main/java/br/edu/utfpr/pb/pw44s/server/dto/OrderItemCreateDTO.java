package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Forma reduzida de um item enviado no checkout.
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemCreateDTO {
    // O preco e o nome nao sao confiados ao cliente; serao lidos do banco.
    private Long productId;
    private Integer quantity;
}

