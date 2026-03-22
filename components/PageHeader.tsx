"use client";

interface PageHeaderProps {
  title: string;
  imageUrl: string;
  imageAlt?: string;
}

export function PageHeader({ title, imageUrl, imageAlt = "" }: PageHeaderProps) {
  return (
    <header className="relative">
      <div className="relative h-[40vh] min-h-[280px] max-h-[420px] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover object-center"
          style={{ filter: "brightness(0.7)" }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-4xl font-bold uppercase tracking-wider text-white drop-shadow-lg md:text-5xl">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
