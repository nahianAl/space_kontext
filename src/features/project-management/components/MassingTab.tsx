/**
 * Massing tab component placeholder
 * Future feature for massing diagram visualization and editing
 */
export default function MassingTab({ projectId }: { projectId: string}) {
  return (
    <div className="h-full w-full p-8 text-center">
      <p className="text-muted-foreground">Coming soon...</p>
      <p className="text-sm text-muted-foreground mt-2">Project ID: {projectId}</p>
    </div>
  );
}

