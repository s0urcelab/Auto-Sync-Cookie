// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// initial
const config = {
    listenDomain: [],
    syncURL: ''
}

// get config from chrome.storage
chrome.storage.sync.get(['listenDomain', 'syncURL'], ({ listenDomain = [], syncURL = '' }) => {
    config.listenDomain = listenDomain
    config.syncURL = syncURL
})

// update config
chrome.storage.onChanged.addListener(function({ listenDomain, syncURL }) {
    if (listenDomain) {
        config.listenDomain = listenDomain.newValue
    }
    if (syncURL) {
        config.syncURL = syncURL.newValue
    }

    // notify
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Setting Successfully',
        message: `Now Listening: ${config.listenDomain.join(', ')}`,
    })
})

console.log("listen")
// register cookies listener
chrome.cookies.onChanged.addListener(function(info) {
    const {cause, cookie: {domain, name, path, value}, removed} = info
    console.log(domain, config.listenDomain, "config.listenDomain")
    if(config.listenDomain.includes(domain) && removed === false && cause === 'explicit') {
        chrome.cookies.set({
            url: config.syncURL,
            name,
            value,
            path,
        }, msg => console.log('sync success:', msg))
    }
})
