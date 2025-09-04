export const Hero = () => {
  return (
    <section className="relative flex items-center justify-center h-screen overflow-hidden">
      {/* This div is prepared for a background video, currently showing a dark background. */}
      <div className="absolute inset-0 bg-black z-0" />
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-4 text-foreground">
          SM Movement
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
          Exclusiviteit in beweging. Van premium auto's en luxe boten tot meesterlijke detailing en tuning.
        </p>
      </div>
    </section>
  );
};