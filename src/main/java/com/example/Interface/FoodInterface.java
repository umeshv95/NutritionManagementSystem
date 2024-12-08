package com.example.Interface;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.Model.Food;

public interface FoodInterface extends JpaRepository<Food, String> {
    // Find a food item by its name
    Food findByName(String name);
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Food> findByNameIgnoreCase(@Param("name") String name);
}
