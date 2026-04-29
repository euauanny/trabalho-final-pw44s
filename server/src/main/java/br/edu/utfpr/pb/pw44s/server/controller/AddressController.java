package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.AddressMapper;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("addresses")
public class AddressController extends CrudController<Address, AddressDTO, Long> {

    private final AddressMapper addressMapper;

    public AddressController(IAddressService addressService, AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
        AddressController.addressService = addressService;
    }

    private static IAddressService addressService;

    @Override
    protected ICrudService<Address, Long> getService() {
        return addressService;
    }

    @Override
    protected AddressDTO toDto(Address entity) {
        return addressMapper.toDto(entity);
    }

    @Override
    protected Address toEntity(AddressDTO dto) {
        return addressMapper.toEntity(dto);
    }

    @Override
    public ResponseEntity<List<AddressDTO>> findAll() {
        long userId = getCurrentUserId();
        return ResponseEntity.ok(addressService.findByUserId(userId).stream().map(this::toDto).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<AddressDTO> create(AddressDTO entity) {
        long userId = getCurrentUserId();
        entity.setUserId(userId);
        return super.create(entity);
    }

    private long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user.getId();
    }
}
