// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

class Config {
  constructor(config) {
    this.config = config
  }

  set(value) {
    this.config = {...this.config, ...value}
  }

  get(key) {
    return key ? this.config[key] : this.config
  }
}
// initial
const config = new Config({
  listenDomain: [],
  syncURL: ''
})

chrome.storage.sync.get(['listenDomain', 'syncURL'], value => config.set(value))

// register listener
chrome.cookies.onChanged.addListener(function(info) {
  const {cause, cookie: {domain, name, path, value}, removed} = info
  if(config.get('listenDomain').includes(domain) && removed === false && cause === 'explicit') {
    chrome.cookies.set({
      url: config.get('syncURL'),
      name,
      value,
      path,
    }, msg => console.log('sync success:', msg))
  }
})

// msg handler
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function({ type, payload }) {
    if (type === 'initial') {
      config.set(payload)
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Setting Successfully',
        message: `Now Listening: ${payload.listenDomain.join(', ')}`,
      });
    }
  })
})
