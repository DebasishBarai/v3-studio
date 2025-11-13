/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ad_ad from "../ad/ad.js";
import type * as ad_generateAdImage from "../ad/generateAdImage.js";
import type * as ad_generateAdVideo from "../ad/generateAdVideo.js";
import type * as helper from "../helper.js";
import type * as http from "../http.js";
import type * as order from "../order.js";
import type * as polar from "../polar.js";
import type * as prompt from "../prompt.js";
import type * as storage from "../storage.js";
import type * as suggestion from "../suggestion.js";
import type * as user from "../user.js";
import type * as video_generateVideo from "../video/generateVideo.js";
import type * as video_generateVideoImage from "../video/generateVideoImage.js";
import type * as video_generateVideoScript from "../video/generateVideoScript.js";
import type * as video_video from "../video/video.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "ad/ad": typeof ad_ad;
  "ad/generateAdImage": typeof ad_generateAdImage;
  "ad/generateAdVideo": typeof ad_generateAdVideo;
  helper: typeof helper;
  http: typeof http;
  order: typeof order;
  polar: typeof polar;
  prompt: typeof prompt;
  storage: typeof storage;
  suggestion: typeof suggestion;
  user: typeof user;
  "video/generateVideo": typeof video_generateVideo;
  "video/generateVideoImage": typeof video_generateVideoImage;
  "video/generateVideoScript": typeof video_generateVideoScript;
  "video/video": typeof video_video;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
