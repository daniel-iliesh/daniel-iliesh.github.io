"use client";

import Script from "next/script";

const CalComPopupBtn = () => {
  return (
    <Script id="calcom-badge-init" strategy="afterInteractive" >
      {`
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    Cal("init", "30min", {origin:"https://app.cal.com"});

  Cal.ns["30min"]("floatingButton", {"calLink":"daniel-iliesh/30min","config":{"layout":"week_view"}}); 
  Cal.ns["30min"]("ui", {"hideEventTypeDetails":false,"layout":"week_view"});
`}
    </Script>
  );
};

export default CalComPopupBtn;
