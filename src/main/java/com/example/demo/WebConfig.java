package com.example.demo;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") 
            .allowedOrigins("http://localhost:3000") // Allow only your frontend app origin
            .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow these HTTP methods
            .allowedHeaders("*") // Allow all headers
            .allowCredentials(true); // If you need to handle cookies/session
    }
}
