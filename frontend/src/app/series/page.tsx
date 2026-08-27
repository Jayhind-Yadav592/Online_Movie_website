import Header from "@/components/layout/Header";

export default function SeriesPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Header />
      <div className="container mx-auto px-4 md:px-16 mb-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">TV Series & Shows</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We are currently working on curating the best TV series for you. Check back soon for our launch!
        </p>
      </div>
    </main>
  );
}
