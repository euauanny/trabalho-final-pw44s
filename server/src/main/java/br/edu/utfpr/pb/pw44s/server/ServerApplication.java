package br.edu.utfpr.pb.pw44s.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

	// Ponto de entrada da API. Inicializa o Spring e todos os componentes da aplicacao.
	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}
