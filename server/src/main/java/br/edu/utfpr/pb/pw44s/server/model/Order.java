package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_order")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter @Setter
// Entidade que representa um pedido completo realizado por um usuario.
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private java.time.LocalDateTime date;

    @NotNull
    private long userId;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    // Salvar/excluir o pedido propaga a operacao para seus itens.
    private java.util.List<OrderItems> items;

    // Total calculado no checkout a partir dos precos registrados nos itens.
    private java.math.BigDecimal total;
}
