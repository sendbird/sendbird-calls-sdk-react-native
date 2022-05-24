package com.sendbird.calls.reactnative

import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp


class RNSendbirdCallsVideoViewManager(private val reactContext: ReactContext) : SimpleViewManager<RNSendbirdCallsVideoView>() {
    override fun getName() = NAME
    override fun createViewInstance(context: ThemedReactContext) = RNSendbirdCallsVideoView(context)

    @ReactProp(name = "viewType")
    public fun setViewType(view: RNSendbirdCallsVideoView, type: String) {
        view.setViewType(ViewType.valueOf(type.uppercase()))
    }

    @ReactProp(name = "callId")
    public fun setCallId(view: RNSendbirdCallsVideoView, callId: String) {
        view.setCallId(callId)
    }

    companion object {
        const val NAME = "RNSendbirdCallsVideoView"
    }
}