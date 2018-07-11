package org.openstreetmap.josm.plugins.kobomapper.utils.rx;

import rx.Notification;
import rx.Observable;

/**
 * Created by mossplix on 4/29/17.
 */

public final class CompletedTransformer<T> implements Observable.Transformer<Notification<T>, Void> {

    @Override
    public
    Observable<Void> call(final Observable<Notification<T>> source) {
        return source
                .filter(Notification::isOnCompleted)
                .map(__ -> null);
    }
}

