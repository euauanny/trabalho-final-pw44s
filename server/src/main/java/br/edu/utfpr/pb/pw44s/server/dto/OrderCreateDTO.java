package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Dados enviados pelo cliente para finalizar uma compra.
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateDTO {
    // O backend consulta cada produto e calcula o total; o cliente envia apenas id e quantidade.
    private List<OrderItemCreateDTO> items;
    // Identifica o endereco escolhido no checkout.
    private Long addressId;
}

