package org.openstreetmap.josm.plugins.kobomapper.utils;



public final class ApiException extends ResponseException {


    public ApiException(final retrofit2.Response response) {
        super(response);
    }


}
