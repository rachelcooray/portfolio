import ChapterRail from "@/components/home/ChapterRail";
import {
  AchievementStrip,
  BeyondPreview,
  CapabilityBento,
  CareerTimelinePreview,
  ContactCTA,
  ExploreCards,
  FeaturedProjects,
  HeroSection,
  IntroductionSection,
  PersonalStatement,
  ResearchHighlight,
} from "@/components/home/Sections";

const CHAPTERS = [
  { id: "intro", label: "Hello" },
  { id: "about-me", label: "Who I am" },
  { id: "capabilities", label: "What I bring" },
  { id: "journey", label: "The journey" },
  { id: "work", label: "Selected work" },
  { id: "research-highlight", label: "Research" },
  { id: "recognition", label: "Recognition" },
  { id: "beyond", label: "Beyond work" },
  { id: "statement", label: "How I think" },
  { id: "explore", label: "Keep exploring" },
  { id: "connect", label: "Connect" },
];

export default function Home() {
  return (
    <>
      <ChapterRail chapters={CHAPTERS} />
      <HeroSection />
      <IntroductionSection />
      <CapabilityBento />
      <CareerTimelinePreview />
      <FeaturedProjects />
      <ResearchHighlight />
      <AchievementStrip />
      <BeyondPreview />
      <PersonalStatement />
      <ExploreCards />
      <ContactCTA />
    </>
  );
}
