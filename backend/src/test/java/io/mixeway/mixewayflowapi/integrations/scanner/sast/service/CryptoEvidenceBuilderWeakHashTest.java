package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CryptoEvidenceBuilderWeakHashTest {

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_HIBP() {
        // Test case from Gitea finding 30877 - "HaveIBeenPwned" written without spaces
        String reasoning = "The use of SHA-1 in this context is for generating a hash prefix to query the " +
                "'HaveIBeenPwned' API, which is a public, non-cryptographic fingerprinting protocol requirement.";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize HaveIBeenPwned (no spaces) as non-password purpose");
    }
    
    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_HIBP_withSpaces() {
        // Test variant with spaces
        String reasoning = "The use of SHA-1 in this context is for generating a hash prefix to query the " +
                "'Have I Been Pwned' API, which is a public, non-cryptographic fingerprinting protocol requirement.";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize 'Have I Been Pwned' (with spaces) as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_HIBP_lowercase() {
        String reasoning = "The code uses SHA-1 exclusively to implement the HaveIBeenPwned (HIBP) k-anonymity API protocol";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize HIBP as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_thirdPartyProtocol() {
        String reasoning = "This is a third-party protocol requirement for privacy-preserving password checking";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize third-party protocol as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_notUsedForPassword() {
        String reasoning = "The hash is not used for password hashing but for cache keys";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize 'not used for password' as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_gitObject() {
        String reasoning = "SHA-1 is used for Git object IDs, which is the native format for Git";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize git object as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_npmSRI() {
        String reasoning = "The code performs integrity verification of an npm package tarball using npm SRI";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize npm SRI as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_alpineAPK() {
        String reasoning = "The usage of SHA-1 in this context is for calculating a file checksum (fingerprint) " +
                "for an Alpine package, which is a non-security use";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize Alpine/APK as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_chefMixlib() {
        String reasoning = "The finding flags the import of 'crypto/sha1' in a file implementing the Chef Mixlib authentication protocol";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize Mixlib as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_githubActions() {
        String reasoning = "The application uses MD5 to verify the integrity of uploaded artifact chunks with x-actions-results-md5";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize x-actions-results-md5 as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_multiHasher() {
        String reasoning = "The MultiHasher struct computes multiple concurrent checksums (MD5, SHA1, SHA256, SHA512)";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize MultiHasher as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_contextHash() {
        String reasoning = "The usage of SHA-1 in HashCommitStatusContext is for generating a hash to deduplicate commit status context";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize commit-status context as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_avatarFilename() {
        String reasoning = "The code uses MD5 to generate a filename for an avatar image based on the user ID for deduplication";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize avatar/filename/deduplication as non-password purpose");
    }

    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_CheckPassword() {
        // CheckPassword function name should not trigger password hashing detection
        String reasoning = "The CheckPassword function calls the HaveIBeenPwned API to verify if a password has been compromised";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize CheckPassword HIBP API call as non-password hashing");
    }
    
    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_matrixTxnId() {
        String reasoning = "The code uses MD5 to generate a transaction ID (txnId) for Matrix protocol idempotency";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize Matrix txnId as non-password purpose");
    }
    
    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_npmIntegrity() {
        String reasoning = "The code performs npm integrity verification of a package tarball";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize npm integrity as non-password purpose");
    }
    
    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_alpinePackage() {
        String reasoning = "The usage of SHA-1 is for an Alpine package checksum";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize Alpine package as non-password purpose");
    }
    
    @Test
    void testLooksLikeNonPasswordWeakHashPurpose_githubActionsArtifact() {
        String reasoning = "The application uses MD5 for GitHub Actions artifact chunk verification";
        
        assertTrue(CryptoEvidenceBuilder.looksLikeNonPasswordWeakHashPurpose(reasoning),
                "Should recognize GitHub Actions artifact as non-password purpose");
    }
}
