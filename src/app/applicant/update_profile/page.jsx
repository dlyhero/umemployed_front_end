"use client";

import { Suspense } from "react";
import { EditProfileContent } from "./EditProfileContent";

export default function EditProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile editor...</div>}>
      <EditProfileContent />
    </Suspense>
  );
}
