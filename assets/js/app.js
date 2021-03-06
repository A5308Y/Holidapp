// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"
import {Socket} from "phoenix"
import NProgress from "nprogress"
import {LiveSocket} from "phoenix_live_view"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
window.addEventListener("phx:page-loading-start", info => NProgress.start())
window.addEventListener("phx:page-loading-stop", info => NProgress.done())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)
window.liveSocket = liveSocket

import { Elm } from "../elm/src/Main.elm"

var node = document.getElementById("app");
var app = Elm.Main.init({ node: node, flags: OpenCageDataApiKey });

app.ports.requestCoordinates.subscribe(function(_) {
  var options = {enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

  function success(position) {
    app.ports.coordinateReceiver.send([position.coords.latitude, position.coords.longitude]);
  }

  function error(err) {
    app.ports.locationBlockedReceiver.send(true)
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
});
