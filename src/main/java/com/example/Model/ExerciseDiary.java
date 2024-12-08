package com.example.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ExerciseDiary")
public class ExerciseDiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    private Long id; // Primary key for ExerciseDiary

    @Column(nullable = false)
    private String name; // Name of the exercise

    @Column(nullable = false)
    private String email; // Email will be populated from the session

    @Column(nullable = false)
    private LocalDate date; // Date of the exercise entry

    @Column(nullable = false)
    private double energy; // Energy burned in kcal

    @Column(nullable = false)
    private double protein; // Protein in g

    @Column(nullable = false)
    private double fat; // Fat in g

    @Column(nullable = false)
    private double netCarbs; // Net Carbs in g
    
    public ExerciseDiary() {
    }

    // Constructor
    public ExerciseDiary(String name, String email, LocalDate date, double energy, double protein, double fat, double netCarbs) {
        this.name = name;
        this.email = email;
        this.date = date;
        this.energy = energy;
        this.protein = protein;
        this.fat = fat;
        this.netCarbs = netCarbs;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getEnergy() {
        return energy;
    }

    public void setEnergy(double energy) {
        this.energy = energy;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getNetCarbs() {
        return netCarbs;
    }

    public void setNetCarbs(double netCarbs) {
        this.netCarbs = netCarbs;
    }

    @Override
    public String toString() {
        return "ExerciseDiary [id=" + id + ", name=" + name + ", email=" + email + ", date=" + date + ", energy=" + energy
                + ", protein=" + protein + ", fat=" + fat + ", netCarbs=" + netCarbs + "]";
    }
}
