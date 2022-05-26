package com.sendbird.calls.reactnative.view

import android.content.Context
import android.widget.FrameLayout
import com.sendbird.calls.SendBirdVideoView

open class BaseVideoView(context: Context) : FrameLayout(context) {
    protected var mSurface: SendBirdVideoView

    init {
        mSurface = SendBirdVideoView(context)
        mSurface.layout(0, 0, width, height)
        mSurface.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        this.addView(mSurface)
    }

    fun getSurface(): SendBirdVideoView {
        return mSurface
    }
}