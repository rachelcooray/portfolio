import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="lost">
      <div className="wrap">
        <p className="mono">Error 404</p>
        <h1>This path isn&apos;t on the map.</h1>
        <p className="lead">The page may have moved when the site was reorganised.</p>
        <div className="btn-row">
          <Button href="/" variant="light">
            Back to home
          </Button>
          <Button href="/projects" variant="ghost-light">
            See the work
          </Button>
        </div>
      </div>
    </section>
  );
}
