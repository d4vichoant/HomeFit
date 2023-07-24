package io.ionic.starter;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import android.content.pm.ActivityInfo;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      getWindow().setDecorFitsSystemWindows(false);
      //getWindow().setStatusBarColor(Color.TRANSPARENT);
      getWindow().setNavigationBarColor(Color.parseColor("#020a14"));
      //getWindow().setNavigationBarColor(Color.TRANSPARENT);

    }
    super.onCreate(savedInstanceState);
  }

}
