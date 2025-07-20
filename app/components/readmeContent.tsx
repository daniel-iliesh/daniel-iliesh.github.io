'use client';

import React, { useEffect, useState } from 'react';

export default function ReadmeContent({ htmlContent }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[20px] bg-gray-800 animate-pulse rounded"></div>;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
