package org.openstreetmap.josm.plugins.kobomapper.utils;

import rx.functions.Func1;

/**
 * Created by mossplix on 4/27/17.
 */

public final class ObjectUtils {
    private ObjectUtils(){}

    public static boolean isNull(final  Object object) {
        return object == null;
    }

    public static boolean isNotNull(final Object object) {
        return object != null;
    }

    /**
     * Returns the first non-`null` value of its arguments.
     */
     public static <T> T coalesce(final T value, final  T theDefault) {
        if (value != null) {
            return value;
        }
        return theDefault;
    }

    /**
     * Returns a function `T -> T` that coalesces values with `theDefault`.
     */
    public static <T> Func1<T, T> coalesceWith(final T theDefault) {
        return (value) -> ObjectUtils.coalesce(value, theDefault);
    }

    /**
     * Converts a {@link String} to a {@link Boolean}, or null if the boolean cannot be parsed.
     */
    public static  Boolean toBoolean(final  String s) {
        if (s != null) {
            return Boolean.parseBoolean(s);
        }

        return null;
    }

    /**
     * Converts a {@link String} to an {@link Integer}, or null if the integer cannot be parsed.
     */
    public static Integer toInteger(final  String s) {
        if (s != null) {
            try {
                return Integer.parseInt(s);
            } catch (final  NumberFormatException e) {
                return null;
            }
        }

        return null;
    }

    /**
     * Converts an {@link Integer} to a {@link String}, can be null if the integer is also null.
     */
    public static  String toString(final  Integer n) {
        if (n != null) {
            return Integer.toString(n);
        }

        return null;
    }

    /**
     * Converts a {@link Long} to a {@link String}, can be null if the long is also null.
     */
    public static  String toString(final  Long n) {
        if (n != null) {
            return Long.toString(n);
        }

        return null;
    }

    /**
     * Converts a {@link Float} to a {@link String}, can be null if the float is also null.
     */
    public static  String toString(final  Float n) {
        if (n != null) {
            return Float.toString(n);
        }

        return null;
    }

    /**
     * Converts a {@link Double} to a {@link String}, can be null if the double is also null.
     */
    public static  String toString(final  Double n) {
        if (n != null) {
            return Double.toString(n);
        }

        return null;
    }

    /**
     * Cast a `null`able value into a non-`null` value, and throw a `NullPointerException` if the value is `null`.
     */
    public static 
    <T> T requireNonNull(final  T value) throws NullPointerException {
        return requireNonNull(value, "Value should not be null.");
    }

    /**
     * Cast a `null`able value into a non-`null` value, and throw a `NullPointerException` if the value is `null`. Provide
     * a message for a better description of why you require this value to be non-`null`.
     */
    public static  <T> T requireNonNull(final  T value, final  Class<T> klass) throws NullPointerException {
        return requireNonNull(value, klass.toString() + " required to be non-null.");
    }

    /**
     * Cast a `null`able value into a non-`null` value, and throw a `NullPointerException` if the value is `null`. Provide
     * a message for a better description of why you require this value to be non-`null`.
     */
    public static  <T> T requireNonNull(final  T value, final  String message) throws NullPointerException {
        if (value == null) {
            throw new NullPointerException(message);
        }
        return value;
    }
}
