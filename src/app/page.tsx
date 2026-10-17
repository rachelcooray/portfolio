import FilmGate from "@/components/FilmGate";
import BadgeHero from "@/components/BadgeHero";
import Archive from "@/components/Archive";

export default function Home() {
  return (
    <FilmGate>
      <div className="badge-page">
        <BadgeHero />
        <Archive />
      </div>
    </FilmGate>
  );
}
