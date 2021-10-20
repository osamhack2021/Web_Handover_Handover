import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { algoliaSearch } from '_api/item';
import ItemListSection from '_frontend/components/templates/ItemListSection';

export default function SearchPage() {
  const [searchReusult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useParams();
  document.title = `${searchQuery} - Handover Search`;
  console.log(`/api/item/algolia/${searchQuery}`);
  useEffect(() => {
    algoliaSearch(searchQuery).then((data) => {
      console.log(
        `searched with query : ${searchQuery} and response was : ${JSON.stringify(
          data,
        )}`,
      );
      const newData = data.map((elem) => ({ ...elem, _id: elem.objectID }));
      if (data !== null) {
        setSearchResult(newData);
        setLoading(false);
      }
    });
  }, [searchQuery]);
  return (
    !loading && <ItemListSection title={`${searchQuery} 검색결과`} items={searchReusult} />
  );
}
