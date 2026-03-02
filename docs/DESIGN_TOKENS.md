# Black Gum Design Tokens & Component Usage Guide

## Color Palette

```
ink:    #0b0b0b  (Main background)
bone:   #f5f0e8  (Primary text, light elements)
gum:    #c7422e  (Primary action color, accent)
moss:   #1b2a26  (Secondary background)
fog:    #d7d1c5  (Secondary text, muted)
ember:  #f1a93a  (Highlights, hover states)
```

## Typography Stack

```
Headings: DM Serif Display (serif, var(--font-display))
  - Font weight: 400
  - Letter spacing: wide, tracking-wide to tracking-[0.3em]
  
Body: Manrope (sans-serif, var(--font-body))
  - Weights: 300, 400 (normal), 500, 600, 700
  - Letter spacing: normal to tracking-[0.2em]
```

## Component Quick Reference

### Button Component
```tsx
import { Button, LinkButton } from '@/components/ui/Button';

// Button element
<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" size="lg">Secondary</Button>
<Button variant="ghost">Ghost</Button>

// Link styled as button
<LinkButton href="/packs" variant="primary">View Packs</LinkButton>

// Variants: primary | secondary | ghost
// Sizes: sm | md | lg
```

### Card Component
```tsx
import Card from '@/components/ui/Card';

<Card variant="glass" padding="lg">
  Content here
</Card>

<Card variant="solid" padding="md">
  Solid background card
</Card>

// Variants: glass | solid | minimal
// Padding: sm (p-4) | md (p-6) | lg (p-8)
```

### Container Component
```tsx
import Container from '@/components/ui/Container';

<Container maxWidth="lg">
  Content with max-width
</Container>

// Max widths: sm (2xl) | md (4xl) | lg (6xl) | xl (7xl) | full
```

### Section Component
```tsx
import Section from '@/components/ui/Section';

<Section spacing="lg" variant="dark">
  Content with spacing and background
</Section>

// Spacing: sm (py-12) | md (py-16) | lg (py-20+)
// Variants: default | dark | light
```

### Badge Component
```tsx
import Badge from '@/components/ui/Badge';

<Badge variant="primary">Featured</Badge>
<Badge variant="secondary">Label</Badge>
<Badge variant="success">Success</Badge>

// Variants: primary | secondary | success | warning
// Always text-xs uppercase tracking-[0.1em]
```

### Input Component
```tsx
import Input from '@/components/ui/Input';

<Input
  label="Name"
  type="text"
  placeholder="Your name"
  error={error}
  required
/>
```

### Textarea Component
```tsx
import Textarea from '@/components/ui/Textarea';

<Textarea
  label="Message"
  placeholder="Your message..."
  rows={6}
  error={error}
/>
```

### SectionTitle Component
```tsx
import SectionTitle from '@/components/ui/SectionTitle';

<SectionTitle
  title="Featured Creative Packs"
  subtitle="Pre-built production systems..."
  action={<LinkButton href="/packs">View All</LinkButton>}
  center={false}
/>
```

## Layout Patterns

### Hero Section
```tsx
<Section spacing="lg">
  <Container maxWidth="lg">
    <Badge variant="primary">Label</Badge>
    <h1 className="text-5xl md:text-6xl font-display...">
      Headline with <span className="text-ember">accent</span>
    </h1>
    <p className="text-lg text-fog">Subheading</p>
    <div className="flex gap-4">
      <LinkButton variant="primary">Primary</LinkButton>
      <LinkButton variant="ghost">Secondary</LinkButton>
    </div>
  </Container>
</Section>
```

### Grid Section
```tsx
<Section spacing="lg" variant="dark">
  <Container maxWidth="xl">
    <SectionTitle title="Section Title" subtitle="..." />
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} variant="solid">
          {/* Card content */}
        </Card>
      ))}
    </div>
  </Container>
</Section>
```

## Spacing Scale (Tailwind 8px Grid)

```
xs:  4px   (p-1)
sm:  8px   (p-2)
md:  12px  (p-3)
lg:  16px  (p-4)
xl:  24px  (p-6)
2xl: 32px  (p-8)
3xl: 40px  (p-10)
```

### Recommended Gaps
- Between buttons: gap-4 (16px)
- Between cards: gap-6 (24px)
- Between sections: py-12 to py-32

## Text Styles

```
// Labels & overlines
text-xs uppercase tracking-[0.2em-0.3em] text-ember

// Headings
font-display font-bold leading-tight text-bone

// Body copy
font-body text-base leading-relaxed text-fog

// Small text / captions
text-sm text-fog/80
```

## Hover States

```
// Card hover
hover:border-ember/60 hover:shadow-2xl transition-all

// Link hover
hover:text-ember transition-colors

// Button hover
hover:bg-gum/90 hover:shadow-xl active:scale-95
```

## Focus States (Accessibility)

```
focus:outline-none 
focus:border-ember/60 
focus:ring-1 
focus:ring-ember/40 
focus:bg-white/10
```

## Responsive Patterns

```tsx
// Mobile-first
<div className="px-6 py-12 md:py-16 lg:py-20">
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {items}
  </div>
</div>

// Text scaling
<h1 className="text-4xl md:text-5xl lg:text-6xl">
  Headline
</h1>
```

## Dark Mode (Built-in)
All components are dark mode by default. No light mode toggle required.
- Background: ink (#0b0b0b)
- Text: bone (#f5f0e8)
- Accents: ember, gum

## CSS Custom Properties

```css
--font-display: DM Serif Display
--font-body: Manrope
--color-ink: #0b0b0b
--color-bone: #f5f0e8
--color-gum: #c7422e
--color-moss: #1b2a26
--color-fog: #d7d1c5
--color-ember: #f1a93a
```

## Image Handling
Components are ready for images. Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="rounded-2xl"
/>
```

---

## Common Implementation Examples

### Feature Card Grid
```tsx
<Section spacing="lg">
  <Container maxWidth="xl">
    <SectionTitle title="Features" />
    <div className="grid gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.id} variant="glass" padding="lg">
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="font-display text-2xl text-bone mb-3">
            {feature.title}
          </h3>
          <p className="text-fog text-sm">{feature.description}</p>
        </Card>
      ))}
    </div>
  </Container>
</Section>
```

### Product Listing
```tsx
<Section spacing="lg" variant="dark">
  <Container maxWidth="xl">
    <SectionTitle title="Products" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Link key={product.id} href={`/${product.slug}`}>
          <Card variant="solid" padding="lg" className="h-full hover:shadow-2xl">
            <Badge variant="primary">{product.category}</Badge>
            <h3 className="font-display text-2xl text-bone mt-3">
              {product.name}
            </h3>
            <p className="text-fog text-sm mt-4">{product.description}</p>
            <p className="text-bone font-display text-lg mt-6">
              {formatCurrency(product.price)}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  </Container>
</Section>
```

---

**Last Updated**: January 29, 2026
**Next.js Version**: 14+ (App Router)
**Tailwind Version**: Latest (v3+)
