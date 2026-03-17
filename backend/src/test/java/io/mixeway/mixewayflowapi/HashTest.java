package io.mixeway.mixewayflowapi;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashTest {
    @Test
    public void testHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH_MATCH_ADMIN=" + encoder.matches("admin", "$2a$12$XJjJYh1oVX33kPiS/JShlebp8WjRSl4.FsW9R5hBWt2IWzAtpCyQi"));
        System.out.println("HASH_MATCH_ADMIN123=" + encoder.matches("admin123", "$2a$12$XJjJYh1oVX33kPiS/JShlebp8WjRSl4.FsW9R5hBWt2IWzAtpCyQi"));
        System.out.println("HASH_MATCH_PASSWORD=" + encoder.matches("password", "$2a$12$XJjJYh1oVX33kPiS/JShlebp8WjRSl4.FsW9R5hBWt2IWzAtpCyQi"));
    }
}
