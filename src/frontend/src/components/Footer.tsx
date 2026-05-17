import { Link } from "@tanstack/react-router";
import { Baby, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "naadani.in")}`;

  return (
    <footer
      className="bg-card border-t border-border mt-auto"
      data-ocid="footer.section"
    >
      {/* Main footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Baby size={16} className="text-primary" />
              </div>
              <span className="font-display font-bold text-xl text-primary">
                Naadani
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-1">
              नन्हे दिलों के लिए, प्यार से बना।
            </p>
            <p className="text-xs text-muted-foreground">
              Pure love for your little bundle of joy.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span
                aria-label="Facebook"
                className="text-muted-foreground"
                data-ocid="footer.facebook_link"
              >
                <Facebook size={18} />
              </span>
              <span
                aria-label="Instagram"
                className="text-muted-foreground"
                data-ocid="footer.instagram_link"
              >
                <Instagram size={18} />
              </span>
              <span
                aria-label="YouTube"
                className="text-muted-foreground"
                data-ocid="footer.youtube_link"
              >
                <Youtube size={18} />
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Clothing", filter: "Clothing" },
                { label: "Diapers", filter: "Diapers" },
                { label: "Toys", filter: "Toys" },
                { label: "Gear", filter: "Gear" },
              ].map((cat) => (
                <li key={cat.label}>
                  <Link
                    to="/catalog"
                    search={{ category: cat.filter }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-ocid={`footer.category_${cat.label.toLowerCase()}_link`}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
              Information
            </h3>
            <ul className="space-y-2">
              {["About Us", "Blog", "Shipping Info", "Return Policy"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@naadani.in</li>
              <li className="leading-relaxed">🏢 Mumbai, Maharashtra, India</li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Cash on Delivery
              </p>
              <p className="text-xs text-muted-foreground">
                Pay when your order arrives 🎁
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-muted/40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} Naadani.in — All rights reserved.</span>
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
