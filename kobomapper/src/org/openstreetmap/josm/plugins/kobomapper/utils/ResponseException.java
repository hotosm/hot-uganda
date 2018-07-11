package org.openstreetmap.josm.plugins.kobomapper.utils;


/**
 * Created by mossplix on 4/28/17.
 */

public class ResponseException extends RuntimeException {
    private final retrofit2.Response response;

    public ResponseException(final retrofit2.Response response) {
        this.response = response;
    }

    public  retrofit2.Response response() {
        return response;
    }
}
