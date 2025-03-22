package com.asmbio.p2psosial;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

public class MoguService extends Service {
    public MoguService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }
}