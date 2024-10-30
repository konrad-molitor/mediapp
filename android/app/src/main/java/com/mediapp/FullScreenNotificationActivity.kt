package com.mediapp

import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate

class FullScreenNotificationActivity : ReactActivity() {
    override fun getMainComponentName(): String {
        return "FullScreenNotification" // Must match the name in fullScreenNotification.json
    }
}
