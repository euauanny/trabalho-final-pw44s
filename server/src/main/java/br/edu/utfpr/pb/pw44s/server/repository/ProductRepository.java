package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

// A expressao Category_Id navega no relacionamento e filtra pelo id da categoria.
public interface ProductRepository extends JpaRepository<Product, Long> {
	java.util.List<Product> findByCategory_Id(Long categoryId);
}
