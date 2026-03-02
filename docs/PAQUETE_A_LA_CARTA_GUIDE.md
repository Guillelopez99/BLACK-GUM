# Paquete a la Carta - Custom Package Configurator

## Overview

The **Paquete a la Carta** is a self-contained, modular package configurator built into Black Gum Studio's website. It allows customers to build custom video production packages by selecting base parameters and adding optional services, with real-time pricing calculation.

**Location:** `src/components/packs/PackConfigurator.tsx`

## Features

✅ **Real-time Pricing**: Base price + add-ons calculated instantly
✅ **localStorage Persistence**: User selections saved across refreshes
✅ **Responsive Design**: Mobile-first, optimized for all screen sizes
✅ **Collapsible Categories**: 5 organized sections (Contenido, Producción, Postproducción, Crecimiento, Extras)
✅ **Tiered Add-ons**: Many services have multiple levels (e.g., Editing: Basic/Advanced)
✅ **Automatic Discounts**: Lot discounts (4+ videos -5%, 8+ -10%) + subscription discount
✅ **Proposal Modal**: Contact form that captures configuration as JSON
✅ **Accessibility**: Keyboard navigation, ARIA labels, good contrast
✅ **Inline SVG Icons**: Thin-line style consistent with brand design

## Configuration: Single Source of Truth

### Editing Prices & Add-ons

All pricing configuration is in the **`PRICING_CONFIG`** object at the top of the component:

```typescript
const PRICING_CONFIG = {
  base: {
    pricePerVideo: 450,  // EUR per video
    lengthMultipliers: {
      "15": 0.8,
      "30": 1,
      "60": 1.3,
      "90": 1.6,
      custom: 1.5
    }
  },
  addOns: {
    contenido: [ ... ],
    produccion: [ ... ],
    postproduccion: [ ... ],
    crecimiento: [ ... ],
    extras: [ ... ]
  }
};
```

### Base Price Formula

```
Base Price = (Number of Videos) × (Price per Video) × (Length Multiplier)
```

**Example:**
- 4 videos × €450 × 1.0 (30s) = €1,800 base

### Adding a New Add-on

1. **Find the category** in `PRICING_CONFIG.addOns` (or create a new category)
2. **Add the object** to the array:

```typescript
{
  id: "unique-id",                    // Must be unique
  name: "Feature Name",               // Display name
  category: "contenido",              // Category ID
  description: "Short description",
  icon: "camera",                     // Icon name from IconSet
  tooltip: "What does this include?", // Optional help text
  price: 250,                         // Fixed price OR
  tiers: [                            // Multiple levels
    { id: "basic", label: "Basic", price: 100 },
    { id: "advanced", label: "Advanced", price: 300 }
  ],
  defaultTier: "basic",               // Default selected tier
  perVideo: false,                    // true = multiply by video count
  oneTime: false                      // true = appears in one-time fees section
}
```

### Example: Adding a "Dubbing" Service

```typescript
{
  id: "dubbing",
  name: "Doblaje",
  category: "postproduccion",
  description: "Traducción y doblaje profesional",
  icon: "volume",
  tooltip: "Doblaje profesional en múltiples idiomas",
  tiers: [
    { id: "none", label: "Ninguno", price: 0 },
    { id: "1lang", label: "1 idioma", price: 400 },
    { id: "2langs", label: "2 idiomas", price: 700 }
  ],
  defaultTier: "none",
  perVideo: true  // Multiply by number of videos
}
```

## Component Structure

### Main Component: `PackConfigurator`

The root component that manages all state and rendering.

**State:**
```typescript
interface ConfigState {
  videosCount: number;              // 1-20
  videoLength: "15"|"30"|"60"|"90"|"custom";
  customLength?: number;            // For custom lengths
  aspectRatio: "9:16"|"1:1"|"16:9";
  deliveryFrequency: "once"|"weekly"|"biweekly"|"monthly";
  selectedAddOns: Record<string, string | boolean>;
}
```

### Sub-components

1. **NumberStepper**
   - Input for video count
   - Slider + manual buttons

2. **SegmentedControl**
   - Radio-style buttons for options
   - Used for length, aspect ratio, frequency, and tiers

3. **AddOnChip**
   - Toggle button for each add-on
   - Shows tier selector if available

4. **CategorySection**
   - Collapsible category with add-ons inside
   - Controlled via local state

5. **Tooltip**
   - Info icon with hover tooltip
   - Shows `tooltip` text from add-on config

6. **PriceSummary**
   - Displays breakdown of costs
   - Shows discounts applied

7. **ProposalModal**
   - Form to request a quote
   - Captures name, email, company, notes
   - Can be extended to send to backend

## Pricing Calculation Logic

### Discounts Applied Automatically

1. **Lot Discount:**
   - 4+ videos: -5%
   - 8+ videos: -10%

2. **Subscription Discount:**
   - Delivery frequency = "monthly": -8% on all costs

### Example Calculation

```
Configuration:
- 4 videos × €450 × 1.0 (30s) = €1,800 (base)
- Editing (advanced) = €200
- SEO (basic) = €100
- Subtotal = €2,100

Discounts:
- Lot discount (4 videos) = €2,100 × -5% = -€105

Total = €1,995
```

## Customization Guide

### Change Color Scheme

The component uses Tailwind classes from your design system:
- `ember` (warm orange) - Primary accent
- `gum` (red) - Secondary
- `bone` (light) - Text
- `fog` (medium gray) - Secondary text
- `ink` (dark) - Background

To change colors, edit the Tailwind classes in the components (e.g., `bg-ember` → `bg-your-color`).

### Add New Category

1. Add to `CATEGORY_ORDER`:
```typescript
const CATEGORY_ORDER = [
  { id: "new-category", label: "📌 New Category", icon: "📌" }
];
```

2. Add to `PRICING_CONFIG.addOns`:
```typescript
addOns: {
  "new-category": [
    { id: "addon1", ... }
  ]
}
```

3. Add new icon to `IconSet` if needed (inline SVG)

### Modify Discount Rules

Edit the discount calculation in the `useEffect` that calculates pricing:

```typescript
// Around line 1050
// Lot discount
if (state.videosCount >= 8) {
  breakdown.discounts["Descuento 8+ vídeos"] = -totalBeforeDiscount * 0.15; // Change 0.1 to 0.15
} else if (state.videosCount >= 4) {
  breakdown.discounts["Descuento 4+ vídeos"] = -totalBeforeDiscount * 0.07; // Change 0.05 to 0.07
}
```

### Connect Proposal Modal to Backend

The `ProposalModal` currently logs data to console. To send to backend:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const proposalData = {
    ...formData,
    configuration: config,
    estimatedPrice: pricing.total,
    timestamp: new Date().toISOString()
  };

  // Send to your API endpoint
  const response = await fetch('/api/proposals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proposalData)
  });

  if (response.ok) {
    setIsSubmitted(true);
    // ... rest of success logic
  }
};
```

## localStorage Integration

Saves configuration to `localStorage.packConfigurator` as JSON.

**Reset button** clears localStorage and resets form.

To disable localStorage, remove or comment out:
```typescript
// Lines ~1090
useEffect(() => {
  localStorage.setItem("packConfigurator", JSON.stringify(state));
}, [state, isMounted]);
```

## Navigation & Anchor Links

The section is anchored with `id="paquete-a-la-carta"`.

**Smooth scroll to configurator:**
```html
<a href="#paquete-a-la-carta">Configure Your Package</a>
```

On the homepage, the hero section includes a button:
```tsx
<a href="#paquete-a-la-carta" className="...">
  Configurar Paquete
</a>
```

## Accessibility

✅ ARIA labels on all buttons
✅ Keyboard navigation (Tab, Enter, Arrow keys)
✅ Good color contrast (WCAG AA compliant)
✅ Semantic HTML elements
✅ Form validation before submission

## Mobile Responsiveness

**Breakpoints:**
- Mobile: < 768px → Single column layout, bottom summary
- Tablet: 768px-1024px → 2-column grid
- Desktop: > 1024px → Sticky right sidebar summary

**CSS Grid Layout:**
```tsx
<div className="grid lg:grid-cols-3 gap-8">
  {/* Left: 2/3 width on desktop, full on mobile */}
  <div className="lg:col-span-2">Configurator</div>
  
  {/* Right: 1/3 width, sticky on desktop */}
  <div className="lg:sticky lg:top-24">Summary</div>
</div>
```

## Testing Checklist

- [ ] Base price calculates correctly
- [ ] Add-ons toggle on/off
- [ ] Tier changes update pricing
- [ ] Discounts apply (4+ videos, monthly)
- [ ] localStorage persists on refresh
- [ ] Reset button clears config
- [ ] Proposal modal form validates
- [ ] Mobile layout works correctly
- [ ] All icons display
- [ ] Tooltips show on hover
- [ ] Smooth scrolling works

## Performance Notes

- Component uses `useState` and `useEffect` for state management
- Pricing calculation runs on every `state` change (optimized for small dataset)
- localStorage access is debounced to mount time
- No external heavy libraries (uses Tailwind + inline SVGs)

## Future Enhancements

1. **Backend Integration**: Connect proposal form to email/CRM
2. **Custom Video Length**: Allow users to input custom durations
3. **Timeline Visualization**: Show production calendar
4. **Payment Integration**: Add Stripe for immediate payments
5. **Template Presets**: "Quick packs" (e.g., "Social Media Starter")
6. **Bulk Discounts**: Multi-year pricing
7. **A/B Testing**: Track which features customers select
8. **PDF Export**: Generate quote document
9. **Multi-language Support**: Spanish + English toggles
10. **Analytics**: Track configurator usage

## Troubleshooting

### Prices Not Updating
- Check that the pricing calculation `useEffect` has `state` in its dependency array
- Verify add-on `id` matches in selected items

### localStorage Not Working
- Check browser storage is enabled
- Verify no privacy mode is blocking storage
- Clear browser cache if stale data persists

### Icons Not Showing
- Ensure icon name exists in `IconSet` object
- Check SVG viewBox dimensions (should be "0 0 24 24")

### Discounts Not Applying
- Verify discount thresholds in the pricing `useEffect`
- Check that `deliveryFrequency` is "monthly" for subscription discount
- Ensure discount calculation comes AFTER all add-ons are summed

## Support

For issues or feature requests, contact the development team or file an issue in the project repository.

---

**Component Author**: GitHub Copilot
**Last Updated**: February 2026
**Version**: 1.0.0
