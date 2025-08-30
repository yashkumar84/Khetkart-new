export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-secondary/30">
      <div className="container grid gap-6 py-10 md:grid-cols-4">
        <div>
          <div className="text-xl font-bold">KhetKart</div>
          <p className="mt-2 text-sm text-muted-foreground">Fresh farm delivery: vegetables, fruits, milk, and more.</p>
        </div>
        <div>
          <div className="font-semibold">About</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Terms</a></li>
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
          <div className="font-semibold">Languages</div>
          <div className="mt-2 text-sm text-muted-foreground">English / हिन्दी</div>
        </div>
      </div>
    </footer>
  );
}
