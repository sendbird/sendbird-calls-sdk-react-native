package com.sendbird.calls.reactnative.extension

import com.sendbird.calls.AudioDevice

fun AudioDevice.asString() = when (this) {
    AudioDevice.EARPIECE -> "NONE"
    AudioDevice.SPEAKERPHONE -> "NO_ANSWER"
    AudioDevice.WIRED_HEADSET -> "CANCELED"
    AudioDevice.BLUETOOTH -> "DECLINED"
}

