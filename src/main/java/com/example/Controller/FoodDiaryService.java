package com.example.Controller;

import com.example.Model.FoodDairy;

import jakarta.servlet.http.HttpSession;

import com.example.Interface.FoodDiaryInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/fooddiary")
@CrossOrigin(origins = "http://localhost:3000") // Adjust based on your frontend URL
public class FoodDiaryService {

	@Autowired
	private FoodDiaryInterface foodDiaryRepository;

	@PostMapping("/add")
	public FoodDairy addFoodItem(@RequestBody FoodDairy foodDiary, @RequestHeader("email") String email) {
		foodDiary.setEmail(email);
		LocalDate currentDate = LocalDate.now(ZoneId.systemDefault());
		foodDiary.setDate(currentDate);
		System.out.println("Adding food item with date: " + currentDate);
		return foodDiaryRepository.save(foodDiary);
	}

	@GetMapping("/list/{date}")
	public List<FoodDairy> getUserFoodDiaryByDate(@RequestHeader("email") String email, @PathVariable String date) {
		LocalDate queryDate = LocalDate.parse(date);
		System.out.println("Querying food diary for date: " + queryDate);
		return foodDiaryRepository.findByEmailAndDate(email, queryDate);
	}

	@GetMapping("/list")
	public List<FoodDairy> getUserFoodDiary(@RequestHeader("email") String email) {
		return foodDiaryRepository.findByEmail(email);
	}

	@PostMapping("/save")
	public String saveFoodEntry(@RequestParam String name, @RequestParam double energy, @RequestParam double protein,
			@RequestParam double fat, @RequestParam double netCarbs,
			@RequestParam(defaultValue = "0.0") double quantity, // Make quantity optional, default value is 0.0
			@RequestHeader("email") String sessionEmail) {

		FoodDairy foodDiary = new FoodDairy(sessionEmail, LocalDate.now(), name, energy, protein, fat, netCarbs,
				quantity // If not provided, quantity will default to 0.0
		);
		foodDiaryRepository.save(foodDiary);
		return "Food entry saved successfully!";
	}

	// Delete a food item by ID
	@DeleteMapping("/delete/{id}")
	public String deleteFoodItem(@PathVariable Long id, @RequestHeader("email") String email) {
		Optional<FoodDairy> foodDiary = foodDiaryRepository.findById(id);
		if (foodDiary.isPresent() && foodDiary.get().getEmail().equals(email)) {
			foodDiaryRepository.deleteById(id);
			return "Food item deleted successfully!";
		} else {
			return "Food item not found or unauthorized!";
		}
	}

	// Get details of a specific food item by ID
	@GetMapping("/details/{id}")
	public FoodDairy getFoodItemDetails(@PathVariable Long id, @RequestHeader("email") String email) {
		Optional<FoodDairy> foodDiary = foodDiaryRepository.findById(id);
		if (foodDiary.isPresent() && foodDiary.get().getEmail().equals(email)) {
			return foodDiary.get();
		} else {
			throw new IllegalArgumentException("Food item not found or unauthorized!");
		}
	}

	@PutMapping("/fooddiary/update/{id}")
	public ResponseEntity<FoodDairy> updateFoodItemQuantity(@PathVariable Long id,
			@RequestBody Map<String, Object> updateData) {
		Optional<FoodDairy> optionalFoodItem = foodDiaryRepository.findById(id);
		if (optionalFoodItem.isPresent()) {
			FoodDairy foodItem = optionalFoodItem.get();
			if (updateData.containsKey("quantity")) {
				foodItem.setQuantity((Double) updateData.get("quantity"));
				foodDiaryRepository.save(foodItem);
				return ResponseEntity.ok(foodItem);
			}
			return ResponseEntity.badRequest().body(null);
		}
		return ResponseEntity.notFound().build();
	}

	@GetMapping("/stats/{date}")
	public ResponseEntity<Map<String, Double>> getFoodDiaryStatsByDate(@RequestHeader("email") String email,
			@PathVariable String date) {
		LocalDate queryDate = LocalDate.parse(date);
		List<FoodDairy> foodDiaryList = foodDiaryRepository.findByEmailAndDate(email, queryDate);

		double totalEnergy = 0;
		double totalProtein = 0;
		double totalFat = 0;
		double totalNetCarbs = 0;

		for (FoodDairy item : foodDiaryList) {
			totalEnergy += item.getEnergy();
			totalProtein += item.getProtein();
			totalFat += item.getFat();
			totalNetCarbs += item.getNetCarbs();
		}

		Map<String, Double> stats = Map.of("totalEnergy", totalEnergy, "totalProtein", totalProtein, "totalFat",
				totalFat, "totalNetCarbs", totalNetCarbs);

		return ResponseEntity.ok(stats);
	}

	@GetMapping("/foodstats")
	public ResponseEntity<Map<String, Double>> getFoodDiaryStats(@RequestHeader("email") String email) {
	    List<FoodDairy> foodDiaryList = foodDiaryRepository.findByEmail(email);

	    double totalEnergy = 0;
	    double totalProtein = 0;
	    double totalFat = 0;
	    double totalNetCarbs = 0;

	    for (FoodDairy item : foodDiaryList) {
	        totalEnergy += item.getEnergy();
	        totalProtein += item.getProtein();
	        totalFat += item.getFat();
	        totalNetCarbs += item.getNetCarbs();
	    }

	    Map<String, Double> stats = Map.of("totalEnergy", totalEnergy, "totalProtein", totalProtein, "totalFat",
	            totalFat, "totalNetCarbs", totalNetCarbs);

	    return ResponseEntity.ok(stats);
	}
}
