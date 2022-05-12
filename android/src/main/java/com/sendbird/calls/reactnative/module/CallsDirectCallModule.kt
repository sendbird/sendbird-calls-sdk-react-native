package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.ReactApplicationContext
import com.sendbird.calls.DirectCall
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.handler.DirectCallListener

class CallsDirectCallModule(private val reactContext: ReactApplicationContext): DirectCallModule,
    DirectCallListener() {
    override fun onConnected(call: DirectCall) {
        TODO("Not yet implemented")
    }

    override fun onEnded(call: DirectCall) {
        TODO("Not yet implemented")
    }
}