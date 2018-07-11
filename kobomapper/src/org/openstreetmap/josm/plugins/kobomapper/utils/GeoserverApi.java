package org.openstreetmap.josm.plugins.kobomapper.utils;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import okhttp3.OkHttpClient;
import org.geojson.GeoJsonObject;
import org.geojson.GeometryCollection;
import org.openstreetmap.josm.Main;
import org.openstreetmap.josm.gui.MainApplication;
import org.openstreetmap.josm.gui.MapView;
import org.openstreetmap.josm.gui.layer.Layer;
import org.openstreetmap.josm.gui.progress.NullProgressMonitor;
import org.openstreetmap.josm.gui.progress.ProgressMonitor;
import org.openstreetmap.josm.io.GeoJSONWriter;
import org.openstreetmap.josm.plugins.geojson.DataSetBuilder;
import org.openstreetmap.josm.plugins.geojson.DataSetBuilder.BoundedDataSet;
import org.openstreetmap.josm.plugins.geojson.GeoJsonLayer;
import org.openstreetmap.josm.tools.Logging;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.scalars.ScalarsConverterFactory;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

import static org.openstreetmap.josm.gui.mappaint.mapcss.ExpressionFactory.Functions.tr;

/**
 * Created by Moses on 7/22/16.
 */

public class GeoserverApi  {

    private GeoserverApiService service;
    private Gson gson;
    private static String GEOSERVER_BASE="http://178.62.45.224:8083/";
    private static String SYNC_SERVER_BASE="http://178.62.45.224:5000/";

    ProgressMonitor progressMonitor;

    MapView mv = null;
   
    public GeoserverApi(){
        this.service=getStringClient();

        gson=new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
                //.registerTypeAdapter(OpeningTimeUtils.DateTime.class, new DateTimeTypeConverter())
                .registerTypeAdapterFactory(new AutoParcelAdapterFactory())
                .create();
    }
    public GeoserverApiService getStringClient(){

        final LoggingInterceptor loggingInterceptor = new LoggingInterceptor();

        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .addInterceptor(new BasicAuthInterceptor(Main.pref.get("kobo.username"), Main.pref.get("kobo.password")))
                .addInterceptor(loggingInterceptor)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .client(okHttpClient)
                .baseUrl(GEOSERVER_BASE)
                .addConverterFactory(ScalarsConverterFactory.create())
                //.addConverterFactory(GsonConverterFactory.create(gson))
                //.addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                .build();


        service = retrofit.create(GeoserverApiService.class);  
        return service;
    }



    public void getLayer(final String layer,String start,String end)
    {
        Logging.info("in Get layerq");

        if (progressMonitor == null) { // make sure that there is a progress monitor...
            progressMonitor = NullProgressMonitor.INSTANCE;
        }

        progressMonitor.beginTask(String.format(
                tr("Downloading layer ''%s''..."), layer, 4));
        progressMonitor.setTicksCount(1);

        String serviceType="WFS";
        String version="1.0.0";
        String request="GetFeature";
        String maxFeatures="25000";
        String outputFormat="application/json";
        String viewParams="";

        if (start != null)
        {
            viewParams=viewParams+"start:"+start;
        }
        if (end != null)
        {
            if(viewParams != "" ) {
                viewParams = viewParams + ";end:" + end;
            }
            else{
                viewParams = viewParams + "end:" + end;
            }
        }
        Call<String> stringCall = service.getLayer(layer,serviceType,version,request,maxFeatures,outputFormat,viewParams);
    stringCall.enqueue(new Callback<String>() {  
    @Override
    public void onResponse(Call<String> call, Response<String> response) {
        Logging.info(response.toString());
        if (response.isSuccessful()) {
            try{
                String responseString = response.body();
                final ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                final GeoJsonObject object = mapper.readValue(responseString, GeoJsonObject.class);
                GeoJsonObject geoJsonObject = new GeometryCollection();
                final BoundedDataSet data = new DataSetBuilder().build(object);

                 final Layer mLayer = new GeoJsonLayer(layer, data);
                    mLayer.setBackgroundLayer(true);
                    MainApplication.getLayerManager().addLayer(mLayer);
                }
                catch(IOException e)
                {
                    Logging.info(e.toString());
                    progressMonitor.finishTask();
                }
        }

    }







    @Override
    public void onFailure(Call<String> call, Throwable t) {
        Logging.info(t.toString());

    }
});
    }



    public void uploadLayer() throws IOException
    {
        Logging.info("Uploading Layer");

        GeoJsonLayer dt = (GeoJsonLayer)MainApplication.getLayerManager().getActiveLayer();


        GeoJSONWriter out = new GeoJSONWriter(dt.data);
        Writer writer = new StringWriter();
        writer.write(out.write());
        String toPost=writer.toString();
        //Logging.info(toPost);


        OkHttpClient okHttpClient2 = new OkHttpClient.Builder()
                .build();

        Retrofit retrofit2 = new Retrofit.Builder()
                .client(okHttpClient2)
                .baseUrl(SYNC_SERVER_BASE)
                .addConverterFactory(ScalarsConverterFactory.create())
                //.addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                .build();


        GeoserverApiService service2 = retrofit2.create(GeoserverApiService.class);



        Call<String> stringCall = service2.postdata(toPost);
        stringCall.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                Logging.info(response.toString());
                if (response.isSuccessful()) {
                    try{
                        String responseString = response.body();



                    }
                    catch(Exception e)
                    {
                        Logging.info(e.toString());

                    }
                }

            }



            @Override
            public void onFailure(Call<String> call, Throwable t) {
                Logging.info(t.toString());


            }
        });
    }



}
