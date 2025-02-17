package com.example.promart.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageUploadService {

    private static final String UPLOAD_DIR = "uploads";

    public String uploadImage(MultipartFile file) throws IOException {
        // Ensure the upload directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdir();
        }

        // Generate a unique filename
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, fileName);

        // Save the file locally
        Files.write(filePath, file.getBytes());

        // Convert file path to a URL (assuming a cloud service is not used)
        return "/uploads/" + fileName;
    }
}

