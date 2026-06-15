package com.caetano.gpu_radar_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI gpuRadarOpenAPI() {
        return new OpenAPI()
                .info(
                        new Info()
                                .title("GPU Radar API")
                                .description("""
                                        API for searching and comparing GPU prices
                                        from multiple online stores.
                                        """)
                                .version("1.0.0")
                                .contact(
                                        new Contact()
                                                .name("Gabriel Caetano")
                                                .email("caetanoog@outlook.com")
                                )
                );
    }
}