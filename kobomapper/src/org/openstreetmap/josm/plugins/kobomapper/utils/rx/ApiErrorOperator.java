package org.openstreetmap.josm.plugins.kobomapper.utils.rx;

/**
 * Created by mossplix on 4/28/17.
 */


import com.sun.istack.internal.NotNull;
import org.openstreetmap.josm.plugins.kobomapper.utils.ResponseException;
import retrofit2.Response;
import rx.Observable;
import rx.Subscriber;

import java.io.IOException;


public final class ApiErrorOperator<T> implements Observable.Operator<T, retrofit2.Response<T>> {
    private String st;

    public ApiErrorOperator(final String st) {
        this.st = st;
    }

    @Override
    public Subscriber<? super Response<T>> call(final Subscriber<? super T> subscriber) {
        return new Subscriber<retrofit2.Response<T>>() {
            @Override
            public void onCompleted() {
                if (!subscriber.isUnsubscribed()) {
                    subscriber.onCompleted();
                }
            }

            @Override
            public void onError(final @NotNull Throwable e) {
                if (!subscriber.isUnsubscribed()) {
                    subscriber.onError(e);
                }
            }

            @Override
            public void onNext(final @NotNull retrofit2.Response<T> response) {
                if (subscriber.isUnsubscribed()) {
                    return;
                }

                if (!response.isSuccessful()) {
                    try {
                        final String envelope = response.errorBody().string();
                        subscriber.onError(new Transformers.ApiException(envelope));
                    } catch (final @NotNull IOException e) {
                        subscriber.onError(new ResponseException(response));
                    }
                } else {
                    subscriber.onNext(response.body());
                    subscriber.onCompleted();
                }
            }
        };
    }
}
