import Link from "next/link"
import Image from "next/image"
import { Facebook, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { XIcon } from "@/components/icons/x-icon"

export function SiteFooter({ settings }: { settings: Record<string, any> }) {
  const navigation = settings.navigation || {
    links: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Programs", href: "/programs" },
      { title: "Blog", href: "/blog" },
      { title: "Gallery", href: "/gallery" },
      { title: "Resources", href: "/resources" },
      { title: "Contact", href: "/contact" },
    ],
  }

  // Use the contact_info from settings, or fall back to accurate default data
  const contactInfo = settings.contact_info || {
    address: "Belameling Vocational Training Centre, Palorinya Refugee Settlement, Obongi District, Uganda",
    email: "yefosr@gmail.com",
    phone: ["+256 772 253 415", "+256 765 167 682", "+211 925 059 964"],
    whatsapp: "+256 772 253 415",
  }

  // Use social_links from settings, or fall back to accurate default data
  const socialLinks = settings.social_links || {
    facebook: "https://facebook.com/profile.php?id=100064325486694",
    linkedin: "https://linkedin.com/groups/13160404",
    twitter: "", // Will be added later
  }

  return (
    <footer className="border-t bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Youth Empowerment Logo" width={40} height={40} className="h-10 w-auto" />
              <div>
                <span className="font-bold">Youth Empowerment For Self Reliance - YEFOSR</span>
                <span className="text-primary ml-2 italic">Inspiring Generations!</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Empowering youth for a better future through education, skills development, and community engagement.
            </p>

            <div className="flex gap-4 mt-6">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </a>
              )}

              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Linkedin className="h-5 w-5 text-blue-700 dark:text-blue-500" />
                </a>
              )}

              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <XIcon className="h-5 w-5 text-black dark:text-white" />
                </a>
              )}

              {contactInfo.whatsapp && (
                <a
                  href={`https://wa.me/${contactInfo.whatsapp?.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <WhatsAppIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
                </a>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {navigation.links.map((link: any, index: number) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              {contactInfo.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{contactInfo.address}</span>
                </div>
              )}

              {contactInfo.phone && contactInfo.phone.length > 0 && (
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    {Array.isArray(contactInfo.phone) ? (
                      contactInfo.phone.map((phone: string, index: number) => (
                        <a
                          key={index}
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {phone}
                        </a>
                      ))
                    ) : (
                      <a
                        href={`tel:${contactInfo.phone?.replace(/\s+/g, "")}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {contactInfo.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {contactInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}

              {contactInfo.whatsapp && (
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp?.replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Youth Empowerment For Self Reliance - YEFOSR.{" "}
            <span className="text-primary">Inspiring Generations!</span> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
