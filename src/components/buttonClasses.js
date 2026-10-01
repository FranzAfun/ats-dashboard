const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none'

/** Shared button styles (SPEC.md Section 24). */
export const buttonClasses = {
  primary: `${base} bg-accent text-canvas hover:bg-accent/85`,
  secondary: `${base} border border-control text-text hover:bg-raised`,
  danger: `${base} border border-critical text-critical hover:bg-raised`,
  icon: 'inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-raised hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none',
}
