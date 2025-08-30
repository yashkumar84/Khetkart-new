import { Link } from "react-router-dom";
import { useT } from "@/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ShieldCheck,
  Leaf,
} from "lucide-react";

export default function Footer() {
  const t = useT();
  return (
    <footer className="mt-16 border-t bg-gradient-to-b from-secondary/60 to-background">
      {/* Top CTA banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/20 to-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-primary" />
            <div className="text-lg font-semibold">
              {t("natural_fresh_local")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder={t("search_placeholder")} className="w-56" />
            <Button>{t("shop_now")}</Button>
          </div>
        </div>
      </div>

      <div className="container grid gap-10 py-12 md:grid-cols-5">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="text-2xl font-extrabold text-primary">
            {t("app_name")}
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {t("footer_about")}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />{" "}
            <span>FSSAI compliant</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <a
              aria-label="facebook"
              href="#"
              className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              aria-label="instagram"
              href="#"
              className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              aria-label="twitter"
              href="#"
              className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              aria-label="youtube"
              href="#"
              className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="font-semibold">{t("about")}</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="#" className="hover:text-primary">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-primary">
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-primary">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <div className="font-semibold">{t("categories")}</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="#" className="hover:text-primary">
                {t("cat_Vegetables")}
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-primary">
                {t("cat_Fruits")}
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-primary">
                {t("cat_Milk")}
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-primary">
                {t("cat_Crops")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Newsletter */}
        <div>
          <div className="font-semibold">Contact</div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4" />
              <span>Gurugram, Haryana, IN</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+911234567890" className="hover:text-primary">
                +91 12345 67890
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:support@khetkart.com"
                className="hover:text-primary"
              >
                support@khetkart.com
              </a>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium">Subscribe for offers</div>
            <div className="mt-2 flex gap-2">
              <Input placeholder="you@example.com" type="email" />
              <Button onClick={() => alert("Subscribed!")}>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-3 py-4 text-xs text-muted-foreground md:flex-row">
          <div>
            © {new Date().getFullYear()} KhetKart · All rights reserved
          </div>
          <div className="flex items-center gap-3">
            <Link to="#" className="hover:text-primary">
              Privacy
            </Link>
            <span>·</span>
            <Link to="#" className="hover:text-primary">
              Refund
            </Link>
            <span>·</span>
            <Link to="#" className="hover:text-primary">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
