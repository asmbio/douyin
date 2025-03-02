package com.asmbio.p2psosial;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(MoguPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
