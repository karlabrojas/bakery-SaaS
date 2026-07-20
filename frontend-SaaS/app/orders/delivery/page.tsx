"use client";

import { Suspense } from "react";
import DeliveryPageContent from "./DeliveryPageContent";

export default function DeliveryPage() {
  return (
    <Suspense fallback={<div>Cargando logística de entrega...</div>}>
      <DeliveryPageContent />
    </Suspense>
  );
}
