// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const port = chrome.extension.connect();

document.addEventListener('DOMContentLoaded', function() {
  const ls = document.querySelector('#listen-domain')
  const sy = document.querySelector('#sync-url')
  const syncBtn = document.querySelector('#save-btn')

  chrome.storage.sync.get(['listenDomain', 'syncURL'], ({ listenDomain, syncURL }) => {
    ls.value = listenDomain.join('\n') || ''
    sy.value = syncURL || ''
  })

  syncBtn.onclick = () => {
    const listenDomain = ls.value.trim().split(/\n/)
    const syncURL = sy.value.trim()
    if (listenDomain && syncURL) {
      chrome.storage.sync.set({ listenDomain, syncURL })
      port.postMessage({
      	type: 'initial',
      	payload: { listenDomain, syncURL }
      })
    }
  }

})
