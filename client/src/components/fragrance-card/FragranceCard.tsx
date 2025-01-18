import { memo, MouseEvent, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FragranceDataType } from "../../types";
import { postLike } from "../../api/apiUtils";
import ThumbsDownSVG from "../SVG/ThumbsDownSVG";
import ThumbsUpSVG from "../SVG/ThumbsUpSVG";

import "./fragranceCard.css";

interface FragranceCardProps {
  fragrance: FragranceDataType;
  disabled?: boolean;
  userId: string;
}

const FragranceCard = ({ fragrance, disabled, userId }: FragranceCardProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(fragrance.likes.includes(userId));
  const [likeCount, setLikeCount] = useState<number>(fragrance.likeCount);
  const [isDisliked, setIsDisliked] = useState<boolean>(fragrance.dislikes.includes(userId));
  const [dislikeCount, setDislikeCount] = useState<number>(fragrance.dislikeCount);
  const imgUrl = useMemo(() => "/fragrance-images", []);
  const imageName = useMemo(() => fragrance.image_name.split(".")[0], [fragrance]);
  const disableClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleFragranceLike = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!userId) {
        console.log("You need to be logged in to do this.");
        return;
      }
      if (isDisliked) {
        setDislikeCount((prev) => prev - 1);
      }
      setIsDisliked(false);
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      try {
        await postLike("like", "fragrance", fragrance.fragranceId, userId);
      } catch (err) {
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
        console.error("Error posting like:", err);
      }
    },
    [userId, fragrance, isLiked, isDisliked]
  );
  const handleFragranceDislike = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!userId) {
        console.log("You need to be logged in to do this.");
        return;
      }
      if (isLiked) {
        setLikeCount((prev) => prev - 1);
      }
      setIsLiked(false);
      setIsDisliked((prev) => !prev);
      setDislikeCount((prev) => (isDisliked ? prev - 1 : prev + 1));
      try {
        await postLike("dislike", "fragrance", fragrance.fragranceId, userId);
      } catch (err) {
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
        console.error("Error posting like:", err);
      }
    },
    [userId, fragrance, isLiked, isDisliked]
  );

  return (
    <>
      <Link
        to={`/fragrances/${encodeURIComponent(imageName)}`}
        className="fragrance-card"
        onClick={(e) => {
          if (disabled) {
            disableClick(e);
          }
        }}
      >
        <div className="fragrance-card-votes-container">
          <button className="fragrance-card-vote-btn" onClick={handleFragranceLike}>
            <ThumbsUpSVG
              className={`fragrance-card-upvote-svg ${isLiked && "liked"}`}
              pathClassName="fragrance-card-upvote-svg-bg"
            />
            <span className="fragrance-card-upvote-num">{likeCount}</span>
          </button>
          <button className="fragrance-card-vote-btn" onClick={handleFragranceDislike}>
            <ThumbsDownSVG
              className={`fragrance-card-downvote-svg ${isDisliked && "disliked"}`}
              pathClassName="fragrance-card-downvote-svg-bg"
            />
            <span className="fragrance-card-downvote-num">{dislikeCount}</span>
          </button>
        </div>

        <img
          loading="lazy"
          src={`${imgUrl}/${fragrance.image_name}`}
          className="fragrance-card-img"
        />
        <div className="fragrance-card-info">
          <div className="fragrance-card-name">{fragrance.name}</div>
          <div className="fragrance-card-brand">{fragrance.brand}</div>
          <div className="fragrance-card-concentration">{fragrance.concentration}</div>
          <div className="fragrance-card-year">{fragrance.year}</div>
        </div>
      </Link>
    </>
  );
};

export default memo(FragranceCard);
