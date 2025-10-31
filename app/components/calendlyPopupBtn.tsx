"use client";

import Script from "next/script";

const CalendlyPopupBtn = () => {
  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <Script id="calendly-badge-init" strategy="afterInteractive">{`
        window.addEventListener('load', function () {
          if (typeof Calendly !== 'undefined' && Calendly.initBadgeWidget) {
            Calendly.initBadgeWidget({
              url: 'https://calendly.com/iliesh-daniel?hide_gdpr_banner=1&hide_landing_page_details=1&primary_color=4ade80&background_color=00000',
              text: "Let's Meet",
              color: '#4ade80',
              textColor: '#ffffff',
              branding: true
            });
          }
        });
      `}</Script>
    </>
  );
};

export default CalendlyPopupBtn;
