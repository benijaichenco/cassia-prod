import { memo, useCallback, useMemo, useState } from "react";
import { CommentType } from "../../types";
import { getTimeCreated } from "../../utils";
import { deleteComment, postLike } from "../../api/apiUtils";
import TrashSVG from "../SVG/TrashSVG";
import ThumbsUpSVG from "../SVG/ThumbsUpSVG";

import "./comment.css";

interface CommentProps {
  comment: CommentType;
  userId: string;
  onDelete: () => void;
}

const Comment = ({ comment, userId, onDelete }: CommentProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(comment.likes.includes(userId));
  const [likes, setLikes] = useState<number>(comment.likeCount);
  const [isPrompting, setIsPrompting] = useState<boolean>(false);

  const owner = useMemo(() => comment.userId == userId, [comment, userId]);
  const created = useMemo(() => getTimeCreated(new Date(comment.createdAt)), [comment]);

  const handleLikeComment = useCallback(async () => {
    if (!userId) {
      console.log("You need to be logged in to do this.");
      return;
    }
    setIsLiked((prev) => !prev);
    setLikes((likes) => (isLiked ? likes - 1 : likes + 1));
    try {
      await postLike("like", "comment", comment.commentId, userId);
    } catch (err) {
      setIsLiked((prev) => !prev);
      setLikes((likes) => (isLiked ? likes + 1 : likes - 1));
      console.error("Error handling like:", err);
    }
  }, [userId, comment, isLiked]);

  const handleIsPrompting = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("comment-confirm-delete-btn")) {
      return;
    }
    window.removeEventListener("mouseup", handleIsPrompting);
    setIsPrompting(false);
  }, []);

  const handleDeleteComment = useCallback(async () => {
    setIsPrompting(true);
    window.addEventListener("mouseup", handleIsPrompting);
  }, [handleIsPrompting]);

  const confirmDelete = useCallback(async () => {
    window.removeEventListener("mouseup", handleIsPrompting);
    setIsPrompting(false);
    onDelete();
    try {
      await deleteComment(comment.commentId as string);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  }, [handleIsPrompting, onDelete, comment]);

  return (
    <div className="comment-wrapper">
      <div className="comment-top-container">
        <div className="comment-top-left">
          <div className="comment-name">{comment.user.firstName}</div>
          <div className="comment-username">{`@${comment.user.username}`}</div>
        </div>
        <div className="comment-top-right">
          <div className="comment-date">{created}</div>
        </div>
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-bottom">
        <div className="comment-likes">
          <button className="comment-like-btn" onClick={handleLikeComment}>
            <ThumbsUpSVG
              className={`comment-likes-svg ${isLiked && "liked"}`}
              pathClassName="comment-likes-svg-bg"
            />
          </button>
          <span className="comment-likes-num">{likes}</span>
        </div>
        {owner && (
          <>
            {isPrompting ? (
              <div className="comment-delete-prompts">
                <button className="comment-prompt-btn comment-cancel-delete-btn">Cancel</button>
                <button
                  className="comment-prompt-btn comment-confirm-delete-btn"
                  onClick={confirmDelete}
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button className="comment-trash-btn" onClick={handleDeleteComment}>
                <TrashSVG className="comment-trash-svg" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(Comment);
