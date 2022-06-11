//
//  BaseVideoView.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/06/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls

class BaseVideoView: UIView {
    var surface: SendBirdVideoView
    
    override init(frame: CGRect) {
        surface = SendBirdVideoView()
        surface.frame = frame
        super.init(frame: frame)
    }
    
    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
