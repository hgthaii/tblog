import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadApiController {

	private static final Logger log = LoggerFactory.getLogger(UploadApiController.class);

	private static final String UPLOAD_DIR = "uploads";

	@PostMapping
	public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "Please select a file to upload"));
		}

		try {
			// Create upload directory if it doesn't exist
			Path uploadPath = Paths.get(UPLOAD_DIR);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			// Generate unique filename
			String originalFilename = file.getOriginalFilename();
			String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
			String filename = UUID.randomUUID().toString() + extension;

			// Save the file
			Path filePath = uploadPath.resolve(filename);
			Files.copy(file.getInputStream(), filePath);

			log.info("File uploaded: {}", filename);

			// Return the URL (assuming backend runs on 8080)
			String fileUrl = "http://localhost:8080/uploads/" + filename;
			return ResponseEntity.ok(Map.of("url", fileUrl));

		} catch (IOException e) {
			log.error("Failed to upload file", e);
			return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload file"));
		}
	}
}
