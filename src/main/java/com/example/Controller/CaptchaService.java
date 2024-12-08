package com.example.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/captcha")
public class CaptchaService {

    @GetMapping("/generate")
    public ResponseEntity<Map<String, String>> generateCaptcha() {
        Map<String, String> response = new HashMap<>();
        String captcha = generateRandomCaptcha();
        response.put("captcha", captcha);
        return ResponseEntity.ok(response);
    }

    private String generateRandomCaptcha() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder captcha = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) { // Generate a 6-character captcha
            captcha.append(chars.charAt(random.nextInt(chars.length())));
        }
        return captcha.toString();
    }
}