package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.OrderItems;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
// Achata dados do Product dentro do DTO do item de pedido.
public interface OrderItemMapper {

    // product.id e product.name viram campos simples na resposta.
    @org.mapstruct.Mapping(source = "product.id", target = "productId")
    @org.mapstruct.Mapping(source = "product.name", target = "productName")
    OrderItemDTO toDto(OrderItems entity);
}



