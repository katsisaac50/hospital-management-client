// ./utils/canUseDom.js
function canUseDom() {
    return typeof window !== 'undefined' && !!window.document && !!window.document.createElement;
  }
  
  module.exports = canUseDom;
  
