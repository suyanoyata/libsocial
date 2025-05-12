import { Alert, AlertDescription } from "components/ui/alert";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <Alert className="mt-2" variant="destructive">
        <AlertDescription className="font-medium text-xs">
          Remote chapter downloading may not work correctly. Check twice if chapter was downloaded
          fully.
        </AlertDescription>
      </Alert>
    </main>
  );
}
