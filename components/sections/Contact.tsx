"use client";

import { DrumMachine } from "@/components/drum-machine/DrumMachine";
import { Button } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { profile, social } from "@/data/social";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

const iconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
} as const;

export function Contact() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactValues) => {
    setStatus("idle");

    if (!formspreeId) {
      const subject = encodeURIComponent(
        `Portfolio contact from ${values.name}`,
      );
      const body = encodeURIComponent(
        `${values.message}\n\n— ${values.email}`,
      );
      const mailto = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      window.open(mailto, "_self");
      setStatus("success");
      reset();
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-pad content-pad scroll-mt-[calc(var(--topbar-h)+1rem)]"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:items-end">
        <div>
      <SectionLabel label="CONTACT" />
      <h2
        id="contact-heading"
        className="max-w-xl text-3xl font-medium tracking-tight text-text-primary sm:text-4xl"
      >
        Let&apos;s build something.
      </h2>
      <p className="mt-3 font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
        Software engineering · AI/ML · Mobile · Systems
      </p>
      <p className="mt-4 max-w-lg text-base text-text-secondary">
        Open to software engineering, AI/ML, and technical collaboration.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {social.map((link) => {
          const Icon = iconMap[link.icon];
          return (
            <a
              key={link.id}
              href={link.href}
              target={link.icon === "mail" ? undefined : "_blank"}
              rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-border bg-transparent px-4 py-2 font-mono text-xs tracking-wider text-text-primary uppercase transition-colors duration-150 hover:border-border-strong hover:bg-white/[0.03]"
            >
              <Icon className="size-3.5" aria-hidden />
              {link.label}
            </a>
          );
        })}
      </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex w-full max-w-xl flex-col space-y-5 border border-border bg-bg-panel p-6"
          noValidate
        >
          <div>
            <label
              htmlFor="name"
              className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase"
            >
              Name
            </label>
            <input
              id="name"
              autoComplete="name"
              className={inputClass}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-accent">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={inputClass}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-accent">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className={cn(inputClass, "min-h-28 resize-y")}
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-accent">{errors.message.message}</p>
            )}
          </div>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="shrink-0">
            {isSubmitting ? "Sending…" : "Send Message"}
          </Button>
          {status === "success" && (
            <p className="font-mono text-xs text-text-secondary" role="status">
              Message ready — thanks for reaching out.
            </p>
          )}
          {status === "error" && (
            <p className="font-mono text-xs text-accent" role="alert">
              Something went wrong. Email {profile.email} directly.
            </p>
          )}
        </form>
        </div>
        <DrumMachine />
      </div>
    </section>
  );
}

const inputClass =
  "mt-2 w-full border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-disabled focus:border-accent";
