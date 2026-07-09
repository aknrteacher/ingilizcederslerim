/** Dev reminder: classroom data is not on a persistent backend yet. */
export function ClassroomBackendNote() {
  return (
    <div
      data-dev-note="classroom-backend-todo"
      className="mb-4 rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <strong>Dev note:</strong> Classroom API uses in-memory storage on Vercel — data may reset or
      disagree between visits. Fix with a proper database when backend features are added.
    </div>
  );
}
