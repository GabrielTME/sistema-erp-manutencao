package com.seuorg.manutencao.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cria o caminho absoluto para a pasta "imagens" na raiz do projeto
        Path uploadDir = Paths.get("./imagens");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // Libera o acesso: /imagens/** -> pasta física no disco
        registry.addResourceHandler("/imagens/**")
                .addResourceLocations("file:/" + uploadPath + "/");
    }
}
