package com.asmbio.p2psosial;

import android.app.Service;
import android.content.Intent;
import android.os.Environment;
import android.os.IBinder;
import android.util.Log;

import java.io.File;

import mogu.Mogu;

public class MoguService extends Service {
    public MoguService() {
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.e("mogservice","oncreate");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        var  filesDir= Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        File appDataDir = new File(filesDir, "mogu");
        try {
            Mogu.startGrpcAndWeb(appDataDir.getAbsolutePath());
        } catch (Exception e) {
            Log.e("mogservice",e.getMessage());
        }
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }
}