import { CyclistDTO } from '@/types/cyclist';
import { countryAbbreviationMap } from '@/utils/country-abbreviation-map-lowercase';
import React from 'react';

const CountryBodyTemplate = (rowData: CyclistDTO) => {
  return (
    <div className="flex align-items-center gap-2">
      <img
        alt="flag"
        src={`https://flagcdn.com/w40/${countryAbbreviationMap[rowData.country]}.png`}
        style={{ height: '20px', borderRadius: '2px' }}
      />
      <span>{rowData.country}</span>
    </div>
  );
};

export default CountryBodyTemplate;
