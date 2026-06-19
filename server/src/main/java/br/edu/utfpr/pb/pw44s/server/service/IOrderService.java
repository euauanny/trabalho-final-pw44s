package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Order;

import java.util.List;

// Acrescenta a busca do historico pertencente a um usuario.
public interface IOrderService extends ICrudService<Order, Long> {
    List<Order> findByUserId(Long userId);
}
