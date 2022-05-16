package com.sendbird.calls.reactnative

import android.content.Context
import android.graphics.Point
import android.view.ViewGroup
import com.sendbird.calls.SendBirdVideoView
import org.webrtc.RendererCommon
import org.webrtc.RendererCommon.ScalingType


enum class ViewType {
    LOCAL, REMOTE
}

class RNSendbirdCallsVideoView(context: Context) : ViewGroup(context) {
    var type: ViewType = ViewType.LOCAL
    val surface: SendBirdVideoView

    var frameHeight: Int = 0
    var frameRotation: Int = 0
    var frameWidth: Int = 0
    var scalingType: ScalingType? = null

    private val layoutSyncRoot = Any()

    init {
        surface = SendBirdVideoView(context)
        surface.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        addView(surface)
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        var ll = l
        var tt = t
        var rr = r
        var bb = b

        val height = bb - tt
        val width = rr - ll

        if (height == 0 || width == 0) {
            ll = 0
            tt = 0
            rr = 0
            bb = 0
        } else {
            val frameHeight: Int
            val frameRotation: Int
            val frameWidth: Int
            val scalingType: ScalingType?
            synchronized(layoutSyncRoot) {
                frameHeight = this.frameHeight
                frameRotation = this.frameRotation
                frameWidth = this.frameWidth
                scalingType = this.scalingType
            }
            when (scalingType) {
                ScalingType.SCALE_ASPECT_FILL -> {
                    // Fill this ViewGroup with surfaceViewRenderer and the latter
                    // will take care of filling itself with the video similarly to
                    // the cover value the CSS property object-fit.
                    rr = width
                    ll = 0
                    bb = height
                    tt = 0
                }
                ScalingType.SCALE_ASPECT_FIT ->                 // Lay surfaceViewRenderer out inside this ViewGroup in accord
                    // with the contain value of the CSS property object-fit.
                    // SurfaceViewRenderer will fill itself with the video similarly
                    // to the cover or contain value of the CSS property object-fit
                    // (which will not matter, eventually).
                    if (frameHeight == 0 || frameWidth == 0) {
                        bb = 0
                        rr = bb
                        tt = rr
                        ll = tt
                    } else {
                        val frameAspectRatio =
                            if (frameRotation % 180 == 0) frameWidth / frameHeight.toFloat() else frameHeight / frameWidth.toFloat()
                        val frameDisplaySize: Point = RendererCommon.getDisplaySize(
                            scalingType,
                            frameAspectRatio,
                            width, height
                        )
                        ll = (width - frameDisplaySize.x) / 2
                        tt = (height - frameDisplaySize.y) / 2
                        rr = ll + frameDisplaySize.x
                        bb = tt + frameDisplaySize.y
                    }
                else -> if (frameHeight == 0 || frameWidth == 0) {
                    bb = 0
                    rr = bb
                    tt = rr
                    ll = tt
                } else {
                    val frameAspectRatio =
                        if (frameRotation % 180 == 0) frameWidth / frameHeight.toFloat() else frameHeight / frameWidth.toFloat()
                    val frameDisplaySize: Point = RendererCommon.getDisplaySize(
                        scalingType,
                        frameAspectRatio,
                        width, height
                    )
                    ll = (width - frameDisplaySize.x) / 2
                    tt = (height - frameDisplaySize.y) / 2
                    rr = ll + frameDisplaySize.x
                    bb = tt + frameDisplaySize.y
                }
            }
        }
        surface.layout(ll, tt, rr, bb)
    }
}