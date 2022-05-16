package com.sendbird.calls.reactnative

import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp


class RNSendbirdCallsVideoViewManager(private val reactContext: ReactContext) : SimpleViewManager<RNSendbirdCallsVideoView>() {
    override fun getName() = NAME
    override fun createViewInstance(context: ThemedReactContext) = RNSendbirdCallsVideoView(context)

    @ReactProp(name = "type")
    public fun setType(view: RNSendbirdCallsVideoView, type: String) {
        view.type = ViewType.valueOf(type.uppercase())
    }

    @ReactProp(name = "callId")
    public fun setCallId(view: RNSendbirdCallsVideoView, callId: String) {
        try {
            val call = CallsUtils.findDirectCall(callId, "viewManager/setCallId")
            when (view.type) {
                ViewType.LOCAL -> call.setLocalVideoView(view.surface)
                ViewType.REMOTE -> call.setRemoteVideoView(view.surface)
            }
        } finally { }
    }

    companion object {
        const val NAME = "RNSendbirdCallsVideoView"
    }
}