@objc(RNSendbirdCalls)
@import SendBirdCalls
@import AVFAudio
class RNSendbirdCalls: NSObject {

    @objc func multiply(_ a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
}
