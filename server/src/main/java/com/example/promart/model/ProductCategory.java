package com.example.promart.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "product_categories")
public class ProductCategory {
    @Id
    private String id;
    private String topCategory; // Name of the top-level category
    private String name; // Product category name

    
    public ProductCategory(String id, String topCategory, String name) {
        this.id = id;
        this.topCategory = topCategory;
        this.name = name;
    }

}
