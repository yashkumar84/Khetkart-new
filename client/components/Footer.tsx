import { useT } from "@/i18n";

export default function Footer() {
  const t = useT();
  return (
    <footer className="mt-16 border-t bg-gradient-to-b from-secondary/60 to-background">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="text-2xl font-extrabold text-primary">{t("app_name")}</div>
          <p className="mt-2 text-sm text-muted-foreground">{t("footer_about")}</p>
        </div>
        <div>
          <div className="font-semibold">{t("about")}</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><a href="#">{t("about")}</a></li>
            <li><a href="#">{t("contact")}</a></li>
            <li><a href="#">{t("terms")}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Social</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><a href="#">Twitter/X</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">{t("languages")}</div>
          <div className="mt-2 text-sm text-muted-foreground">{t("english")} / {t("hindi")}</div>
        </div>
      </div>
    </footer>
  );
}
