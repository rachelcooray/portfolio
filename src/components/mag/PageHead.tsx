import Folio from "@/components/mag/Folio";

export default function PageHead({ folio, title, dek }: { folio: string; title: string; dek?: string }) {
  return (
    <>
      <Folio right={folio} />
      <div className="page-head">
        <h1>{title}</h1>
        {dek ? <p>{dek}</p> : null}
      </div>
    </>
  );
}
