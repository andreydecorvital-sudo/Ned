import { publishInstagramPost } from "@/lib/instagram-publisher";
import {
  claimSocialPost,
  getSocialPost,
  markSocialPostFailed,
  markSocialPostPublished,
} from "@/lib/social-store";

export async function processSocialPost(postId: string, includeDraft = false) {
  const claimed = await claimSocialPost(postId, includeDraft);
  if (!claimed) {
    const existing = await getSocialPost(postId);
    return {
      skipped: true,
      post: existing,
      reason: existing ? `STATUS_${existing.status.toUpperCase()}` : "NOT_FOUND",
    };
  }

  try {
    const mediaId = await publishInstagramPost(claimed);
    const post = await markSocialPostPublished(claimed.id, mediaId);
    return { skipped: false, post, mediaId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha desconhecida ao publicar.";
    await markSocialPostFailed(claimed.id, message);
    throw error;
  }
}
