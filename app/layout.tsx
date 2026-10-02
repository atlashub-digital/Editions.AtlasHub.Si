import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://editions.atlashub.si"),
  title: {
    default: "AtlasHub Editions",
    template: "%s · AtlasHub Editions",
  },
  description: "Books, research and executive intelligence for the augmented age.",
  openGraph: {
    title: "AtlasHub Editions",
    description: "Ideas for the Augmented Age.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
