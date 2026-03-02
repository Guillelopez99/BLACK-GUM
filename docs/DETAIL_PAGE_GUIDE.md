# Detail Page Styling Guide

For individual detail pages (e.g., `/packs/[slug]`, `/blog/[slug]`, etc.), apply the following patterns to maintain consistency with the new design system.

## Detail Page Structure Template

```tsx
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';

export default function DetailPage({ item }) {
  return (
    <div className="w-full">
      {/* Hero/Header Section */}
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="space-y-6 mb-12">
            <Badge variant="primary">{item.category}</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-bone leading-tight">
              {item.title}
            </h1>
            <p className="text-lg text-fog max-w-3xl leading-relaxed">
              {item.description}
            </p>
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section spacing="lg" variant="dark">
        <Container maxWidth="lg">
          <div className="prose-dark space-y-8">
            {/* Rich content here */}
          </div>
        </Container>
      </Section>

      {/* Related Items / CTA Section */}
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-display font-bold text-bone">
              Interested in working together?
            </h2>
            <LinkButton href="/contact" variant="primary" size="lg">
              Get In Touch
            </LinkButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}
```

## Common Detail Page Patterns

### Pack Detail Page (`/packs/[slug]`)

```tsx
<Section spacing="lg">
  <Container maxWidth="lg">
    <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
      {/* Left: Details */}
      <div className="space-y-8">
        <h1 className="text-5xl font-display font-bold text-bone">
          {pack.name}
        </h1>
        <Card variant="solid" padding="lg">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
                Investment
              </p>
              <p className="text-4xl font-display font-bold text-bone mt-3">
                {formatCurrency(pack.priceFrom)}
              </p>
            </div>
            <Button size="lg" className="w-full">
              Inquire About Pack
            </Button>
          </div>
        </Card>
        {/* Description and features */}
      </div>

      {/* Right: Related info or image placeholder */}
      <Card variant="glass" padding="lg">
        <p className="text-fog">{pack.tagline}</p>
      </Card>
    </div>
  </Container>
</Section>
```

### Blog Post Detail Page (`/blog/[slug]`)

```tsx
<Section spacing="lg">
  <Container maxWidth="md">
    <article className="space-y-8">
      {/* Meta */}
      <div className="space-y-4 pb-8 border-b border-white/10">
        <Badge variant="primary">
          {post.publishedAt?.toLocaleDateString()}
        </Badge>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-bone">
          {post.title}
        </h1>
        <p className="text-lg text-fog">{post.excerpt}</p>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none space-y-6">
        {/* Rich HTML content here */}
      </div>

      {/* CTA */}
      <div className="border-t border-white/10 pt-8 mt-12">
        <LinkButton href="/blog" variant="ghost">
          ← Back to Journal
        </LinkButton>
      </div>
    </article>
  </Container>
</Section>
```

### Portfolio/Project Detail Page (`/portfolio/[slug]`)

```tsx
<Section spacing="lg">
  <Container maxWidth="lg">
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-6">
        <Badge variant="success">{project.type}</Badge>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-bone">
          {project.title}
        </h1>
        <p className="text-xl text-fog max-w-3xl leading-relaxed">
          {project.summary}
        </p>
      </div>

      {/* Project Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card variant="glass" padding="lg">
          <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
            Client
          </p>
          <p className="text-bone font-display text-lg mt-3">
            {project.client}
          </p>
        </Card>
        <Card variant="glass" padding="lg">
          <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
            Year
          </p>
          <p className="text-bone font-display text-lg mt-3">
            {project.year}
          </p>
        </Card>
        <Card variant="glass" padding="lg">
          <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
            Format
          </p>
          <p className="text-bone font-display text-lg mt-3">
            {project.format}
          </p>
        </Card>
      </div>

      {/* Full Description */}
      <div className="prose prose-invert max-w-none space-y-6">
        {/* Rich content */}
      </div>
    </div>
  </Container>
</Section>
```

### Rental Detail Page (`/rentals/[slug]`)

```tsx
<Section spacing="lg">
  <Container maxWidth="lg">
    <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        <div className="space-y-4">
          <Badge variant="success">{rental.category}</Badge>
          <h1 className="text-5xl font-display font-bold text-bone">
            {rental.name}
          </h1>
          <p className="text-lg text-fog">{rental.description}</p>
        </div>

        {/* Specs */}
        <Card variant="solid" padding="lg">
          <h3 className="font-display text-2xl font-bold text-bone mb-4">
            Specifications
          </h3>
          <p className="text-fog whitespace-pre-line">{rental.specs}</p>
        </Card>
      </div>

      {/* Booking Card */}
      <Card variant="glass" padding="lg" className="h-fit sticky top-24">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">
              Daily Rate
            </p>
            <p className="text-4xl font-display font-bold text-bone mt-3">
              {formatCurrency(rental.pricePerDay)}
            </p>
          </div>
          <LinkButton href="/contact" variant="primary" size="lg" className="w-full">
            Book Rental
          </LinkButton>
          <p className="text-xs text-fog/70 text-center">
            Contact us for availability and custom rates
          </p>
        </div>
      </Card>
    </div>
  </Container>
</Section>
```

## Typography for Content

For detail page content (blog posts, descriptions), apply these classes:

```tsx
// Paragraph
<p className="text-base leading-relaxed text-fog">Content</p>

// Subheading
<h2 className="text-3xl font-display font-bold text-bone mt-8 mb-4">
  Subheading
</h2>

// Bold emphasis
<strong className="text-bone font-semibold">Important text</strong>

// List items
<ul className="space-y-2 text-fog">
  <li className="flex gap-3">
    <span className="text-ember font-bold">•</span>
    <span>List item text</span>
  </li>
</ul>

// Quote/Callout
<blockquote className="border-l-4 border-ember pl-6 py-4 italic text-fog text-lg">
  "Quote or important message"
</blockquote>
```

## Back Navigation Pattern

```tsx
// Back button at top of detail page
<div className="mb-8">
  <LinkButton href="/packs" variant="ghost" size="sm">
    ← Back to Packs
  </LinkButton>
</div>
```

## Related Items Section

```tsx
<Section spacing="lg" variant="dark">
  <Container maxWidth="xl">
    <h2 className="text-4xl font-display font-bold text-bone mb-8">
      More {category}
    </h2>
    <div className="grid gap-6 md:grid-cols-3">
      {relatedItems.map((item) => (
        <Link key={item.id} href={`/${path}/${item.slug}`}>
          <Card variant="solid" padding="lg" className="h-full hover:shadow-2xl">
            <h3 className="font-display text-xl font-bold text-bone">
              {item.name}
            </h3>
            <p className="text-fog text-sm mt-3">{item.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  </Container>
</Section>
```

## Meta Tags for Detail Pages

```tsx
export const metadata: Metadata = {
  title: `${item.title} | Black Gum`,
  description: item.excerpt || item.summary,
  openGraph: {
    title: `${item.title} | Black Gum`,
    description: item.excerpt || item.summary,
    type: 'article',
    url: `https://blackgum.studio/${path}/${item.slug}`,
    images: [
      {
        url: item.image || '/og-image.png',
        width: 1200,
        height: 630,
        alt: item.title
      }
    ]
  }
};
```

---

## Migration Checklist for Existing Detail Pages

- [ ] Add import for new UI components
- [ ] Replace old card classes with `<Card>` component
- [ ] Replace button classes with `<LinkButton>` component
- [ ] Add `<Badge>` for categories/tags
- [ ] Wrap in `<Section>` for consistent spacing
- [ ] Use `<Container>` for max-width
- [ ] Update heading hierarchy (h1 → h2 → h3)
- [ ] Ensure all headings use `font-display` class
- [ ] Add proper metadata/SEO
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Verify focus states on interactive elements
- [ ] Check color contrast (WCAG AA)

---

**Status**: Ready for implementation on detail pages
**Last Updated**: January 29, 2026
