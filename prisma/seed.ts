import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail }
  });
  if (existing) {
    console.log("Admin user already exists for", email);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: {
        email: normalizedEmail,
        passwordHash
      }
    });
    console.log("Admin user created for", normalizedEmail);
  }

  // Create example campaign pack
  const existingPack = await prisma.pack.findUnique({
    where: { slug: "lanzamiento-cinematografico" }
  });

  if (!existingPack) {
    await prisma.pack.create({
      data: {
        name: "Lanzamiento Cinematográfico",
        slug: "lanzamiento-cinematografico",
        tagline: "Impacto visual máximo para tus debuts más ambiciosos",
        description:
          "Un sistema premium diseñado para campañas de lanzamiento que exigen presencia cinematográfica. Incluye producción de contenido hero, assets de alta calidad para redes y estrategia de difusión visual. Perfecto para marcas que quieren causar impacto desde el primer segundo.",
        kind: "campaign",
        priceFrom: 8500,
        isFeatured: true,
        imagePath: "/paquetes/pack-1.jpg",
        deliverables: JSON.stringify([
          "1 video hero cinematográfico (2-4 min)",
          "5 assets visuales en 4K",
          "Diseño gráfico para redes",
          "Estrategia de difusión",
          "Dirección de fotografía premium"
        ])
      }
    });
    console.log("Created example campaign pack: Lanzamiento Cinematográfico");
  } else {
    console.log("Example pack already exists");
  }

  // Create example rental items
  const existingSmallHD = await prisma.rentalItem.findUnique({
    where: { slug: "smallhd-cine-18" }
  });

  if (!existingSmallHD) {
    await prisma.rentalItem.create({
      data: {
        name: "SmallHD Cine 18",
        slug: "smallhd-cine-18",
        category: "camera",
        pricePerDay: 350,
        weekendPrice: 420,
        deposit: 1500,
        stock: 2,
        isActive: true,
        imagePath: "/paquetes/pack-1.jpg",
        specs: "18\" UHD 4K (3840x2160) | 1100 nits High-Bright | 10-bit 100% Rec.709 | 4x 12G-SDI IN/OUT | HDMI 2.0 | Waveform, vectorscope, false color, focus assist, 3D LUTs"
      }
    });
    console.log("Created rental: SmallHD Cine 18");
  } else {
    await prisma.rentalItem.update({
      where: { slug: "smallhd-cine-18" },
      data: {
        imagePath: "/paquetes/pack-1.jpg"
      }
    });
    console.log("Updated rental imagePath: SmallHD Cine 18");
  }

  const existingTeradek = await prisma.rentalItem.findUnique({
    where: { slug: "teradek-bolt-6-lt-750" }
  });

  if (!existingTeradek) {
    await prisma.rentalItem.create({
      data: {
        name: "Teradek Bolt 6 LT 750",
        slug: "teradek-bolt-6-lt-750",
        category: "audio",
        pricePerDay: 280,
        weekendPrice: 336,
        deposit: 1200,
        stock: 3,
        isActive: true,
        imagePath: "/paquetes/pack-2.jpg",
        specs: "Set TX + RX | Alcance 750 ft (línea de visión) | Zero-Delay (tiempo real) | Bandas 6 GHz + 5 GHz | Hasta 4K30 por HDMI | Hasta 6 RX por TX | AES-256"
      }
    });
    console.log("Created rental: Teradek Bolt 6 LT 750");
  } else {
    await prisma.rentalItem.update({
      where: { slug: "teradek-bolt-6-lt-750" },
      data: {
        imagePath: "/paquetes/pack-2.jpg"
      }
    });
    console.log("Updated rental imagePath: Teradek Bolt 6 LT 750");
  }

  // ─── Seed booking-system Products ─────────────────────────────
  const products = [
    { name: "SmallHD Cine 18", slug: "smallhd-cine-18" },
    { name: "Teradek Bolt 6 LT 750", slug: "teradek-bolt-6-lt-750" }
  ];

  for (const p of products) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      await prisma.product.create({
        data: { name: p.name, slug: p.slug, inventoryCount: 1, active: true }
      });
      console.log(`Created booking product: ${p.name}`);
    } else {
      console.log(`Booking product already exists: ${p.name}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
