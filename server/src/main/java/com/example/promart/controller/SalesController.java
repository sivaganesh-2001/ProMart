package com.example.promart.controller;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import com.example.promart.model.Sales;
import com.example.promart.repository.SalesRepository;
@RestController
@RequestMapping("/api/sales")
public class SalesController {
    private  SalesRepository salesRepository;

    public SalesController(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }

    @GetMapping("/fast-moving")
    public List<Sales> getSalesData(@RequestParam String sellerId, @RequestParam String period) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        switch (period) {
            case "day":
                start = end.minus(1, ChronoUnit.DAYS);
                break;
            case "week":
                start = end.minus(1, ChronoUnit.WEEKS);
                break;
            case "month":
                start = end.minus(1, ChronoUnit.MONTHS);
                break;
            default:
                throw new IllegalArgumentException("Invalid period: Choose 'day', 'week', or 'month'");
        }

        return salesRepository.findBySellerIdAndTimestampBetween(sellerId, start, end);
    }
}
