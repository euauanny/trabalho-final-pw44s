package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/*
 * Controller generico que concentra as rotas CRUD comuns.
 * T representa a entidade, D representa o DTO e ID representa o tipo da chave primaria.
 * Os controllers concretos informam qual service e qual mapper devem ser usados.
 */
public abstract class CrudController<T, D, ID extends Serializable> {

    // Retorna a camada de servico responsavel pela entidade.
    protected abstract ICrudService<T, ID> getService();

    // Converte uma entidade do banco para o DTO enviado ao cliente.
    protected abstract D toDto(T entity);

    // Converte o DTO recebido em uma entidade que pode ser persistida.
    protected abstract T toEntity(D dto);

    private D convertToDto(T entity) {
        return toDto(entity);
    }

    private T convertToEntity(D entityDto) {
        return toEntity(entityDto);
    }

    // Lista todos os registros da entidade.
    @GetMapping
    public ResponseEntity<List<D>> findAll() {
        return ResponseEntity.ok(getService().findAll().stream().map(this::convertToDto).collect(Collectors.toList()));
    }

    // Lista registros com paginacao e ordenacao opcionais.
    @GetMapping("page")
    public ResponseEntity<Page<D>> findAll(@RequestParam int page,
                                           @RequestParam int size,
                                           @RequestParam(required = false) String order,
                                           @RequestParam(required = false) Boolean asc) {
        PageRequest pageRequest = PageRequest.of(page, size);
        if (order != null && asc != null) {
            pageRequest = PageRequest.of(page, size, asc ? Sort.Direction.ASC : Sort.Direction.DESC, order);
        }
        return ResponseEntity.ok(getService().findAll(pageRequest).map(this::convertToDto));
    }

    @GetMapping("{id}")
    public ResponseEntity<D> findOne(@PathVariable ID id) {
        T entity = getService().findById(id);
        if (entity != null) {
            return ResponseEntity.ok(convertToDto(entity));
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<D> create(@RequestBody @Valid D entity) {
        // @Valid executa as validacoes declaradas no DTO antes de salvar.
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(getService().save(convertToEntity(entity))));

    }

    @PutMapping("{id}")
    public ResponseEntity<D> update(@PathVariable ID id, @RequestBody @Valid D entity) {
        // O DTO deve conter o id correto para que o JPA atualize em vez de inserir.
        return ResponseEntity.status(HttpStatus.OK).body(convertToDto(getService().save(convertToEntity(entity))));
    }

    @GetMapping("exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable ID id) {
        return ResponseEntity.ok(getService().exists(id));
    }

    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(getService().count());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        // 204 informa que a exclusao ocorreu e nao existe corpo na resposta.
        getService().deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
