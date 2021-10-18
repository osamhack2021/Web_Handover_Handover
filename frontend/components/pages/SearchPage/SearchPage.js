import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { algoliaSearch } from "_api/item";
import HorizontalHeader from "_organisms/HorizontalHeader";
import HorizontalContent from "_organisms/HorizontalContent";

export default function SearchPage() {
  const [searchReusult, setSearchResult] = useState({
    cabinet: [],
    document: [],
    card: [],
  });
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useParams();
  useEffect(() => {
    algoliaSearch(searchQuery).then((data) => {
      console.log(
        `searched with query : ${searchQuery} and response was : ${JSON.stringify(
          data
        )}`
      );
      if (data !== null) {
        setSearchResult({
          cabinet: data.filter((elem) => elem.type === "cabinet"),
          document: data.filter((elem) => elem.type === "document"),
          card: data.filter((elem) => elem.type === "card"),
        });
      }
      setLoading(false);
    });
  }, [searchQuery]);
  return (
    !loading && (
      <div className="recommend-page">
        <div className="recommend-page-header">{searchQuery} 검색 결과</div>
        <div className="recommend-container">
          <div className="recommend-block">
            <HorizontalHeader type="cabinet" />
            <hr />
            {searchReusult.cabinet === [] ? (
              "검색 결과가 없습니다."
            ) : (
              <HorizontalContent
                type="cabinet"
                cardArray={searchReusult.cabinet}
              />
            )}
          </div>
          <div className="recommend-block">
            <HorizontalHeader type="document" />
            <hr />
            {searchReusult.doucment === [] ? (
              "검색 결과가 없습니다."
            ) : (
              <HorizontalContent
                type="doucment"
                cardArray={searchReusult.document}
              />
            )}
          </div>
          <div className="recommend-block">
            <HorizontalHeader type="card" />
            <hr />
            {searchReusult.card === [] ? (
              "검색 결과가 없습니다."
            ) : (
              <HorizontalContent type="card" cardArray={searchReusult.card} />
            )}
          </div>
        </div>
      </div>
    )
  );
}
