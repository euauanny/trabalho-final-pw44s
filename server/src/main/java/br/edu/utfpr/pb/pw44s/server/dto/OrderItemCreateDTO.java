package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
//cada item que o cliente envia no checkout
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemCreateDTO {
    private Long productId;
    private Integer quantity;
}

