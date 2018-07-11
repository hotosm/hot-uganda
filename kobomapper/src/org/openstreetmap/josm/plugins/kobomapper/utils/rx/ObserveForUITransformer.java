package org.openstreetmap.josm.plugins.kobomapper.utils.rx;

import rx.Observable;
import rx.schedulers.Schedulers;

/**
 * Created by mossplix on 4/29/17.
 */

public final class ObserveForUITransformer<T> implements Observable.Transformer<T, T> {
    @Override
    public
    Observable<T> call(final  Observable<T> source) {

        return source.flatMap(value -> {

                return Observable.just(value).observeOn(Schedulers.immediate());

        });
    }


}
