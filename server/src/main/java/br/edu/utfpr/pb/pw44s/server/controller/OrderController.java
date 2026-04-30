package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderCreateDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemCreateDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.OrderMapper;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.model.OrderItems;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController extends CrudController<Order, OrderDTO, Long> {

    private final OrderMapper orderMapper;
    private final ProductRepository productRepository;

    public OrderController(IOrderService orderService, OrderMapper orderMapper, ProductRepository productRepository) {
        this.orderMapper = orderMapper;
        this.productRepository = productRepository;
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
        // Not used: prefer create with items via POST /orders
        long userId = getCurrentUserId();
        entity.setUserId(userId);
        entity.setDate(LocalDateTime.now());
        return super.create(entity);
    }

    // New endpoint handler for creating an order with items
    @PostMapping("checkout")
    public ResponseEntity<OrderDTO> createCheckout(@RequestBody OrderCreateDTO createDTO) {
        long userId = getCurrentUserId();
        Order order = new Order();
        order.setUserId(userId);
        order.setDate(LocalDateTime.now());

        java.util.List<OrderItems> items = new java.util.ArrayList<>();
        java.math.BigDecimal total = java.math.BigDecimal.ZERO;

        if (createDTO.getItems() == null || createDTO.getItems().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        for (OrderItemCreateDTO it : createDTO.getItems()) {
            if (it.getProductId() == null || it.getQuantity() == null || it.getQuantity() <= 0) {
                return ResponseEntity.badRequest().build();
            }
            Product product = productRepository.findById(it.getProductId()).orElse(null);
            if (product == null) {
                return ResponseEntity.badRequest().build();
            }
            OrderItems oi = OrderItems.builder()
                    .product(product)
                    .price(product.getPrice())
                    .quantity(it.getQuantity())
                    .build();
            oi.setOrder(order);
            items.add(oi);

            total = total.add(product.getPrice().multiply(new java.math.BigDecimal(it.getQuantity())));
        }

        order.setItems(items);
        order.setTotal(total);

        Order saved = orderService.save(order);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(orderMapper.toDto(saved));
    }

    private long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user.getId();
    }
}
