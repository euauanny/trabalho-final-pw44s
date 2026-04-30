package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.OrderItems;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface OrderItemMapper {

    @org.mapstruct.Mapping(source = "product.id", target = "productId")
    @org.mapstruct.Mapping(source = "product.name", target = "productName")
    OrderItemDTO toDto(OrderItems entity);
}



