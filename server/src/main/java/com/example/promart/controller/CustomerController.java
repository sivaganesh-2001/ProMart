package com.example.promart.controller;

import com.example.promart.model.Customer;
import com.example.promart.repository.CustomerRepository;
import com.example.promart.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to call API
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCustomerCount() {
        long count = customerRepository.count();
        return ResponseEntity.ok(count);
    }


    @PostMapping("/save")
    public String saveCustomer(@RequestBody Map<String, String> requestData) {
        String customerName = requestData.get("customerName");
        String customerEmail = requestData.get("customerEmail");

        if (customerEmail == null || customerEmail.isEmpty()) {
            return "Error: customerEmail is required";
        }

        customerService.saveOrUpdateCustomer(customerName, customerEmail);
        return "Customer saved successfully";
    }

     @PostMapping
    public Customer registerCustomer(@RequestBody Customer customer) {
        return customerService.saveCustomer(customer);
    }

    //@PostMapping
    // public Customer createCustomer(@RequestBody Customer customer) {
    //     return customerService.createCustomer(customer);
    // }


      @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }
    
    

    

    @GetMapping("/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        Customer customer = customerService.getCustomerByEmail(email);
        return customer != null ? ResponseEntity.ok(customer) : ResponseEntity.notFound().build();
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }
}
