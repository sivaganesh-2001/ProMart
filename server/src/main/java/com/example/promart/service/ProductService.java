package com.example.promart.service;

import com.example.promart.model.Product;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface ProductService {
    // public Product addProduct(Product product, String sellerId);
    List<Product> getAllProducts();

    Product getProductById(String id);

    public boolean deleteProduct(String productId, String sellerEmail);

    public Product createProduct(Product product);

    public List<Product> getProductsBySellerId(String sellerId);

    public List<Product> searchProducts(String query);

    public Product updateProduct(String productId, Product updatedProduct);

    public List<Product> getPopularProducts();

    public void reduceStock(Map<String, Integer> productQuantities);
    // public List<Product> searchProducts(String shopId, String query) ;
}
