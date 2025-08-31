import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <main className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input placeholder="Your name" />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-1">
            <Label>Message</Label>
            <textarea
              className="min-h-[120px] rounded border p-2"
              placeholder="How can we help?"
            />
          </div>
          <Button>Send</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
