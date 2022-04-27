package com.sendbird.calls.reactnative

import com.facebook.react.bridge.Promise

class RNSendbirdCallsModuleImpl {
    companion object {
        const val NAME = "RNSendbirdCalls";
        fun multiply(a: Int, b: Int, promise: Promise) {
            promise.resolve(a * b)
        }
    }
}