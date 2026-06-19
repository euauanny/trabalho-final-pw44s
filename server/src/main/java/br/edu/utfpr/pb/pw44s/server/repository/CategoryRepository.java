package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

// O Spring Data cria automaticamente as operacoes de banco para Category.
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
