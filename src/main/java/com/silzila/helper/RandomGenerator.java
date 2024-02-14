package com.silzila.helper;

import java.io.Serializable;
import java.util.Random;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

public class RandomGenerator implements IdentifierGenerator {

    public static final String generatorName = "randomGenerator";

    @Override
    public Serializable generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object object)
            throws HibernateException {

        Integer length = 11;
        String alphabet = new String("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

        int n = alphabet.length();

        String result = new String();
        Random r = new Random();

        for (int i = 0; i < length; i++)
            result = result + alphabet.charAt(r.nextInt(n));

        return result;
    }

}
