"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { updateMatchScoreAction } from "../actions";
import { Input } from "@/components/ui/Input";
import { FormSection } from "@/components/ui/FormSection";
import { motion } from "framer-motion";

function StructuredScoreInput({ 
  sport, 
  name, 
  defaultValue, 
  label 
}: { 
  sport: string; 
  name: string; 
  defaultValue: string; 
  label: string;
}) {
  const [text, setText] = useState(defaultValue || "");

  const [runs, setRuns] = useState(() => {
    if (sport === "cricket" && defaultValue) {
      const match = defaultValue.match(/^(\d+)(?:\/(\d+))?(?:\s*\(([\d.]+)\s*ov\))?/i);
      return match ? (match[1] || "") : "";
    }
    return "";
  });
  const [wickets, setWickets] = useState(() => {
    if (sport === "cricket" && defaultValue) {
      const match = defaultValue.match(/^(\d+)(?:\/(\d+))?(?:\s*\(([\d.]+)\s*ov\))?/i);
      return match ? (match[2] || "") : "";
    }
    return "";
  });
  const [overs, setOvers] = useState(() => {
    if (sport === "cricket" && defaultValue) {
      const match = defaultValue.match(/^(\d+)(?:\/(\d+))?(?:\s*\(([\d.]+)\s*ov\))?/i);
      return match ? (match[3] || "") : "";
    }
    return "";
  });
  const [goals, setGoals] = useState(() => {
    if (sport === "football" && defaultValue) {
      const match = defaultValue.match(/^(\d+)$/);
      return match ? (match[1] || "") : "";
    }
    return "";
  });

  const updateCricket = (r: string, w: string, o: string) => {
    setRuns(r); setWickets(w); setOvers(o);
    let out = r;
    if (w) out += `/${w}`;
    if (o) out += ` (${o} ov)`;
    setText(out);
  };

  const updateFootball = (g: string) => {
    setGoals(g);
    setText(g);
  };

  if (sport === "cricket") {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
        <div className="flex gap-2 items-center">
          <Input 
            type="number" 
            placeholder="Runs" 
            value={runs} 
            onChange={(e) => updateCricket(e.target.value, wickets, overs)} 
            className="w-20 text-center"
          />
          <span className="text-slate-400 font-bold">/</span>
          <Input 
            type="number" 
            placeholder="W" 
            value={wickets} 
            onChange={(e) => updateCricket(runs, e.target.value, overs)} 
            className="w-16 text-center"
          />
          <span className="text-slate-400 font-bold ml-1">in</span>
          <Input 
            type="number" 
            step="0.1"
            placeholder="Overs" 
            value={overs} 
            onChange={(e) => updateCricket(runs, wickets, e.target.value)} 
            className="w-20 text-center"
          />
        </div>
        <input type="hidden" name={name} value={text} />
      </div>
    );
  }

  if (sport === "football") {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
        <div className="flex gap-2 items-center">
          <Button type="button" variant="secondary" size="sm" onClick={() => updateFootball(String(Math.max(0, (parseInt(goals)||0) - 1)))}>-</Button>
          <Input 
            type="number" 
            placeholder="Goals" 
            value={goals} 
            onChange={(e) => updateFootball(e.target.value)} 
            className="w-20 text-center font-bold"
          />
          <Button type="button" variant="secondary" size="sm" onClick={() => updateFootball(String((parseInt(goals)||0) + 1))}>+</Button>
        </div>
        <input type="hidden" name={name} value={text} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <Input
        type="text"
        id={name}
        name={name}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='e.g. "250/7" or "2"'
      />
    </div>
  );
}

interface ScorePanelProps {
  matchId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match: any;
}

export function ScorePanel({ matchId, match }: ScorePanelProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateMatchScoreAction(matchId, formData);
      if (res.success) {
        toast.success("Score updated.");
        router.push("/sports/matches");
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to update score");
      }
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormSection title="Live Score" description="Update the score summary visible on the match page.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <StructuredScoreInput 
            sport={match?.sport} 
            name="home_score" 
            defaultValue={match?.home_score} 
            label="Home Score" 
          />
          <StructuredScoreInput 
            sport={match?.sport} 
            name="away_score" 
            defaultValue={match?.away_score} 
            label="Away Score" 
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label htmlFor="live_status_text" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Live Status
          </label>
          <Input
            type="text"
            id="live_status_text"
            name="live_status_text"
            defaultValue={match?.live_status_text}
            placeholder="IND need 45 runs off 30 balls • 2nd innings"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label htmlFor="result_text" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Result Text
          </label>
          <Input
            type="text"
            id="result_text"
            name="result_text"
            defaultValue={match?.result_text}
            placeholder="India won by 5 wickets"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label htmlFor="winning_team" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Winning Team
          </label>
          <Input
            type="text"
            id="winning_team"
            name="winning_team"
            defaultValue={match?.winning_team}
            placeholder="India"
          />
        </div>
      </FormSection>

      <FormSection title="Additional Info" description="Toss and match notes.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="toss_info" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Toss Info
            </label>
            <Input
              type="text"
              id="toss_info"
              name="toss_info"
              defaultValue={match?.toss_info}
              placeholder="India won toss, elected to bat"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="match_note" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Match Note
            </label>
            <Input
              type="text"
              id="match_note"
              name="match_note"
              defaultValue={match?.match_note}
              placeholder="D/L method applied • Abandoned"
            />
          </div>
        </div>
      </FormSection>

      <div className="mt-6 flex justify-end">
        <Button type="submit" isLoading={isPending}>
          Update Score
        </Button>
      </div>
    </motion.form>
  );
}
