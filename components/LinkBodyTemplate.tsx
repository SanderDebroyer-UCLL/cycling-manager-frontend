import { Competition } from "@/types/competition";
import Link from "next/link";
import { Button } from "primereact/button";

const LinkBodyTemplate = (competition: Competition) => {
    return (
      <Link href={`/competities/${competition.id}`}>
        <Button label="Naar Competitie" size="small" />
      </Link>
    );
};

export default LinkBodyTemplate;