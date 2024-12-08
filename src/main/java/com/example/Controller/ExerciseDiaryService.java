package com.example.Controller;

import com.example.Model.ExerciseDiary;
import com.example.Interface.ExerciseDiaryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/exercisediary")
@CrossOrigin(origins = "http://localhost:3000") // Adjust based on your frontend URL
public class ExerciseDiaryService {

    @Autowired
    private ExerciseDiaryInterface exerciseDiaryRepository;

    // Add an exercise item to the diary using request body
    @PostMapping("/add")
    public ExerciseDiary addExerciseItem(@RequestBody ExerciseDiary exerciseDiary, @RequestHeader("email") String email) {
        // Validate the 'Name' field
        if (exerciseDiary.getName() == null || exerciseDiary.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }

        exerciseDiary.setEmail(email); // Set the email from the session
        exerciseDiary.setDate(LocalDate.now()); // Set the current date

        // Save the exercise diary entry to the repository
        return exerciseDiaryRepository.save(exerciseDiary);
    }

    // Get all exercise items for the logged-in user
    @GetMapping("/list")
    public List<ExerciseDiary> getUserExerciseDiary(@RequestHeader("email") String email) {
        return exerciseDiaryRepository.findByEmail(email);
    }

    // Get exercise items for the logged-in user on a specific date
    @GetMapping("/list/{date}")
    public List<ExerciseDiary> getUserExerciseDiaryByDate(@RequestHeader("email") String email, @PathVariable String date) {
        LocalDate queryDate = LocalDate.parse(date);
        return exerciseDiaryRepository.findByEmailAndDate(email, queryDate);
    }

    // Add an exercise item programmatically via API
    @PostMapping("/save")
    public String saveExerciseEntry(
            @RequestParam String name,           // Exercise name as String
            @RequestParam double energy,         // Energy burned in kcal
            @RequestParam double protein,        // Protein in g
            @RequestParam double fat,            // Fat in g
            @RequestParam double netCarbs,       // Net Carbs in g
            @RequestHeader("email") String sessionEmail) {  // Email from header

        // Creating a new ExerciseDiary object with the correct types
        ExerciseDiary exerciseDiary = new ExerciseDiary(
                name,                // Exercise name
                sessionEmail,        // Email from session
                LocalDate.now(),     // Today's date
                energy,              // Energy burned (double)
                protein,             // Protein burned (double)
                fat,                 // Fat burned (double)
                netCarbs             // Net Carbs burned (double)
        );

        // Saving the exercise entry to the repository
        exerciseDiaryRepository.save(exerciseDiary);

        // Returning a success message
        return "Exercise entry saved successfully!";
    }

    // Delete an exercise item by ID
    @DeleteMapping("/delete/{id}")
    public String deleteExerciseItem(@PathVariable Long id, @RequestHeader("email") String email) {
        Optional<ExerciseDiary> exerciseDiary = exerciseDiaryRepository.findById(id);
        if (exerciseDiary.isPresent() && exerciseDiary.get().getEmail().equals(email)) {
            exerciseDiaryRepository.deleteById(id);
            return "Exercise item deleted successfully!";
        } else {
            return "Exercise item not found or unauthorized!";
        }
    }

    // Get details of a specific exercise item by ID
    @GetMapping("/details/{id}")
    public ExerciseDiary getExerciseItemDetails(@PathVariable Long id, @RequestHeader("email") String email) {
        Optional<ExerciseDiary> exerciseDiary = exerciseDiaryRepository.findById(id);
        if (exerciseDiary.isPresent() && exerciseDiary.get().getEmail().equals(email)) {
            return exerciseDiary.get();
        } else {
            throw new IllegalArgumentException("Exercise item not found or unauthorized!");
        }
    }

    // Update the exercise item's attributes like quantity, energy, etc.
    @PutMapping("/update/{id}")
    public ResponseEntity<ExerciseDiary> updateExerciseItem(@PathVariable Long id, @RequestBody Map<String, Object> updateData) {
        Optional<ExerciseDiary> optionalExerciseItem = exerciseDiaryRepository.findById(id);
        if (optionalExerciseItem.isPresent()) {
            ExerciseDiary exerciseItem = optionalExerciseItem.get();
            
            if (updateData.containsKey("energy")) {
                exerciseItem.setEnergy((Double) updateData.get("energy"));
            }
            if (updateData.containsKey("protein")) {
                exerciseItem.setProtein((Double) updateData.get("protein"));
            }
            if (updateData.containsKey("fat")) {
                exerciseItem.setFat((Double) updateData.get("fat"));
            }
            if (updateData.containsKey("netCarbs")) {
                exerciseItem.setNetCarbs((Double) updateData.get("netCarbs"));
            }
            exerciseDiaryRepository.save(exerciseItem);
            return ResponseEntity.ok(exerciseItem);
        }
        return ResponseEntity.notFound().build();
    }

    // Get stats (total energy, protein, fat, net carbs) for a specific date
    @GetMapping("/stats/{date}")
    public ResponseEntity<Map<String, Double>> getExerciseDiaryStatsByDate(
            @RequestHeader("email") String email,
            @PathVariable String date) {
        LocalDate queryDate = LocalDate.parse(date);
        List<ExerciseDiary> exerciseDiaryList = exerciseDiaryRepository.findByEmailAndDate(email, queryDate);

        double totalEnergy = 0;
        double totalProtein = 0;
        double totalFat = 0;
        double totalNetCarbs = 0;

        for (ExerciseDiary item : exerciseDiaryList) {
            totalEnergy += item.getEnergy();
            totalProtein += item.getProtein();
            totalFat += item.getFat();
            totalNetCarbs += item.getNetCarbs();
        }

        Map<String, Double> stats = Map.of(
                "totalEnergy", totalEnergy,
                "totalProtein", totalProtein,
                "totalFat", totalFat,
                "totalNetCarbs", totalNetCarbs
        );

        return ResponseEntity.ok(stats);
    }
    @GetMapping("/exercisestats")
    public ResponseEntity<Map<String, Double>> getExerciseDiaryStats(
            @RequestHeader("email") String email) {
        List<ExerciseDiary> exerciseDiaryList = exerciseDiaryRepository.findByEmail(email);

        double totalEnergy = 0;
        double totalProtein = 0;
        double totalFat = 0;
        double totalNetCarbs = 0;

        for (ExerciseDiary item : exerciseDiaryList) {
            totalEnergy += item.getEnergy();
            totalProtein += item.getProtein();
            totalFat += item.getFat();
            totalNetCarbs += item.getNetCarbs();
        }

        Map<String, Double> stats = Map.of(
                "totalEnergy", totalEnergy,
                "totalProtein", totalProtein,
                "totalFat", totalFat,
                "totalNetCarbs", totalNetCarbs
        );

        return ResponseEntity.ok(stats);
    }

}
