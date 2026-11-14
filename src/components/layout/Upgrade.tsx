import { identity } from "@/content/content";

// Holding page shown on every route while the site is rebuilt.
// Switch it off with MAINTENANCE in src/app/layout.tsx.
export default function Upgrade() {
  return (
    <main id="content" className="upgrade">
      <p className="upgrade-mark">RC.</p>
      <div className="upgrade-body">
        <p className="upgrade-kicker">
          <span className="upgrade-dot" aria-hidden="true" />
          Upgrade in progress
        </p>
        <h1>This site is getting an upgrade.</h1>
        <p className="upgrade-lead">A new version is on its way. Until then, you can reach me by email or phone.</p>
        <a className="upgrade-mail" href={`mailto:${identity.email}`}>
          {identity.email}
        </a>
        <a className="upgrade-mail" href={`tel:${identity.phone.replace(/\s/g, "")}`}>
          {identity.phone}
        </a>
      </div>
      <p className="upgrade-foot">Rachel Cooray · Colombo, Sri Lanka</p>
    </main>
  );
}
