package com.asmbio.p2psosial;

import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.BridgeActivity;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;


public class MainActivity extends BridgeActivity {
//    private WebView webView;

    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(MoguPlugin.class);
        super.onCreate(savedInstanceState);
        var  filesDir= Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        File appDataDir = new File(filesDir, "mogu");

        Thread.setDefaultUncaughtExceptionHandler(new CrashHandler(
                Thread.getDefaultUncaughtExceptionHandler(),
                appDataDir.getAbsolutePath()+ "/crash_logs"
        ));
        // 初始化 Bridge
       // init(savedInstanceState, new ArrayList<>());

        // 获取 WebView 并修改设置
//        getBridge().getWebView().post(() -> {
//            var webSettings = getBridge().getWebView().getSettings();
//            // 打印全部关键属性
//            Log.e("WebSettings", "===== 全部属性配置 =====");
//            Log.e("WebSettings", "JavaScriptEnabled: " + webSettings.getJavaScriptEnabled());
//            Log.e("WebSettings", "MediaPlaybackRequiresUserGesture: " + webSettings.getMediaPlaybackRequiresUserGesture());
//            Log.e("WebSettings", "DomStorageEnabled: " + webSettings.getDomStorageEnabled());
//            Log.e("WebSettings", "AllowContentAccess: " + webSettings.getAllowContentAccess());
//            Log.e("WebSettings", "AllowFileAccess: " + webSettings.getAllowFileAccess());
//            Log.e("WebSettings", "SupportZoom: " + webSettings.supportZoom());
//            Log.e("WebSettings", "UserAgent: " + webSettings.getUserAgentString());
//            Log.e("WebSettings", "CacheMode: " + getCacheModeName(webSettings.getCacheMode())); // 自定义转换
//            Log.e("WebSettings", "DefaultFontSize: " + webSettings.getDefaultFontSize());
//            Log.e("WebSettings", "LoadWithOverviewMode: " + webSettings.getLoadWithOverviewMode());
//            Log.e("WebSettings", "UseWideViewPort: " + webSettings.getUseWideViewPort());
//            Log.e("WebSettings", "BuiltInZoomControls: " + webSettings.getBuiltInZoomControls());
//            Log.e("WebSettings", "DisplayZoomControls: " + webSettings.getDisplayZoomControls());
//            Log.e("WebSettings", "DatabaseEnabled: " + webSettings.getDatabaseEnabled());
//            Log.e("WebSettings", " getLoadsImagesAutomatically: " + webSettings. getLoadsImagesAutomatically());
//            Log.e("WebSettings", "BlockNetworkImage: " + webSettings.getBlockNetworkImage());
//            Log.e("WebSettings", "BlockNetworkLoads: " + webSettings.getBlockNetworkLoads());
//            Log.e("WebSettings", "TextZoom: " + webSettings.getTextZoom());
//            Log.e("WebSettings", "DefaultTextEncoding: " + webSettings.getDefaultTextEncodingName());
//            Log.e("WebSettings", "MinimumFontSize: " + webSettings.getMinimumFontSize());
//            Log.e("WebSettings", "MixedContentMode: " + webSettings.getMixedContentMode());
//        });


    }

    // 自定义崩溃处理类
    class CrashHandler implements Thread.UncaughtExceptionHandler {
        private final Thread.UncaughtExceptionHandler defaultHandler;
        private final String logPath;

        public CrashHandler(Thread.UncaughtExceptionHandler defaultHandler, String logPath) {
            this.defaultHandler = defaultHandler;
            this.logPath = logPath;
        }

        @Override
        public void uncaughtException(Thread thread, Throwable ex) {
            // 保存日志文件
            saveCrashLog(ex);

            // 调用系统默认处理程序
            if (defaultHandler != null) {
                defaultHandler.uncaughtException(thread, ex);
            } else {
                android.os.Process.killProcess(android.os.Process.myPid());
                System.exit(10);
            }
        }

        private void saveCrashLog(Throwable ex) {
            String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());
            String fileName = "crash_" + time + ".log";

            // 创建日志目录
            File dir = new File(logPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 写入文件
            File file = new File(dir, fileName);
            try {
                FileWriter fw = new FileWriter(file);
                PrintWriter pw = new PrintWriter(fw);

                // 记录崩溃时间
                pw.println("Crash Time: " + time);

                // 记录设备信息
                pw.println("\nDevice Info:");
                pw.println("Model: " + Build.MODEL);
                pw.println("SDK Version: " + Build.VERSION.SDK_INT);

                // 记录异常信息
                pw.println("\nStack Trace:");
                ex.printStackTrace(pw);

                // 关闭流
                pw.flush();
                pw.close();
                fw.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    // 自定义方法：转换缓存模式为可读名称
    private String getCacheModeName(int mode) {
        switch (mode) {
            case WebSettings.LOAD_DEFAULT: return "LOAD_DEFAULT";
            case WebSettings.LOAD_NO_CACHE: return "LOAD_NO_CACHE";
            case WebSettings.LOAD_CACHE_ELSE_NETWORK: return "LOAD_CACHE_ELSE_NETWORK";
            case WebSettings.LOAD_CACHE_ONLY: return "LOAD_CACHE_ONLY";
            default: return "UNKNOWN";
        }
    }
//
//    private void configureWebView() {
//        WebView webView = this.webView; // 获取成员变量
//        WebViewClient client = new WebViewClient(); // 创建 WebViewClient
//
//        // 获取 WebSettings 对象
//        var webSettings = webView.getSettings();
//
//        // 允许 JavaScript（可选）
//        webSettings.setJavaScriptEnabled(true);
//
//        // 允许自动加载媒体（关键配置）
//        webSettings.setMediaPlaybackRequiresUserGesture(false); // 允许自动预加载视频
//
//        // 其他必要设置
//        webSettings.setDomStorageEnabled(true);    // 启用 DOM 存储
//        webSettings.setAllowContentAccess(true);  // 允许访问内容
//        webSettings.setAllowFileAccess(true);     // 允许文件访问
//        webSettings.setSupportZoom(true);         // 支持缩放
//
//        // 硬件加速（可选但推荐）
//        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
//
//        // 设置 WebViewClient 防止跳转浏览器
//        webView.setWebViewClient(client);
//    }
}
