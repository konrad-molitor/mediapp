package com.mediapp

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log

class FullScreenModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "FullScreenModule"
    }

    @ReactMethod
    fun launchFullScreenNotification() {
        Log.d("FullScreenModule", "launchFullScreenNotification called")
        val intent: Intent = Intent(reactApplicationContext, FullScreenNotificationActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        Log.d("FullScreenModule", "launchFullScreenNotification: $intent")
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun closeFullScreenNotification() {
        val currentActivity = currentActivity
        if (currentActivity is FullScreenNotificationActivity) {
            currentActivity.finish()
        } else {
            // Optionally, log or handle cases where the current activity is not FullScreenNotificationActivity
            android.util.Log.w("FullScreenModule", "Current activity is not FullScreenNotificationActivity")
        }
    }
}
