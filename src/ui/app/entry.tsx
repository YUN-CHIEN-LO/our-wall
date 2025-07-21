"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Code from "./code";
import { fetchAlbum } from "./async-helper";

export default function Entry() {
  const router = useRouter();
  const defaultCode = undefined;
  const [code, setCode] = useState<string | undefined>(undefined);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleComplete = (code: string) => {
    if (code?.length === 6) {
      setCode(code);
    }
    setRefreshFlag(refreshFlag + 1);
  };

  useEffect(() => {
    if (code) {
      fetchAlbum(code)
        .then(({ id }) => {
          router.push(`/${id}`);
        })
        .catch((error) => {
          console.warn(error.message);
        });
    }
  }, [code]);

  return (
    <div>
      <Code
        key={refreshFlag}
        defaultCode={defaultCode}
        onComplete={handleComplete}
      />
    </div>
  );
}
