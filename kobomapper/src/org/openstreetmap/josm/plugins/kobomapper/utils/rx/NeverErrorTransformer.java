package org.openstreetmap.josm.plugins.kobomapper.utils.rx;



import rx.Observable;
import rx.functions.Action1;

/**
 * Created by mossplix on 4/29/17.
 */

public final class NeverErrorTransformer<T> implements Observable.Transformer<T, T> {
    private final
    Action1<Throwable> errorAction;

    protected NeverErrorTransformer() {
        this.errorAction = null;
    }

    protected NeverErrorTransformer(final  Action1<Throwable> errorAction) {
        this.errorAction = errorAction;
    }

    @Override
    
    public Observable<T> call(final  Observable<T> source) {
        return source
                .doOnError(e -> {
                    if (errorAction != null) {
                        errorAction.call(e);
                    }
                })
                .onErrorResumeNext(Observable.empty());
    }
}
