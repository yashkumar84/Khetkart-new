import { useT } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920&auto=format&fit=crop",
    title: "Farm-fresh veggies",
    sub: "Handpicked every morning",
  },
  {
    img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f0?q=80&w=1920&auto=format&fit=crop",
    title: "Seasonal fruits",
    sub: "Sweet, juicy and natural",
  },
  {
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1920&auto=format&fit=crop",
    title: "Dairy you can trust",
    sub: "Pure milk and paneer",
  },
];

export default function HomeHero() {
  const t = useT();
  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <Badge className="w-fit" variant="secondary">
            {t("banner")}
          </Badge>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground">
            {t("hero_title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("hero_sub")}</p>
          <div className="mt-4 flex gap-2">
            <Button>{t("shop_now")}</Button>
            <Button variant="secondary">{t("top_deals")}</Button>
          </div>
        </div>
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {slides.map((s, i) => (
                <CarouselItem key={i}>
                  <div className="aspect-[16/9] overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line */}
                    <img
                      src={s.img}
                      alt={s.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
