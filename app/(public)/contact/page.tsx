export const dynamic = "force-dynamic";

import { ContactForm } from "@/components/contact-form"
import { MapPin, Mail, Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { XIcon } from "@/components/icons/x-icon"
import { AnimatedSection } from "@/components/animated-section"

export const metadata = {
  title: "Contact Us | Youth Empowerment For Self Reliance",
  description: "Get in touch with Youth Empowerment For Self Reliance. We'd love to hear from you!",
}

export default function ContactPage() {
  // Static contact info instead of database query
  const contactInfo = {
    address: "Belameling Vocational Training Centre, Palorinya Refugee Settlement, Obongi District, Uganda",
    email: "yefosr@gmail.com",
    phone: ["+256 772 253 415", "+256 765 167 682", "+211 925 059 964"],
    whatsapp: "+256 772 253 415",
    social: {
      facebook: "https://facebook.com/profile.php?id=100064325486694",
      linkedin: "https://linkedin.com/groups/13160404",
      twitter: "", // Will be added later
    },
  }

  return (
    <div className="container py-12 md:py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDuration: "15s" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDuration: "20s" }}
      ></div>

      <AnimatedSection className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient relative">
          Contact Us
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
        </h1>
        <div className="mt-6 max-w-3xl text-muted-foreground">
          <p className="mb-2">
            We'd love to hear from you! At Youth Empowerment For Self Reliance (YEFOSR), we are always ready to connect
            with individuals, partners, and organizations that share our vision of empowering youth and transforming
            communities.
          </p>
          <p className="font-medium text-lg text-foreground">Get In Touch</p>
          <p>
            Whether you have a question, want to collaborate, or need support, feel free to reach out to us and our team
            will get back to you as soon as possible.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 md:grid-cols-2">
        <AnimatedSection animation="slide-right">
          <div className="rounded-lg border bg-background p-6 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-primary/10 p-2 rounded-full mr-3">
                <Mail className="h-5 w-5 text-primary" />
              </span>
              Send Us a Message
            </h2>
            <ContactForm />
          </div>
        </AnimatedSection>

        <div className="flex flex-col gap-6">
          <AnimatedSection delay={100} animation="slide-left">
            <div className="rounded-lg border bg-background p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-primary/10 p-2 rounded-full mr-3">
                  <Phone className="h-5 w-5 text-primary" />
                </span>
                Contact Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-primary/10 p-2 rounded-full transition-colors duration-300 group-hover:bg-primary/20">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Our Location</h3>
                    </div>
                    <p className="text-muted-foreground pl-11 transition-colors duration-300 group-hover:text-foreground text-sm">
                      {contactInfo.address}
                    </p>
                  </div>

                  <div className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-primary/10 p-2 rounded-full transition-colors duration-300 group-hover:bg-primary/20">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Email Us</h3>
                    </div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 pl-11 block text-sm"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-primary/10 p-2 rounded-full transition-colors duration-300 group-hover:bg-primary/20">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Call Us</h3>
                    </div>
                    <div className="pl-11 space-y-1">
                      {Array.isArray(contactInfo.phone) ? (
                        contactInfo.phone.map((phone, index) => (
                          <a
                            key={index}
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="text-muted-foreground hover:text-primary transition-colors duration-300 block text-sm"
                          >
                            {phone}
                          </a>
                        ))
                      ) : (
                        <a
                          href={`tel:${contactInfo.phone?.replace(/\s+/g, "")}`}
                          className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                        >
                          {contactInfo.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-green-100 p-2 rounded-full transition-colors duration-300 group-hover:bg-green-200">
                        <WhatsAppIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium">WhatsApp</h3>
                    </div>
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp?.replace(/\s+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-green-600 transition-colors duration-300 pl-11 block text-sm"
                    >
                      {contactInfo.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200} animation="slide-left">
            <div className="rounded-lg border bg-background p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-50 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-blue-600"
                  >
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </span>
                Connect With Us
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={contactInfo.social?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 transition-all duration-300 p-2 rounded-lg flex-1 min-w-[150px] transform hover:-translate-y-1 hover:shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-blue-600 h-5 w-5"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <div>
                    <div className="font-medium text-sm">Facebook</div>
                  </div>
                </a>

                <a
                  href={contactInfo.social?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 transition-all duration-300 p-2 rounded-lg flex-1 min-w-[150px] transform hover:-translate-y-1 hover:shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-blue-700 h-5 w-5"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <div>
                    <div className="font-medium text-sm">LinkedIn</div>
                  </div>
                </a>

                {contactInfo.social?.twitter && (
                  <a
                    href={contactInfo.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-all duration-300 p-2 rounded-lg flex-1 min-w-[150px] transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <XIcon className="text-black h-5 w-5" />
                    <div>
                      <div className="font-medium text-sm">X (Twitter)</div>
                    </div>
                  </a>
                )}

                <a
                  href={`https://wa.me/${contactInfo.whatsapp?.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100 transition-all duration-300 p-2 rounded-lg flex-1 min-w-[150px] transform hover:-translate-y-1 hover:shadow-md"
                >
                  <WhatsAppIcon className="text-green-600 h-5 w-5" />
                  <div>
                    <div className="font-medium text-sm">WhatsApp</div>
                  </div>
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300} animation="slide-left">
            <div className="rounded-lg border bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <div className="aspect-[4/3] relative">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=31.61267%2C3.46537%2C31.62267%2C3.47537&amp;layer=mapnik&amp;marker=3.47037%2C31.61767&amp;name=YEFOSR"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="YEFOSR Location"
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                ></iframe>
                <div className="absolute top-0 left-0 bg-white/80 p-2 text-sm font-medium">YEFOSR</div>
                <div className="absolute bottom-0 right-0 bg-white p-1 text-xs">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=3.47037,31.61767&query_place_id=YEFOSR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
