package com.example.promart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.NoArgsConstructor;


@Document(collection = "product_categories")
@NoArgsConstructor
public class ProductCategory {
    @Id
    private String id;



    private String topCategory; // Name of the top-level category
    private String name; // Product category name

    public ProductCategory(String topCategory, String name, String id) {
        this.topCategory = topCategory;
        this.id =id;
        this.name = name;
    }
    public ProductCategory(String topCategory, String name) {
        this.topCategory = topCategory;
        this.name = name;
    }

    public ProductCategory(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getTopCategory() {
        return topCategory;
    }


    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }

}
