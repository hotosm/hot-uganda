package org.openstreetmap.josm.plugins.kobomapper.utils;


import retrofit2.Call;
import retrofit2.http.*;
import rx.Observable;



public interface GeoserverApiService {

   //http://178.62.45.224:8083/geoserver/hotosm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hotosm:boundaries&maxFeatures=50&outputFormat=application%2Fjson


   @GET("tiger/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tiger:tiger_roads&maxFeatures=50&outputFormat=application%2Fjson")
   Observable<String> getStringResponse();  

   @GET()
   Call<String> getStringResponse(@Url String url);


   @GET("geoserver/hotosm/ows")
   Call<String> getLayer(@Query("typeName") String layerName,
                         @Query("service") String service,
                         @Query("version") String version,
                         @Query("request") String request,
                         @Query("maxFeatures") String maxFeatures,
                         @Query("outputFormat") String outputFormat,
                         @Query("viewparams") String viewParams
                         );


   @Headers("Content-Type: application/json")
   @POST("submissions")
   Call<String> postdata(@Body String body);



}
