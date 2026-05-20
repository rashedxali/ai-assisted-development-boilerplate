import type { MenuItem } from "@/actions/menu";
import { SettingResponse } from "@/actions/setting";
import { BodyText } from "@/components/globals/typography/body-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";

type FooterSection = {
  title: string;
  links: { name: string; href: string; target?: string | null }[];
};

function mapMenuToFooterLinks(items: MenuItem[]): FooterSection[] {
  return items.map((item) => ({
    title: item.title,
    links: item.children.map((child) => ({
      name: child.title,
      href: child.url,
      target: child.target,
    })),
  }));
}

const LogoSection = ({ settings }: { settings: SettingResponse | null }) => (
  <div className="flex w-full shrink flex-col gap-8 px-4 py-5 sm:gap-12 md:px-5 xl:max-w-2/5 xl:py-10 2xl:w-auto 2xl:max-w-239 2xl:p-10">
    <div className="flex w-full flex-col gap-5">
      <Link href="/">
        <Image
          width={90}
          height={23}
          src={settings?.logo || "/logo.svg"}
          alt="I buy secret logo"
          className="object-contain"
        />
      </Link>
      <BodyText variant="14r">
        {settings?.title || "A Premium Lingerie Shop in Dhaka, Bangladesh."}
      </BodyText>
    </div>
    <div className="flex w-full flex-col gap-2 lg:gap-1">
      <BodyText variant="14r">
        {settings?.address || "Level #Minus Two (-2), I Buy Secrets | Wholesale Club | Jamuna Future park, Dhaka 1229"}
      </BodyText>
      <Link href={`mailto:${settings?.email || "ibuysecrets@gmail.com"}`}>
        <BodyText
          variant="14r"
          className="hover:text-brand-pink transition-colors duration-300"
        >
          Email: {settings?.email || "ibuysecrets@gmail.com"}
        </BodyText>
      </Link>
      <Link href={`tel:${settings?.phone || "8801714980897"}`}>
        <BodyText
          variant="14r"
          className="hover:text-brand-pink transition-colors duration-300"
        >
          Phone: {settings?.phone || "8801714980897"} {settings?.phone ? "" : "(sales)"}
        </BodyText>
      </Link>
    </div>
  </div>
);

const DesktopLinks = ({ sections }: { sections: FooterSection[] }) => (
  <div className="hidden w-full grow grid-cols-4 lg:grid xl:max-w-3/5 2xl:max-w-239">
    {sections.map((section) => (
      <div
        key={section.title}
        className="flex h-full w-full flex-col gap-5 p-5 xl:py-10 2xl:p-10"
      >
        <BodyText variant="14r" className="text-brand-pink font-medium">
          {section.title}
        </BodyText>
        <div className="flex w-full flex-col gap-1.5">
          {section.links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              {...(link.target
                ? { target: link.target, ...(link.target === "_blank" ? { rel: "noopener noreferrer" } : {}) }
                : link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
            >
              <BodyText
                variant="14r"
                className="hover:text-brand-pink underline-offset-4 transition-colors duration-300 hover:underline"
              >
                {link.name}
              </BodyText>
            </Link>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const MobileAccordion = ({ sections }: { sections: FooterSection[] }) => (
  <div className="w-full px-4 py-5 md:px-5 lg:hidden">
    <Accordion type="single" collapsible className="w-full">
      {sections.map((section) => (
        <AccordionItem
          key={section.title}
          value={section.title}
          className="border-dark-10/20"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <BodyText variant="14r" className="text-brand-pink font-medium">
              {section.title}
            </BodyText>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 pb-4">
              {section.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  {...(link.target
                    ? { target: link.target, ...(link.target === "_blank" ? { rel: "noopener noreferrer" } : {}) }
                    : link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                >
                  <BodyText
                    variant="14r"
                    className="hover:text-brand-pink underline-offset-4 transition-colors duration-300 hover:underline"
                  >
                    {link.name}
                  </BodyText>
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const CopyrightSection = ({ copyrightText }: { copyrightText: string }) => (
  <div className="flex w-full flex-col items-start justify-center gap-4 px-4 sm:flex-row sm:items-center sm:justify-between md:px-5 2xl:px-10">
    <BodyText variant="14r">{copyrightText}</BodyText>
    <div className="flex flex-row items-center justify-end gap-6">
      <Link href="/terms-and-conditions">
        <BodyText
          variant="14r"
          className="hover:text-brand-pink underline-offset-4 transition-colors duration-300 hover:underline"
        >
          Terms & Conditions
        </BodyText>
      </Link>
      <Link href="/privacy-policy">
        <BodyText
          variant="14r"
          className="hover:text-brand-pink underline-offset-4 transition-colors duration-300 hover:underline"
        >
          Privacy Policy
        </BodyText>
      </Link>
    </div>
  </div>
);

function Footer({ menuItems = [], settings = null }: { menuItems?: MenuItem[]; settings?: SettingResponse | null }) {
  const sections = mapMenuToFooterLinks(menuItems);

  return (
    <footer>
      <div className="container-fluid text-dark-100 py-7.5">
        <div className="flex w-full flex-col gap-5 md:gap-7.5">
          <div className="flex w-full flex-col lg:items-center lg:justify-between lg:gap-8 xl:flex-row xl:gap-0">
            <LogoSection settings={settings} />
            <DesktopLinks sections={sections} />
            <MobileAccordion sections={sections} />
          </div>
          <CopyrightSection copyrightText={settings?.copyright || "Copyright © 2025 www.ibuysecrets.com"} />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
