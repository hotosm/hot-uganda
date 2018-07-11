package org.openstreetmap.josm.plugins.kobomapper.utils.rx;


import rx.Observable;
import rx.functions.Action1;

/**
 * Created by mossplix on 4/29/17.
 */

final class NeverApiErrorTransformer<T> implements Observable.Transformer<T, T> {
    private final
    Action1<String> errorAction;

    protected NeverApiErrorTransformer() {
        this.errorAction = null;
    }

    protected NeverApiErrorTransformer(final Action1<String> errorAction) {
        this.errorAction = errorAction;
    }

    @Override
    public 
    Observable<T> call(final  Observable<T> source) {
        return source
                .doOnError(e -> {

                    if (e != null && errorAction != null) {
                        //errorAction.call(new Throwable(e));
                    }
                })
                .onErrorResumeNext(e -> {
                    if (e == null) {
                        return Observable.error(e);
                    } else {
                        return Observable.empty();
                    }
                });
    }
}
