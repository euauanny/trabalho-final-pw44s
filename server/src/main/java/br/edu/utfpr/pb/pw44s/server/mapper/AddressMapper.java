package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
// O MapStruct gera a conversao entre Address e AddressDTO na compilacao.
public interface AddressMapper {

    Address toEntity(AddressDTO dto);

    AddressDTO toDto(Address entity);
}
