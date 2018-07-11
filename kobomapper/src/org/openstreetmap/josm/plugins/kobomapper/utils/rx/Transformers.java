package org.openstreetmap.josm.plugins.kobomapper.utils.rx;

import com.deronltd.pmis.data.ApiResponse;

import rx.Observable;
import rx.functions.Action1;
import rx.subjects.PublishSubject;

public final class Transformers {
    private Transformers() {}

    /**
     * Transforms `null` values emitted from an observable into `theDefault`.
     */
    public static 
    <T> CoalesceTransformer<T> coalesce(final  T theDefault) {
        return new CoalesceTransformer<>(theDefault);
    }

    /**
     * Emits when a materialized stream is completed.
     */
    public static  <T> CompletedTransformer<T> completed() {
        return new CompletedTransformer<>();
    }

    /**
     * Emits when an error is thrown in a materialized stream.
     */
    public static  <T> ErrorsTransformer<T> errors() {
        return new ErrorsTransformer<>();
    }

    /**
     * Prevents an observable from erroring by chaining `onErrorResumeNext`.
     */
    public static <T> NeverErrorTransformer<T> neverError() {
        return new NeverErrorTransformer<>();
    }

    /**
     * Prevents an observable from erroring by chaining `onErrorResumeNext`,
     * and any errors that occur will be piped into the supplied errors publish
     * subject. `null` values will never be sent to the publish subject.
     *
     * @deprecated Use {@link Observable#materialize()} instead.
     */
    @Deprecated
    public static <T> NeverErrorTransformer<T> pipeErrorsTo(final  PublishSubject<Throwable> errorSubject) {
        return new NeverErrorTransformer<>(errorSubject::onNext);
    }

    /**
     * Prevents an observable from erroring by chaining `onErrorResumeNext`,
     * and any errors that occur will be piped into the supplied errors action.
     * `null` values will never be sent to the publish subject.
     *
     * @deprecated Use {@link Observable#materialize()} instead.
     */
    @Deprecated
    public static <T> NeverErrorTransformer<T> pipeErrorsTo(final  Action1<Throwable> errorAction) {
        return new NeverErrorTransformer<>(errorAction);
    }

    /**
     * Prevents an observable from erroring on any {@link ApiException} exceptions.
     */
    public static <T> NeverApiErrorTransformer<T> neverApiError() {
        return new NeverApiErrorTransformer<>();
    }

    /**
     * Prevents an observable from erroring on any {@link ApiException} exceptions,
     * and any errors that do occur will be piped into the supplied
     * errors publish subject. `null` values will never be sent to
     * the publish subject.
     *
     * @deprecated Use {@link Observable#materialize()} instead.
     */
    @Deprecated
    public static <T> NeverApiErrorTransformer<T> pipeApiErrorsTo(final  PublishSubject<String> errorSubject) {
        return new NeverApiErrorTransformer<>(errorSubject::onNext);
    }

    /**
     * Prevents an observable from erroring on any {@link ApiException} exceptions,
     * and any errors that do occur will be piped into the supplied
     * errors actions. `null` values will never be sent to the action.
     *
     * @deprecated Use {@link Observable#materialize()} instead.
     */
    @Deprecated
    public static <T> NeverApiErrorTransformer<T> pipeApiErrorsTo(final  Action1<String> errorAction) {
        return new NeverApiErrorTransformer<>(errorAction);
    }


    /*
     */
/**
 * Emits the latest value of the source `when` observable whenever the
 * `when` observable emits.
 *//*

    public static <S, T> TakePairWhenTransformer<S, T> takePairWhen(final  Observable<T> when) {
        return new TakePairWhenTransformer<>(when);
    }
*/

    /**
     * Zips two observables up into an observable of pairs.
     */
    public static <S, T> ZipPairTransformer<S, T> zipPair(final  Observable<T> second) {
        return new ZipPairTransformer<>(second);
    }

    /**
     * Emits the latest values from two observables whenever either emits.
     */
    public static <S, T> CombineLatestPairTransformer<S, T> combineLatestPair(final  Observable<T> second) {
        return new CombineLatestPairTransformer<>(second);
    }

    /*   *//**
     * Waits until `until` emits one single item and then switches context to the source. This
     * can be useful to delay work until a user logs in:
     *
     * ```
     * somethingThatRequiresAuth
     *   .compose(waitUntil(currentUser.loggedInUser()))
     *   .subscribe(show)
     * ```
     */
     public static <T, R> WaitUntilTransformer<T, R> waitUntil(final  Observable<R> until) {
        return new WaitUntilTransformer<>(until);
    }



    /**
     * Converts an observable of any type into an observable of `null`s. This is useful for forcing
     * Java's type system into knowing we have a stream of `Void`. Simply doing `.map(__ -> null)`
     * is not enough since Java doesn't know if that is a `null` String, Integer, Void, etc.
     *
     * This transformer allows the following pattern:
     *
     * ```
     * myObservable
     *   .compose(takeWhen(click))
     *   .compose(ignoreValues())
     *   .subscribe(subject::onNext)
     * ```
     */
     public static <S> IgnoreValuesTransformer<S> ignoreValues() {
        return new IgnoreValuesTransformer<>();
    }

    /**
     * Emits the number of times the source has emitted for every emission of the source. The
     * first emitted value will be `1`.
     *//*
     public static <T> IncrementalCountTransformer<T> incrementalCount() {
        return new IncrementalCountTransformer<>();
    }

    *//**
     * Emits an observable of values from a materialized stream.
     *//*
    public static  <T> ValuesTransformer<T> values() {
        return new ValuesTransformer<>();
    }
*/
    /**
     * If called on the main thread, schedule the work immediately. Otherwise delay execution of the work by adding it
     * to a message queue, where it will be executed on the main thread.
     *
     * This is particularly useful for RecyclerViews; if subscriptions in these views are delayed for a frame, then
     * the view temporarily shows recycled content and frame rate stutters. To address that, we can use `observeForUI()`
     * to execute the work immediately rather than wait for a frame.
     */
    public static  <T> ObserveForUITransformer<T> observeForUI() {
        return new ObserveForUITransformer<>();
    }


    public static  class ApiException extends RuntimeException {
        private final String reason;

        public ApiException(String reason) {
            this.reason = reason;
        }

        public String getReason() {
            return this.reason;
        }
    }


    public static  <T> Observable.Transformer<ApiResponse<T>, T> normalize() {
        return observable -> observable
                .map(tApiResponse -> {
                    if (!tApiResponse.response.equals("success"))
                        throw new ApiException(tApiResponse.output.toString());
                    else
                        return tApiResponse.output;
                });
    }
}
