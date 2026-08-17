

export const BackgroundSnippet = () => {
  return (
    <div className="absolute inset-0 z-[-1] h-full w-full bg-[var(--color-bg-main)]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      {/* Soft purple glow at the top */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent-primary)]/20 blur-[120px]"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent-secondary)]/20 blur-[120px]"></div>
    </div>
  );
};
