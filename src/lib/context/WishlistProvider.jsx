"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getWishlistIds } from "@/lib/api/wishlist";
import { toggleWishlistItem } from "@/lib/actions/wishlist";
import { useUserClientSession } from "@/lib/api/getUserServerSession";
import { toast } from "react-toastify";

const WishlistContext = createContext(null);

/**
 * WishlistProvider
 * ─────────────────
 * Manages the wishlist ID set globally so every CourseCard knows
 * whether its course is wishlisted without individual API calls.
 *
 * Only fetches / allows toggling when the user is a student.
 */
export function WishlistProvider({ children }) {
  const { user, isPending } = useUserClientSession();

  // Set of courseId strings that are currently in the wishlist
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  // Tracks which courseIds are mid-flight (prevents double-clicks)
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [initialized, setInitialized] = useState(false);

  const isStudent = user?.role === "student";

  // On mount (or when user becomes available), seed wishlist IDs from the backend
  useEffect(() => {
    if (isPending || !isStudent || !user?.id) return;

    let cancelled = false;

    const seedWishlist = async () => {
      try {
        const res = await getWishlistIds(user.id);
        if (!cancelled && res?.success) {
          setWishlistedIds(new Set(res.data));
        }
      } catch {
        // Silently ignore — wishlist state will just be empty
      } finally {
        if (!cancelled) setInitialized(true);
      }
    };

    seedWishlist();

    return () => {
      cancelled = true;
    };
  }, [user?.id, isStudent, isPending]);

  /**
   * Toggle a course in/out of the wishlist.
   * Implements optimistic UI: updates local state immediately,
   * rolls back if the API call fails.
   */
  const toggleWishlist = useCallback(
    async (courseId, courseTitle) => {
      if (!isStudent || !user?.id) return;
      if (loadingIds.has(courseId)) return; // Prevent double-click

      const wasWishlisted = wishlistedIds.has(courseId);

      // Optimistic update
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        wasWishlisted ? next.delete(courseId) : next.add(courseId);
        return next;
      });
      setLoadingIds((prev) => new Set(prev).add(courseId));

      try {
        const res = await toggleWishlistItem(courseId, user.id);

        if (res?.success) {
          if (res.action === "added") {
            toast.success(`"${courseTitle}" added to wishlist! 💜`);
          } else {
            toast.info(`"${courseTitle}" removed from wishlist.`);
          }
        } else {
          // Revert on error
          setWishlistedIds((prev) => {
            const next = new Set(prev);
            wasWishlisted ? next.add(courseId) : next.delete(courseId);
            return next;
          });
          toast.error(res?.message || "Failed to update wishlist.");
        }
      } catch {
        // Revert on network failure
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          wasWishlisted ? next.add(courseId) : next.delete(courseId);
          return next;
        });
        toast.error("Network error. Could not update wishlist.");
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(courseId);
          return next;
        });
      }
    },
    [isStudent, user?.id, wishlistedIds, loadingIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistedIds,
        toggleWishlist,
        loadingIds,
        isStudent,
        initialized,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/** Hook to consume wishlist state anywhere in the tree */
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  }
  return ctx;
};
