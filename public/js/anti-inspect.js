// // Client-side deterrents. Bypassable by advanced users.
// (function () {
//   var redirectUrl = '/blocked';

//   function redirect() {
//     try {
//       if (location.pathname !== redirectUrl) {
//         location.replace(redirectUrl);
//       }
//     } catch (e) {
//       location.href = redirectUrl;
//     }
//   }

//   // Disable context menu
//   window.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
//     redirect();
//     return false;
//   }, { capture: true });

//   // Block common devtools shortcuts (Mac + Win/Linux)
//   window.addEventListener('keydown', function (e) {
//     var key = (e.key || '').toLowerCase();
//     var isMac = navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
//     var meta = !!e.metaKey;         // Cmd on Mac
//     var ctrl = !!e.ctrlKey;         // Ctrl on Win/Linux
//     var alt  = !!e.altKey;          // Option on Mac
//     var shift = !!e.shiftKey;

//     // F12
//     if (e.keyCode === 123) {
//       e.preventDefault();
//       redirect();
//       return false;
//     }

//     // Mac: Cmd+Option+I/J/C (Chrome/Brave/Edge)
//     if (isMac && meta && alt && ['i', 'j', 'c'].indexOf(key) !== -1) {
//       e.preventDefault();
//       redirect();
//       return false;
//     }

//     // Mac Firefox: Cmd+Option+K opens web console
//     if (isMac && meta && alt && key === 'k') {
//       e.preventDefault();
//       redirect();
//       return false;
//     }

//     // Win/Linux: Ctrl+Shift+I/J/C, and Firefox Ctrl+Shift+K
//     if (!isMac && ctrl && shift && ['i', 'j', 'c', 'k'].indexOf(key) !== -1) {
//       e.preventDefault();
//       redirect();
//       return false;
//     }

//     // View source: Cmd/Ctrl+U
//     if ((meta || ctrl) && key === 'u') {
//       e.preventDefault();
//       redirect();
//       return false;
//     }

//     // Save page: Cmd/Ctrl+S
//     if ((meta || ctrl) && key === 's') {
//       e.preventDefault();
//       redirect();
//       return false;
//     }
//   }, { capture: true });

//   // Heuristic: detect devtools via timing
//   (function detectDevTools() {
//     var thresholdMs = 200;
//     setInterval(function () {
//       var start = performance.now();
//       debugger;
//       var duration = performance.now() - start;
//       if (duration > thresholdMs) {
//         redirect();
//       }
//     }, 1000);
//   })();
// })();


