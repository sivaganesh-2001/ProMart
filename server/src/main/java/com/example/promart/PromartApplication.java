package com.example.promart;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
@ComponentScan(basePackages = { "com.example.promart", "com.example.promart.controller" })
public class PromartApplication {

    private static final Logger logger = LoggerFactory.getLogger(PromartApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(PromartApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000", "http://localhost:5000", "http://localhost:5001")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }

    @Bean
    public CommandLineRunner logEndpoints(RequestMappingHandlerMapping mapping) {
        return args -> {
            mapping.getHandlerMethods().forEach((info, handler) -> {
                logger.info("Mapped endpoint: {} -> {}", info.getPatternsCondition(), handler);
            });
        };
    }
}