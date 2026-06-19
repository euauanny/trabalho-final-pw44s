package br.edu.utfpr.pb.pw44s.server.model;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_order_items")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
// Entidade associativa que registra produto, quantidade e preco dentro de um pedido.
public class OrderItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    // Muitos itens pertencem ao mesmo pedido.
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;

    @ManyToOne
    // Muitos itens podem apontar para o mesmo produto do catalogo.
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    // O preco e salvo no item para preservar o valor praticado no momento da compra.
    @NotNull
    private BigDecimal price;

    @NotNull
    private Integer quantity;

}
