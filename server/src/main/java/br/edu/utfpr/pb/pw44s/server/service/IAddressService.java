package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Address;

import java.util.List;

// Alem do CRUD, enderecos precisam ser filtrados pelo dono.
public interface IAddressService extends ICrudService<Address, Long> {
    List<Address> findByUserId(Long userId);
}
