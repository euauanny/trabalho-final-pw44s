package br.edu.utfpr.pb.pw44s.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.utfpr.pb.pw44s.server.model.OrderItems;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Long> {
    
}
