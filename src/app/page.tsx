import ChapterRail from "@/components/home/ChapterRail";
import {
  ContactCTA,
  ExperiencePreview,
  HeroSection,
  IntroductionSection,
  PersonalStatement,
  ProjectsPreview,
  SectionIndex,
  SectionPreview,
} from "@/components/home/Sections";

// Sections in the order Rachel asked for, each with a clear way in.
const CHAPTERS = [
  { id: "intro", label: "Hello" },
  { id: "about-me", label: "At a glance" },
  { id: "sections", label: "Sections" },
  { id: "education", label: "Education" },
  { id: "research-projects", label: "Research & Projects" },
  { id: "experience", label: "Experience" },
  { id: "volunteering", label: "Volunteering" },
  { id: "achievements", label: "Achievements" },
  { id: "media", label: "In the media" },
  { id: "skills", label: "Skills" },
  { id: "beyond", label: "Beyond work" },
  { id: "statement", label: "How I think" },
  { id: "connect", label: "Connect" },
];

export default function Home() {
  return (
    <>
      <ChapterRail chapters={CHAPTERS} />
      <HeroSection />
      <IntroductionSection />
      <SectionIndex />
      <SectionPreview
        id="education"
        num="01"
        image={{ src: "/images/photos/showcase-group.jpg", w: 800, h: 450, alt: "Students and industry judges at the Westminster final year project showcase" }}
      />
      <ProjectsPreview num="02" />
      <ExperiencePreview num="03" />
      <SectionPreview
        id="volunteering"
        num="04"
        tone="oat"
        image={{ src: "/images/photos/street-vendor.jpg", w: 1600, h: 1200, alt: "A street food vendor at his stall in Colombo" }}
      />
      <SectionPreview
        id="achievements"
        num="05"
        image={{ src: "/images/photos/pcos-showcase.webp", w: 1606, h: 1198, alt: "Rachel presenting PCOS Care to judges and standing beside her research poster" }}
      />
      <SectionPreview
        id="media"
        num="06"
        tone="oat"
        image={{ src: "/images/swimmingmeet.jpeg", w: 399, h: 501, alt: "Team OCTAVE at the John Keells intercompany swimming meet" }}
      />
      <SectionPreview id="skills" num="07" />
      <SectionPreview
        id="beyond"
        num="08"
        tone="oat"
        image={{ src: "/images/photos/head-prefect.jpg", w: 1080, h: 1391, alt: "Rachel as Head Prefect in the green St. Bridget's Convent blazer" }}
      />
      <PersonalStatement />
      <ContactCTA />
    </>
  );
}
