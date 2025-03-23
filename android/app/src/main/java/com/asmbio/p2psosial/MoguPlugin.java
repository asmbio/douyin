package com.asmbio.p2psosial;


import android.content.Context;
import android.content.Intent;
import android.os.Environment;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;

import mogu.Mogu;


@CapacitorPlugin(name = "Mogu")
public class MoguPlugin extends Plugin {
    private boolean hasStarted = false;

    @PluginMethod()
    public void start(PluginCall call) {

        if (hasStarted) {
            JSObject ret = new JSObject();
            ret.put("value", 1);
            call.resolve(ret);
            return;
        }

        try {
//            Context context = getContext();
//            Intent serviceIntent = new Intent(context, MoguService.class);
//            // 添加前台服务配置（可选）
//            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
//                context.startForegroundService(serviceIntent);
//            } else {
//                context.startService(serviceIntent);
//            }

            var  filesDir= Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File appDataDir = new File(filesDir, "mogu");
            Mogu.startGrpcAndWeb(appDataDir.getAbsolutePath());

//            String pwd = call.getString("pwd");
//            Mogu.startGrpcAndWeb(appDataDir.getAbsolutePath());
            hasStarted = true;
            JSObject ret = new JSObject();
            ret.put("value", 1);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void stopService(PluginCall call) {
        Context context = getContext();
        Intent serviceIntent = new Intent(context, MoguService.class);
        context.stopService(serviceIntent);
        call.resolve();
    }
}


//
//
//// 创建应用数据目录并写入测试文件
//        try {
//// 获取应用内部存储目录
//File filesDir = getContext().getFilesDir();
//
//File appDataDir = new File(filesDir, "app_data");
//
//// 创建目录（如果不存在）
//            if (!appDataDir.exists() && !appDataDir.mkdirs()) {
//        throw new IOException("无法创建目录: " + appDataDir.getAbsolutePath());
//        }
//
//// 创建测试文件并写入数据
//File testFile = new File(appDataDir, "test.txt");
//String testContent = "这是一条测试数据";
//            try (FileOutputStream fos = new FileOutputStream(testFile)) {
//        fos.write(testContent.getBytes());
//        }
//        Log.i("3",testFile.getAbsolutePath());
//        Log.e("3",testFile.getAbsolutePath());
//
//        } catch (IOException e) {
//        call.reject("文件操作失败: " + e.getMessage());
//        return;
//        }
//        try {
//// 1. 构建文件路径
//File filesDir = getContext().getFilesDir();
//File testFile = new File(filesDir, "app_data/test.txt");
//
//// 2. 检查文件是否存在
//            if (!testFile.exists()) {
//        call.reject("文件不存在: " + testFile.getAbsolutePath());
//        return;
//        }
//
//// 3. 读取文件内容
//StringBuilder content = new StringBuilder();
//            try (BufferedReader br = new BufferedReader(new FileReader(testFile))) {
//String line;
//                while ((line = br.readLine()) != null) {
//        content.append(line);
//                }
//                        }
//
//// 4. 返回结果给前端
//JSObject ret = new JSObject();
//            ret.put("content", content.toString());
//        call.resolve(ret);
//            Log.e("3", content.toString());
//
//        } catch (IOException e) {
//        call.reject("读取失败: " + e.getMessage());
//        }