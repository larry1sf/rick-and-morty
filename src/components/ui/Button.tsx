import type React from "react";

export default function Button({
  onClick,
  children,
  variantColor = "primary",
  isLink,
  className,
  params,
  as: Component = "button",
}: {
  params?: any;
  isLink?: {
    title: string;
    href: string;
  };
  children: React.ReactNode;
  onClick?: () => void;
  variantColor?: "primary" | "secondary";
  className?: string;
  as?: "button" | "div" | "span";
}) {
  const colorButton =
    variantColor === "primary"
      ? "bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/60 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)] shadow-primary/20"
      : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 text-slate-300 hover:text-white shadow-lg";

  const classBase = `group/btn relative cursor-pointer inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full border backdrop-blur-md transition-all duration-300 active:scale-95 text-xs font-black uppercase tracking-[0.2em] overflow-hidden ${colorButton} ${className || ""}`;

  const InnerContent = () => (
    <>
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
      {/* Premium Shine Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[35deg] group-hover/btn:left-[100%] transition-all duration-700 ease-in-out"></div>
      </div>
    </>
  );

  if (typeof isLink === "object") {
    return (
      <a
        {...params}
        href={isLink.href}
        title={isLink.title}
        className={classBase}
      >
        <InnerContent />
      </a>
    );
  }

  return (
    <Component
      {...params}
      onClick={onClick}
      className={classBase}
    >
      <InnerContent />
    </Component>
  );
}

