"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Comment = {
  id: string;
  content: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function StoneComments({
  isOpen,
  onClose,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const commentsQuery = query(
      collection(db, "stone_comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const nextComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          content: doc.data().content ?? "",
        }));

        setComments(nextComments);
        setIsLoading(false);
      },
      (error) => {
        console.error("댓글 불러오기 실패:", error);

        setErrorMessage(
          "이야기를 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
        );

        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [comments, isOpen]);

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmed = content.trim();

    if (!trimmed) return;
    if (trimmed.length > 100) return;
    if (isSending) return;

    try {
      setIsSending(true);
      setErrorMessage("");

      await addDoc(collection(db, "stone_comments"), {
        content: trimmed,
        createdAt: serverTimestamp(),
      });

      setContent("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);

      setErrorMessage(
        "이야기를 보내지 못했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/5">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="댓글창 닫기"
        onClick={onClose}
      />

      <section
        className="
          relative
          z-10
          flex
          h-[60vh]
          w-full
          max-w-md
          flex-col
          rounded-t-[32px]
          bg-[#f8f4ec]
          px-5
          pb-5
          pt-5
          shadow-[0_-18px_60px_rgba(80,60,40,0.12)]
        "
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-[17px] font-medium tracking-[-0.02em] text-neutral-700">
              갖고 싶은 스톤이 있나요?
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-neutral-400">
              떠오르는 아이디어를 자유롭게 남겨주세요
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/60
              text-lg
              text-neutral-400
              transition
              active:scale-95
            "
          >
            ×
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3 rounded-2xl bg-[#efe6da] px-4 py-3 text-xs text-[#7f6f60]">
            {errorMessage}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-300" />
                이야기를 불러오는 중...
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-neutral-400">
                첫 번째 아이디어를 남겨보세요 :)
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="
                    w-fit
                    max-w-[85%]
                    break-words
                    rounded-[20px]
                    rounded-bl-[7px]
                    bg-[#fffdf8]
                    px-4
                    py-2.5
                    text-sm
                    leading-6
                    text-neutral-700
                    shadow-[0_4px_16px_rgba(90,70,50,0.05)]
                  "
                >
                  {comment.content}
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            mt-4
            flex
            items-end
            gap-2
            border-t
            border-[#e9e1d5]
            pt-4
          "
        >
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={100}
              rows={1}
              placeholder="갖고 싶은 스톤을 적어주세요..."
              className="
                max-h-24
                min-h-11
                w-full
                resize-none
                rounded-[18px]
                border
                border-[#e8dfd2]
                bg-[#fffdf8]
                px-4
                py-3
                text-sm
                text-neutral-700
                outline-none
                placeholder:text-neutral-400
                focus:border-[#cfc3b4]
              "
            />

            <p className="mt-1 pr-1 text-right text-[10px] text-neutral-400">
              {content.length}/100
            </p>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSending}
            className="
              mb-4
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#8d8174]
              text-base
              text-white
              shadow-sm
              transition
              active:scale-95
              disabled:opacity-30
            "
          >
            {isSending ? "…" : "↑"}
          </button>
        </form>
      </section>
    </div>
  );
}