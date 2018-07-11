package org.openstreetmap.josm.plugins.kobomapper.utils.rx;


import rx.Notification;
import rx.Observable;

/**
 * Created by mossplix on 4/29/17.
 */

public final class ErrorsTransformer<T> implements Observable.Transformer<Notification<T>, Throwable> {

    @Override
    public
    Observable<Throwable> call(final  Observable<Notification<T>> source) {
        return source
                .filter(Notification::hasThrowable)
                .map(Notification::getThrowable);
    }
}

