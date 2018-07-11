package org.openstreetmap.josm.plugins.kobomapper.utils.rx;


import org.openstreetmap.josm.plugins.kobomapper.utils.Pair;
import rx.Observable;

/**
 * Created by mossplix on 4/29/17.
 */

public final class ZipPairTransformer<T, R> implements Observable.Transformer<T, Pair<T, R>> {
    
    private final Observable<R> second;

    public ZipPairTransformer(final  Observable<R> second) {
        this.second = second;
    }

    @Override
     public Observable<Pair<T, R>> call(final  Observable<T> first) {
        return Observable.zip(first, second, Pair::new);
    }
}
