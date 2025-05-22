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

  const contactInfo = settings.contact_info || {
    address: "Belameling Vocational Training Centre, Palorinya Refugee Settlement, Obongi District, Uganda",
    email: "yefosr@gmail.com",
    phone: ["+256 772 253 415", "+256 765 167 682", "+211 925 059 964"],
    whatsapp: "+256 772 253 415",
  }

  const socialLinks = settings.social_links || {
    facebook: "https://facebook.com/profile.php?id=100064325486694",
    linkedin: "https://linkedin.com/groups/13160404",
    twitter: "", // Will be added later
  }

  return (
    <footer
      className="border-t bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950"
      aria-label="Site Footer"
    >
      <div className="container py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3" aria-label="Youth Empowerment Home">
              <Image
                src="/logo.png"
                alt="Youth Empowerment Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
                priority
              />
              <div>
                <span className="block font-bold text-xl text-gray-900 dark:text-white leading-tight">
                  Youth Empowerment For Self Reliance - YEFOSR
                </span>
                <span className="text-primary ml-1 italic text-xs">Inspiring Generations!</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
              Empowering youth for a better future through education, skills development, and community engagement.
            </p>
            <div className="flex gap-3 mt-2">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="bg-white p-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 hover:scale-110" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="bg-white p-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Linkedin className="h-5 w-5 text-blue-700 dark:text-blue-500 transition-transform duration-200 hover:scale-110" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  title="X (Twitter)"
                  className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <XIcon className="h-5 w-5 text-black dark:text-white transition-transform duration-200 hover:scale-110" />
                </a>
              )}
              {contactInfo.whatsapp && (
                <a
                  href={`https://wa.me/${contactInfo.whatsapp?.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  className="bg-white p-2 rounded-full hover:bg-green-50 transition-colors shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <WhatsAppIcon className="h-5 w-5 text-green-600 dark:text-green-500 transition-transform duration-200 hover:scale-110" />
                </a>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 uppercase tracking-wider text-primary/90 dark:text-primary/80 letter-spacing-wider">
              Quick Links
            </h3>
            <hr className="mb-4 border-gray-200 dark:border-gray-700" aria-hidden="true" />
            <nav className="flex flex-col gap-2" aria-label="Quick Links">
              {navigation.links.map((link: any, index: number) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:underline"
                  aria-label={link.title}
                  title={link.title}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 uppercase tracking-wider text-primary/90 dark:text-primary/80 letter-spacing-wider">
              Contact Us
            </h3>
            <hr className="mb-4 border-gray-200 dark:border-gray-700" aria-hidden="true" />
            <div className="flex flex-col gap-3" aria-label="Contact Information">
              {contactInfo.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">{contactInfo.address}</span>
                </div>
              )}
              {contactInfo.phone && contactInfo.phone.length > 0 && (
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col gap-1">
                    {Array.isArray(contactInfo.phone) ? (
                      contactInfo.phone.map((phone: string, index: number) => (
                        <a
                          key={index}
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="text-sm text-muted-foreground hover:text-primary focus-visible:underline"
                          aria-label={`Call ${phone}`}
                          title={`Call ${phone}`}
                        >
                          {phone}
                        </a>
                      ))
                    ) : (
                      <a
                        href={`tel:${contactInfo.phone?.replace(/\s+/g, "")}`}
                        className="text-sm text-muted-foreground hover:text-primary focus-visible:underline"
                        aria-label={`Call ${contactInfo.phone}`}
                        title={`Call ${contactInfo.phone}`}
                      >
                        {contactInfo.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-primary focus-visible:underline"
                    aria-label={`Email ${contactInfo.email}`}
                    title={`Email ${contactInfo.email}`}
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.whatsapp && (
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="h-5 w-5 text-green-600 dark:text-green-500" aria-hidden="true" />
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp?.replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary focus-visible:underline"
                    aria-label="Chat on WhatsApp"
                    title="Chat on WhatsApp"
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
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              Youth Empowerment For Self Reliance - YEFOSR.
            </span>{" "}
            <span className="text-primary">Inspiring Generations!</span> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
