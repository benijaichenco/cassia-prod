import { ChangeEvent, memo, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { fetchFragrances } from "../../api/apiUtils";
import { useLenisScrollTo } from "../../utils";
import { FragranceDataType } from "../../types";
import { useUserContext } from "../../context/UserContext";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import Button from "../../components/button/Button";
import ArticleTitle from "../../components/article-title/ArticleTitle";
import ParagraphText from "../../components/paragraph-text/ParagraphText";
import Loader from "../../components/loaders/Loader";
import SearchSVG from "../../components/SVG/SearchSVG";
import SortSVG from "../../components/SVG/SortSVG";
import FragranceCatalog from "../../components/fragrance-catalog/FragranceCatalog";

import "./fragrances.css";

function Fragrances() {
  const navbarColorContext = useNavbarColorContext();
  const scrollToTop = useLenisScrollTo();
  const { user } = useUserContext();

  const [fragrances, setFragrances] = useState<FragranceDataType[] | null>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [activeField, setActiveField] = useState<string>("name");
  const [activeSort, setActiveSort] = useState<string>("asc");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const indexRef = useRef<number>(0);
  const fieldRef = useRef<string>("name");
  const orderRef = useRef<string>("asc");
  const searchRef = useRef<string>("");
  const isFetchingRef = useRef(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const getFragrances = useCallback(async () => {
    if (isFetchingRef.current == true) {
      return;
    }
    isFetchingRef.current = true;
    setIsFetching(true);
    try {
      const res = await fetchFragrances(
        indexRef.current,
        fieldRef.current,
        orderRef.current,
        searchRef.current
      );
      const resFragrances = res.data.fragrances;
      if (resFragrances.length == 0 && indexRef.current == 0) {
        setFragrances(null);
      } else {
        setFragrances((prev) => [...(prev as FragranceDataType[]), ...resFragrances]);
        return;
      }
    } catch (err) {
      console.error("Error getting fragrances:", err);
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, []);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current == e.target.value) {
      return;
    }
    searchRef.current = e.target.value;
    indexRef.current = 0;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setFragrances([]);
      debounceTimeout.current = null;
    }, 300);
  }, []);

  const handleFieldChange = useCallback((e: SyntheticEvent<HTMLButtonElement>) => {
    if (fieldRef.current == e.currentTarget.value) {
      return;
    }
    fieldRef.current = e.currentTarget.value;
    setActiveField(fieldRef.current);
    indexRef.current = 0;
    setFragrances([]);
  }, []);

  const handleSortChange = useCallback((e: SyntheticEvent<HTMLButtonElement>) => {
    if (orderRef.current == e.currentTarget.value) {
      return;
    }
    orderRef.current = e.currentTarget.value;
    if (orderRef.current == "asc") {
      setActiveSort("asc");
    } else if (orderRef.current == "desc") {
      setActiveSort("desc");
    }
    indexRef.current = 0;
    setFragrances([]);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (indexRef.current >= 24) {
      return;
    }
    indexRef.current++;
    getFragrances();
  }, [getFragrances]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    navbarColorContext.dispatch?.("white", "black");
    scrollToTop();
  }, [scrollToTop, navbarColorContext]);

  useEffect(() => {
    if (fragrances !== null && fragrances.length == 0) {
      getFragrances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fragrances]);
  return (
    <>
      <section id="fragrances">
        <ArticleTitle className="fragrances-title">FRAGRANCES</ArticleTitle>
        <ParagraphText className="fragrances-text">
          Uncover the magic behind every bottle. From rich histories to modern innovations, browse
          through iconic creations and hidden gems, share your reviews, cast your votes, and join a
          community passionate about the power of scent.
        </ParagraphText>
        <div className="fragrances-search">
          <SearchSVG className="fragrances-search-svg" />
          <input
            type="text"
            autoComplete="off"
            placeholder={`${isFocused ? "" : "Search a fragrances.."}`}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div className="fragrances-filters">
          <div className="fragrances-filters-left">
            <button
              value="name"
              className={`fragrances-filter-btn ${activeField == "name" ? "active" : ""}`}
              onClick={handleFieldChange}
            >
              Name
            </button>
            <button
              value="brand"
              className={`fragrances-filter-btn ${activeField == "brand" ? "active" : ""}`}
              onClick={handleFieldChange}
            >
              Brand
            </button>
            <button
              value="year"
              className={`fragrances-filter-btn ${activeField == "year" ? "active" : ""}`}
              onClick={handleFieldChange}
            >
              Year
            </button>
            <button
              value="likeCount"
              className={`fragrances-filter-btn ${activeField == "likeCount" ? "active" : ""}`}
              onClick={handleFieldChange}
            >
              Likes
            </button>
            <button
              value="dislikeCount"
              className={`fragrances-filter-btn ${activeField == "dislikeCount" ? "active" : ""}`}
              onClick={handleFieldChange}
            >
              Dislikes
            </button>
          </div>
          <div className="fragrances-filters-right">
            {activeSort == "asc" ? (
              <button value="desc" className="fragrances-filter-btn" onClick={handleSortChange}>
                <SortSVG className="fragrances-sort-svg rotated" />
              </button>
            ) : (
              <button value="asc" className="fragrances-filter-btn" onClick={handleSortChange}>
                <SortSVG className="fragrances-sort-svg" />
              </button>
            )}
          </div>
        </div>
        <FragranceCatalog fragrances={fragrances} user={user} />
        {isFetching && (
          <div className="fragrances-loader-container">
            <Loader />
          </div>
        )}
        <Button
          type="button"
          className="fragrances-more-btn"
          onClick={handleLoadMore}
          color="var(--bg)"
          backgroundColor="var(--primary)"
          disabled={isFetching}
        >
          SHOW MORE
        </Button>
      </section>
    </>
  );
}

export default memo(Fragrances);
