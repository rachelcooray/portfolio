// A four-step flow from inputs to outputs. Drawn with no numbers and
// labelled as illustrative, so nothing confidential is implied.
export default function ArchitectureDiagram({ steps, label }: { steps: string[]; label: string }) {
  return (
    <figure className="diagram">
      <ol aria-label={label}>
        {steps.map((s, i) => (
          <li key={s}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mono">Illustrative diagram · no real data</figcaption>
    </figure>
  );
}
