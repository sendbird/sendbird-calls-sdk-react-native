package com.sendbird.calls.reactnative

import android.content.Context
import android.widget.FrameLayout
import com.sendbird.calls.DirectCall
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.SendBirdVideoView

enum class ViewType {
    LOCAL, REMOTE
}

class RNSendbirdCallsVideoView(context: Context) : FrameLayout(context) {
    private var mSurface: SendBirdVideoView
    private var mViewType = ViewType.LOCAL
    private var mCallId: String? = null

    init {
        mSurface = SendBirdVideoView(context)
        mSurface.layout(0, 0, width, height)
        mSurface.setPadding(4,4,4,4)
        mSurface.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        addView(mSurface)
    }

    private fun getCall(id: String?): DirectCall? {
        val callId = id ?: mCallId ?: return null
        return SendBirdCall.getCall(callId)
    }

    fun getSurface(): SendBirdVideoView {
        return mSurface
    }

    fun setViewType(viewType: ViewType) {
        mViewType = viewType
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