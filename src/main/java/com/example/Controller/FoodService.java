package com.example.Controller;

import com.example.Model.Food;
import com.example.Interface.FoodInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/food")
public class FoodService {

    @Autowired
    private FoodInterface foodRepository;

    // Asynchronous method to add food item
    @PostMapping
    @Async
    public CompletableFuture<ResponseEntity<?>> addFood(@RequestParam String name,
                                                        @RequestParam String description,
                                                        @RequestParam MultipartFile image,
                                                        @RequestParam double energy,
                                                        @RequestParam double protein,
                                                        @RequestParam double fat,
                                                        @RequestParam double netCarbs) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                byte[] imageBytes = image.getBytes();

                // Create and save food item
                Food food = new Food();
                food.setName(name);
                food.setDescription(description);
                food.setImage(imageBytes);
                food.setEnergy(energy);
                food.setProtein(protein);
                food.setFat(fat);
                food.setNetCarbs(netCarbs);

                Food savedFood = foodRepository.save(food);
                return ResponseEntity.ok(savedFood);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error saving food item: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to edit food item
    @PutMapping("/{name}")
    @Async
    public CompletableFuture<ResponseEntity<?>> editFood(@PathVariable String name,
                                                         @RequestParam(required = false) String description,
                                                         @RequestParam(required = false) MultipartFile image,
                                                         @RequestParam(required = false) Double energy,
                                                         @RequestParam(required = false) Double protein,
                                                         @RequestParam(required = false) Double fat,
                                                         @RequestParam(required = false) Double netCarbs) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Food food = foodRepository.findByName(name);
                if (food == null) {
                    return ResponseEntity.status(404).body("Food item not found");
                }

                if (description != null) food.setDescription(description);
                if (image != null && !image.isEmpty()) food.setImage(image.getBytes());
                if (energy != null) food.setEnergy(energy);
                if (protein != null) food.setProtein(protein);
                if (fat != null) food.setFat(fat);
                if (netCarbs != null) food.setNetCarbs(netCarbs);

                Food updatedFood = foodRepository.save(food);
                return ResponseEntity.ok(updatedFood);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error updating food item: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to get all food items
    @GetMapping("/all")
    @Async
    public CompletableFuture<ResponseEntity<?>> getAllFoodItems() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Food> foodList = foodRepository.findAll();
                if (foodList.isEmpty()) {
                    return ResponseEntity.status(404).body("No food items found");
                }
                return ResponseEntity.ok(foodList);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error retrieving food items: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to get food image
    @GetMapping("/{name}/image")
    @Async
    public CompletableFuture<ResponseEntity<?>> getFoodImage(@PathVariable String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Food food = foodRepository.findByName(name);
                if (food == null) {
                    return ResponseEntity.status(404).body("Food item not found");
                }

                byte[] imageBytes = food.getImage();
                String contentType = "image/jpeg";

                if (imageBytes.length > 1) {
                    if (imageBytes[0] == (byte) 0x89 && imageBytes[1] == (byte) 0x50) {
                        contentType = "image/png";
                    } else if (imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
                        contentType = "image/jpeg";
                    }
                }

                HttpHeaders headers = new HttpHeaders();
                headers.set("Content-Type", contentType);
                return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error retrieving food image: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to delete a food item
    @DeleteMapping("/{name}")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteFood(@PathVariable String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Food food = foodRepository.findByName(name);
                if (food == null) {
                    return ResponseEntity.status(404).body("Food item not found");
                }

                foodRepository.delete(food);
                return ResponseEntity.status(200).body("Food item deleted successfully");
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error deleting food item: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to search for a food item by name
    @GetMapping("/search")
    @Async
    public CompletableFuture<ResponseEntity<?>> searchFoodByName(@RequestParam String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Use the case-insensitive method from the repository
                List<Food> foods = foodRepository.findByNameIgnoreCase(name);
                
                if (foods.isEmpty()) {
                    return ResponseEntity.status(404).body("No food items found matching the search query");
                }
                
                return ResponseEntity.ok(foods);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error searching for food items: " + e.getMessage());
            }
        });
    }
}
