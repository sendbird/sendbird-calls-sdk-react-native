package com.sendbird.calls.reactnative

import android.content.Context
import com.sendbird.calls.DirectCall
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.reactnative.view.BaseVideoView

enum class ViewType {
    LOCAL, REMOTE
}

class RNSBDirectCallVideoView(context: Context) : BaseVideoView(context) {
    private var mViewType = ViewType.LOCAL
    private var mCallId: String? = null

    private fun getCall(id: String?): DirectCall? {
        val callId = id ?: mCallId ?: return null
        return SendBirdCall.getCall(callId)
    }

    fun setViewType(viewType: ViewType) {
        val prevType = mViewType
        val nextType = viewType
        mViewType = viewType

        val call = getCall(mCallId)
        if (call != null && prevType != nextType && mCallId != null) {
            if(prevType === ViewType.LOCAL && nextType === ViewType.REMOTE) {
                call.setRemoteVideoView(mSurface)
            }
            if(prevType === ViewType.REMOTE && nextType === ViewType.LOCAL) {
                call.setLocalVideoView(mSurface)
            }
        }
    }

    fun setCallId(callId: String) {
        val prevCall = getCall(mCallId)
        val nextCall = getCall(callId) ?: return

        if (prevCall != nextCall) {
            mCallId = callId
            when(mViewType) {
                ViewType.LOCAL -> {
                    prevCall?.setLocalVideoView(null)
                    nextCall.setLocalVideoView(mSurface)
                }
                ViewType.REMOTE -> {
                    prevCall?.setRemoteVideoView(null)
                    nextCall.setRemoteVideoView(mSurface)
                }
            }
        }
    }
}