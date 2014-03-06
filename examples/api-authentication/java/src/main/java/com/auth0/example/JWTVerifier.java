package com.auth0.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * JWTVerifier Java Implementation
 * <p/>
 * Adapted from https://bitbucket.org/lluisfaja/javajwt/wiki/Home
 * See <a href="https://bitbucket.org/lluisfaja/javajwt/src/3941d23e8e70f681d8a9a2584760e58e79e498f1/JavaJWT/src/com/unblau/javajwt/JWTVerifier.java">JWTVerifier.java</a>
 */
public class JWTVerifier {

    private final String secret;
    private final String audience;
    private final String issuer;
    private final Base64 decoder;

    private final ObjectMapper mapper;

    /**
     * @see <a href="http://download.oracle.com/javase/7/docs/technotes/guides/security/StandardNames.html#Mac">Java Standard Algorithm Name Documentation</a>
     */
    private Map<String, String> algorithms;

    public JWTVerifier(String secret, String audience, String issuer) {
        decoder = new Base64(true);
        mapper = new ObjectMapper();

        algorithms = new HashMap<String, String>();
        algorithms.put("none", "none");
        algorithms.put("HS256", "HmacSHA256");
        algorithms.put("HS384", "HmacSHA384");
        algorithms.put("HS512", "HmacSHA512");

        this.secret = secret;
        this.audience = audience;
        this.issuer = issuer;
    }

    public JWTVerifier(String secret, String audience) {
        this(secret, audience, null);
    }

    /**
     * Performs com.auth0.example.JWTVerifier validation
     *
     *
     *
     * @param token token to verify
     * @throws SignatureException    when the signature is invalid
     * @throws IllegalStateException when the token's structure isn't valid or expiration, issuer or audience are invalid
     */
    public Map<String, Object> verify(String token)
            throws NoSuchAlgorithmException, InvalidKeyException, IllegalStateException,
            IOException, SignatureException {
        if ("".equals(token)) {
            throw new IllegalStateException("token not set");
        }

        String[] pieces = token.split("\\.");

        // check number of segments
        if (pieces.length != 3 && pieces.length != 2) {
            throw new IllegalStateException("wrong number of segments: " + pieces.length);
        }

        // get JWTHeader JSON object. Extract algorithm
        Map<String, Object> jwtHeader = decodeAndParse(pieces[0]);

        String algorithm = getAlgorithm(jwtHeader);

        // get JWTClaims JSON object
        Map<String, Object> jwtPayload = decodeAndParse(pieces[1]);

        // check signature
        verifySignature(pieces, algorithm);

        // additional JWTClaims checks
        verifyExpiration(jwtPayload);

        // Only check issuer when passed as not null constructor parameter
        if (issuer != null ) {
            verifyIssuer(jwtPayload);
        }

        verifyAudience(jwtPayload);
        return jwtPayload;
    }

    private void verifySignature(String[] pieces, String algorithm) throws NoSuchAlgorithmException, InvalidKeyException, SignatureException {
        if (!"none".equals(algorithm)) {
            if (pieces.length != 3) {
                throw new IllegalStateException("wrong number of segments: " + pieces.length);
            }

            if ("".equals(secret)) {
                throw new IllegalStateException("key not set");
            }

            Mac hmac = Mac.getInstance(algorithm);
            hmac.init(new SecretKeySpec(decoder.decodeBase64(secret), algorithm));
            byte[] sig = hmac.doFinal(new StringBuilder(pieces[0]).append(".").append(pieces[1]).toString().getBytes());

            if (!Arrays.equals(sig, decoder.decodeBase64(pieces[2]))) {
                throw new SignatureException("signature verification failed");
            }
        }
    }

    private void verifyExpiration(Map<String, Object> jwtClaims) {
        int expiration = (Integer) jwtClaims.get("exp");
        if (expiration != 0 && System.currentTimeMillis() / 1000L >= expiration) {
            throw new IllegalStateException("jwt expired");
        }
    }

    private void verifyIssuer(Map<String, Object> jwtClaims) {
        String issuerFromToken = (String) jwtClaims.get("iss");

        if (issuerFromToken != null && !issuer.equals(issuerFromToken)) {
            throw new IllegalStateException("jwt issuer invalid");
        }
    }

    private void verifyAudience(Map<String, Object> jwtClaims) {
        String audienceFromToken = (String) jwtClaims.get("audience");

        if (audienceFromToken != null && !audience.equals(audienceFromToken)) {
            throw new IllegalStateException("jwt audience invalid");
        }
    }

    private String getAlgorithm(Map<String, Object> jwtHeader) {
        String algorithmName = (String) jwtHeader.get("alg");

        if (jwtHeader.get("alg") == null) {
            throw new IllegalStateException("algorithm not set");
        }

        if (algorithms.get(algorithmName) == null) {
            throw new IllegalStateException("unsupported algorithm");
        }

        return algorithms.get(algorithmName);
    }

    private Map<String, Object> decodeAndParse(String b64String) throws IOException {
        String jsonString = new String(decoder.decodeBase64(b64String), "UTF-8");
        Map<String, Object> jwtHeader = mapper.readValue(jsonString, Map.class);
        return jwtHeader;
    }
}