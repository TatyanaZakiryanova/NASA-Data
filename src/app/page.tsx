import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-customBackground flex h-screen flex-col items-center p-12">
      <h1 className="gradient-text text-5xl font-bold tracking-wide sm:text-6xl md:text-7xl lg:text-8xl">
        NASA Data
      </h1>
      <span className="text-sm text-white sm:text-base md:text-lg">
        collection of NASA photos and knowledge
      </span>
      <Link
        href="/dashboard"
        className="text-md md:text-l bg-customButton hover:bg-customButtonHover mt-28 flex w-56 cursor-pointer items-center justify-center gap-1 rounded-lg border-none px-5 py-4 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 sm:w-64 sm:px-7 sm:py-5"
      >
        Discover the universe
      </Link>
    </main>
  );
}
