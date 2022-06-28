package com.sendbird.calls.reactnative

import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.sendbird.calls.ParticipantState

class RNSBGroupCallVideoViewManager(private val reactContext: ReactContext) : SimpleViewManager<RNSBGroupCallVideoView>() {
    override fun getName() = NAME
    override fun createViewInstance(context: ThemedReactContext) = RNSBGroupCallVideoView(context)

    @ReactProp(name = "participantId")
    fun setParticipantId(view: RNSBGroupCallVideoView, participantId: String) {
        view.setParticipantId(participantId)
    }

    @ReactProp(name = "roomId")
    fun setRoomId(view: RNSBGroupCallVideoView, roomId: String) {
        view.setRoomId(roomId)
    }

    @ReactProp(name = "state")
    fun setParticipantState(view: RNSBGroupCallVideoView, state: String) {
        val participantState = ParticipantState.valueOf(state.uppercase())
        view.setParticipantState(participantState)
    }

    companion object {
        const val NAME = "RNSBGroupCallVideoView"
    }
}