package org.silzila.app.security.encryption;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.silzila.app.AppApplication;

import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

public class AESEncryption {

    private static final Logger logger = LogManager.getLogger(AESEncryption.class);
    // encryption method
    public static String encrypt(String stringToEncrypt, String passwordEncryptionSecretKey,
            String passwordEncryptionSaltValue) {
        try {
            // declare a byte array
            byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            // create factory for secret keys
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            // PBEKeySpec class implements KeySpec interface
            KeySpec spec = new PBEKeySpec(passwordEncryptionSecretKey.toCharArray(),
                    passwordEncryptionSaltValue.getBytes(), 65536, 256);
            SecretKey tmp = factory.generateSecret(spec);
            SecretKeySpec secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
            // returns encrypted value
            return Base64.getEncoder()
                    .encodeToString(cipher.doFinal(stringToEncrypt.getBytes(StandardCharsets.UTF_8)));
        } catch (InvalidAlgorithmParameterException | InvalidKeyException | NoSuchAlgorithmException
                | InvalidKeySpecException | BadPaddingException | IllegalBlockSizeException
                | NoSuchPaddingException e) {
            logger.warn("Error occured during encryption: " + e.toString());
        }
        return null;
    }

    // decryption method
    public static String decrypt(String stringToDecrypt, String passwordEncryptionSecretKey,
            String passwordEncryptionSaltValue) {
        try {
            // declare a byte array
            byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            // create factory for secret keys
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            // PBEKeySpec class implements KeySpec interface
            KeySpec spec = new PBEKeySpec(passwordEncryptionSecretKey.toCharArray(),
                    passwordEncryptionSaltValue.getBytes(), 65536, 256);
            SecretKey tmp = factory.generateSecret(spec);
            SecretKeySpec secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
            // returns decrypted value
            return new String(cipher.doFinal(Base64.getDecoder().decode(stringToDecrypt)));
        } catch (InvalidAlgorithmParameterException | InvalidKeyException | NoSuchAlgorithmException
                | InvalidKeySpecException | BadPaddingException | IllegalBlockSizeException
                | NoSuchPaddingException e) {
            logger.warn("Error occured during decryption: " + e.toString());
        }
        return null;
    }

}
