import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div>
      <Navbar />
      <main className="container py-10 prose max-w-3xl">
        <h1>About KhetKart</h1>
        <p>
          KhetKart connects farmers and customers directly with fresh produce
          and essentials. Our mission is to empower local producers and deliver
          quality at fair prices.
        </p>
        <h2>What we offer</h2>
        <ul>
          <li>Fresh fruits, vegetables, dairy, and grains</li>
          <li>Farmer portal to manage products</li>
          <li>Delivery partner tools for efficient logistics</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
