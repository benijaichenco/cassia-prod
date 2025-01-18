import { memo, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import { AxiosError } from "axios";
import { authApi } from "../../api/apiClient";
import { getSingleFragrance, postComment } from "../../api/apiUtils";
import { useLenisScrollTo } from "../../utils";
import { CommentType, FragranceDataType } from "../../types";
import { useUserContext } from "../../context/UserContext";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import FragranceCard from "../../components/fragrance-card/FragranceCard";
import Comment from "../../components/comment/Comment";
import Button from "../../components/button/Button";
import Loader from "../../components/loaders/Loader";
import NotFound from "../../components/not-found/NotFound";

import "./fragrancePost.css";

function FragrancePost() {
  const [allComments, setAllComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fragrance, setFragrance] = useState<FragranceDataType | null | "not found">(null);
  const navbarColorContext = useNavbarColorContext();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { fragranceId } = useParams<{ fragranceId: string }>();
  const scrollToTop = useLenisScrollTo();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleFocus = useCallback(() => {
    textareaRef.current?.setAttribute("data-lenis-prevent", "");
  }, []);

  const handleBlur = useCallback(() => {
    textareaRef.current?.removeAttribute("data-lenis-prevent");
  }, []);

  const handlePropagation = useCallback((e: SyntheticEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
  }, []);

  const getFragrance = useCallback(async () => {
    setFragrance(null);
    try {
      const res = await getSingleFragrance(fragranceId as string);
      setFragrance(res.data);
    } catch (err) {
      console.error("Error fetching the fragrance:", err);
      setFragrance("not found");
    }
  }, [fragranceId]);

  const fetchComments = useCallback(async () => {
    setAllComments([]);
    try {
      const res = await authApi.get(`/comments/${fragranceId}`);
      const data = res.data.sort((a: CommentType, b: CommentType) => b.createdAt - a.createdAt);
      return data;
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }, [fragranceId]);

  const handleSubmitComment = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    if (newComment.trim() == "") {
      return;
    }
    setIsSubmitting(true);
    if (fragranceId) {
      const comment: CommentType = {
        fragranceId,
        user: { ...user },
        userId: user.userId,
        commentId: v4(),
        createdAt: Date.now(),
        content: newComment,
        likeCount: 0,
        likes: [],
      };
      try {
        setAllComments((prev) => [comment, ...prev]);
        await postComment(comment);
        setNewComment("");
      } catch (err) {
        console.error("Error submitting comment:", err);
        setAllComments((prev) => prev.filter((c) => c !== comment));
        if ((err as AxiosError).status == 401 || (err as AxiosError).status == 403) {
          return;
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [fragranceId, isSubmitting, newComment, user]);

  const removeComment = useCallback((commentId: string) => {
    setAllComments((prevComments) => prevComments.filter((c) => c.commentId !== commentId));
  }, []);

  useEffect(() => {
    navbarColorContext.dispatch?.("white", "black");
    scrollToTop();
    getFragrance();
  }, [navbarColorContext, scrollToTop, getFragrance]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const comments = await fetchComments();
        setAllComments(comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    loadComments();
  }, [fetchComments]);

  if (fragrance == "not found") {
    return <NotFound />;
  }

  return (
    <section id="fragrance-info">
      {fragrance == null ? (
        <Loader />
      ) : (
        <>
          <div className="fragrance-info-card">
            <FragranceCard fragrance={fragrance} disabled={true} userId={user.userId} />
            <div className="fragrance-info-notes-container">
              <div className="fragrance-info-notes">
                <span className="fragrance-info-notes-title">TOP NOTES</span>
                <span className="fragrance-info-notes-text">{fragrance.notes_top}.</span>
              </div>
              <div className="fragrance-info-notes">
                <span className="fragrance-info-notes-title">MIDDLE NOTES</span>
                <span className="fragrance-info-notes-text">{fragrance.notes_middle}.</span>
              </div>
              <div className="fragrance-info-notes">
                <span className="fragrance-info-notes-title">BASE NOTES</span>
                <span className="fragrance-info-notes-text">{fragrance.notes_base}.</span>
              </div>
            </div>
          </div>

          <div className="fragrance-info-comment-form">
            <textarea
              ref={textareaRef}
              id="comment"
              name="comment"
              className="fragrance-info-comment-input"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onScroll={handlePropagation}
            ></textarea>
            <div className="fragrance-info-comment-input-bottom">
              <Button
                type="button"
                className="fragrance-info-comment-submit-btn"
                onClick={user.isLoggedIn ? handleSubmitComment : () => navigate("/login")}
                backgroundColor="var(--primary)"
                color="var(--bg)"
              >
                {user.isLoggedIn ? "SUBMIT" : "LOG IN"}
              </Button>
            </div>
          </div>

          <div className="comments-section">
            {allComments &&
              allComments.map((c) => {
                return (
                  <Comment
                    key={c.commentId}
                    comment={c}
                    userId={user.userId}
                    onDelete={() => removeComment(c.commentId as string)}
                  />
                );
              })}
          </div>
        </>
      )}
    </section>
  );
}

export default memo(FragrancePost);
