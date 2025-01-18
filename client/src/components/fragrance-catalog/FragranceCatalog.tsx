import { memo } from "react";
import { FragranceDataType, UserType } from "../../types";
import FragranceCard from "../../components/fragrance-card/FragranceCard";

import "./fragranceCatalog.css";

interface FragranceCatalogProps {
  user: UserType;
  fragrances: FragranceDataType[] | null;
}

const FragrancesCatalog = ({ user, fragrances }: FragranceCatalogProps) => {
  return (
    <div className="fragrance-catalog-container">
      {fragrances &&
        fragrances.length > 0 &&
        fragrances.map((item, index) => {
          return <FragranceCard key={index} fragrance={item} userId={user.userId} />;
        })}
    </div>
  );
};

export default memo(FragrancesCatalog);
