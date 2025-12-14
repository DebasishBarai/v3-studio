"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle2,
  Loader2,
  Circle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type Props = {
  video: any; // Convex video document
};

export function AutoGenerateProgressDialog({ video }: Props) {
  const isRunning = video.autoGenerate === true;

  // ---------------------------
  // Progress calculation
  // ---------------------------
  const totalCharacters = video.characters.length;
  const completedCharacters = video.characters.filter(
    (c: any) => c.imageUrl
  ).length;

  const totalSceneSteps = video.scenes.length * 3;
  const completedSceneSteps =
    video.scenes.filter((s: any) => s.audioUrl).length +
    video.scenes.filter((s: any) => s.imageUrl).length +
    video.scenes.filter((s: any) => s.videoUrl).length;

  const totalSteps = totalCharacters + totalSceneSteps;
  const completedSteps = completedCharacters + completedSceneSteps;

  const progress =
    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  // ---------------------------
  // Status resolver
  // ---------------------------
  const renderStatusIcon = (opts: {
    done?: boolean;
    inProcess?: boolean;
  }) => {
    if (opts.done) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (opts.inProcess) {
      return (
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin animate-pulse" />
      );
    }
    return <Circle className="h-4 w-4 text-muted-foreground opacity-40" />;
  };

  return (
    <Dialog
      open={true}
      // ❌ Disable closing while running
      onOpenChange={(open) => {
        if (!isRunning && !open) return;
      }}
    >
      <DialogContent
        className="max-w-2xl"
        // prevent ESC close
        onEscapeKeyDown={(e) => {
          if (isRunning) e.preventDefault();
        }}
        // prevent outside click close
        onPointerDownOutside={(e) => {
          if (isRunning) e.preventDefault();
        }}
      >
        {/* ---------------- HEADER ---------------- */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isRunning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Auto-generating video
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-green-500" />
                Generation complete
              </>
            )}
          </DialogTitle>

          <DialogDescription>
            {isRunning ? (
              <span className="text-sm text-muted-foreground">
                You can leave this page — generation will continue.
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Your video has been successfully generated.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* ---------------- PROGRESS ---------------- */}
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="text-xs text-muted-foreground text-right">
            {progress}% complete
          </div>
        </div>

        <Separator />

        {/* ---------------- CONTENT ---------------- */}
        <ScrollArea className="max-h-[420px] pr-2">
          <div className="space-y-6">

            {/* ---------- CHARACTERS ---------- */}
            <Card className="p-4 space-y-3">
              <h3 className="font-medium">Characters</h3>

              <div className="space-y-2">
                {video.characters.map((character: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {renderStatusIcon({
                        done: !!character.imageUrl,
                        inProcess: character.inProcess,
                      })}
                      <span
                        className={
                          character.imageUrl
                            ? ""
                            : "text-muted-foreground"
                        }
                      >
                        {character.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ---------- SCENES ---------- */}
            <Card className="p-4 space-y-4">
              <h3 className="font-medium">Scenes</h3>

              <div className="space-y-4">
                {video.scenes.map((scene: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-sm font-medium">
                      Scene {idx + 1}
                    </div>

                    <div className="grid grid-cols-3 gap-3 pl-2">
                      <div className="flex items-center gap-2 text-sm">
                        {renderStatusIcon({
                          done: !!scene.audioUrl,
                          inProcess: scene.audioInProcess,
                        })}
                        <span className={!scene.audioUrl ? "opacity-60" : ""}>
                          Audio
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        {renderStatusIcon({
                          done: !!scene.imageUrl,
                          inProcess: scene.imageInProcess,
                        })}
                        <span className={!scene.imageUrl ? "opacity-60" : ""}>
                          Image
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        {renderStatusIcon({
                          done: !!scene.videoUrl,
                          inProcess: scene.videoInProcess,
                        })}
                        <span className={!scene.videoUrl ? "opacity-60" : ""}>
                          Video
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </ScrollArea>

        {/* ---------------- FOOTER ---------------- */}
        {/* {!isRunning && ( */}
        {/*   <div className="flex justify-end pt-2"> */}
        {/*     <Button */}
        {/*       onClick={onPreview} */}
        {/*       className="flex items-center gap-2" */}
        {/*     > */}
        {/*       Preview video */}
        {/*       <ArrowRight className="h-4 w-4" /> */}
        {/*     </Button> */}
        {/*   </div> */}
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
}
