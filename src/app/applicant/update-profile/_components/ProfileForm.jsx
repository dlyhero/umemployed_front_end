"use client";

export function ProfileForm({ children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}
    </form>
  );
}