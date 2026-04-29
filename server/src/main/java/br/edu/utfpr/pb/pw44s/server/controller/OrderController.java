package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.OrderMapper;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController extends CrudController<Order, OrderDTO, Long> {

    private final OrderMapper orderMapper;

    public OrderController(IOrderService orderService, OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
        OrderController.orderService = orderService;
    }

    private static IOrderService orderService;

    @Override
    protected ICrudService<Order, Long> getService() {
        return orderService;
    }

    @Override
    protected OrderDTO toDto(Order entity) {
        return orderMapper.toDto(entity);
    }

    @Override
    protected Order toEntity(OrderDTO dto) {
        return orderMapper.toEntity(dto);
    }

    @Override
    public ResponseEntity<List<OrderDTO>> findAll() {
        long userId = getCurrentUserId();
        return ResponseEntity.ok(orderService.findByUserId(userId).stream().map(this::toDto).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<OrderDTO> create(OrderDTO entity) {
        long userId = getCurrentUserId();
        entity.setUserId(userId);
        entity.setDate(LocalDateTime.now());
        return super.create(entity);
    }

    private long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user.getId();
    }
}
