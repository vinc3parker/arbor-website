# ArborEightDimensions

A cleaner Next.js / React version of the Arbor eight dimensions hero.

## Install

Copy these files into your project, for example:

```txt
components/ArborEightDimensions.tsx
components/ArborEightDimensions.module.css
```

Then import it into a Next.js page:

```tsx
import ArborEightDimensions from '@/components/ArborEightDimensions';

export default function HomePage() {
  return <ArborEightDimensions />;
}
```

## Why this version should be less glitchy

- No manual DOM injection.
- No separate 2D hit-proxy layer.
- No fixed portal resizing from live 3D bounds.
- Scroll progress is throttled through `requestAnimationFrame`.
- Hover and scroll states are separated.
- The layout uses stable 2D transforms instead of heavy nested 3D transforms.
