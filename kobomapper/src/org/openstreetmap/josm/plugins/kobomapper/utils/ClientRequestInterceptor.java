package org.openstreetmap.josm.plugins.kobomapper.utils;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

/**
 * Created by mossplix on 4/18/17.
 */

public final class ClientRequestInterceptor implements Interceptor {


    public ClientRequestInterceptor() {

    }

    @Override
    public Response intercept(final  Chain chain) throws IOException {
        return chain.proceed(request(chain.request()));
    }

    private Request request(final Request initialRequest) {
        return initialRequest.newBuilder()
                //.header("", build.versionCode().toString())
                .header("version", "0.0.1")
                .build();
    }
}
