import { AppVersion } from "@/components/app-version";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">خانه</h1>
      </main>
      <footer className="flex justify-center pb-4">
        <AppVersion />
      </footer>
    </>
  );
}
