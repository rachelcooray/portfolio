export default function Folio({ right }: { right: string }) {
  return (
    <div className="folio">
      <span>Rachel Cooray · Issue 01</span>
      <span>{right}</span>
    </div>
  );
}
