import { memo, useCallback, useEffect, useState } from "react";
import { authApi } from "../../api/apiClient";
import { useLenisScrollTo } from "../../utils";
import { FragranceDataType } from "../../types";
import { useUserContext } from "../../context/UserContext";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import { useNavigate } from "react-router-dom";
import FragranceCatalog from "../../components/fragrance-catalog/FragranceCatalog";
import Loader from "../../components/loaders/Loader";
import ParagraphText from "../../components/paragraph-text/ParagraphText";
import ArticleTitle from "../../components/article-title/ArticleTitle";

import "./LikedFragrances.css";

function LikedFragrances() {
  const { user } = useUserContext();
  const [isLoggedIn] = useState(window.localStorage.getItem("isLoggedIn"));
  const [fragrances, setFragrances] = useState<FragranceDataType[] | null | "no-user">(null);
  const navbarColorContext = useNavbarColorContext();
  const navigate = useNavigate();
  const scrollToTop = useLenisScrollTo();
  const getLikedFragrances = useCallback(async () => {
    try {
      const res = await authApi({
        method: "POST",
        url: "/user/liked-fragrances",
        data: { userId: user.userId },
      });
      if (res.data) {
        setFragrances(res.data);
      }
    } catch (err) {
      setFragrances("no-user");
      console.error("Failed fetching liked fragrances:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    scrollToTop();
    navbarColorContext.dispatch?.("white", "black");
  }, [isLoggedIn, navigate, scrollToTop, navbarColorContext]);

  useEffect(() => {
    if (!user.userId) {
      return;
    }
    getLikedFragrances();
  }, [user, getLikedFragrances]);

  return (
    <>
      <section id="liked-fragrances-section">
        <ArticleTitle>LIKED FRAGRANCES</ArticleTitle>
        {fragrances == "no-user" ? (
          <ParagraphText>You must be logged in to see liked fragrances.</ParagraphText>
        ) : fragrances == null ? (
          <Loader />
        ) : fragrances.length == 0 ? (
          <ParagraphText>You have no liked fragrances.</ParagraphText>
        ) : (
          <FragranceCatalog fragrances={fragrances} user={user} />
        )}
      </section>
    </>
  );
}

export default memo(LikedFragrances);
