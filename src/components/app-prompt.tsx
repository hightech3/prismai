"use client";

import * as React from "react";
import { useState } from "react";

import { Textarea } from "./ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, PaperclipIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { IResponse } from "@/types";
import { addQuery, fetchResponse } from "@/redux/store/slices/responseSlice";
import { useRouter } from "next/navigation";
import { useScroll } from "@/providers/scroll-provider";

export function AppPrompt() {
  const [query, setQuery] = useState<string>("");
  const [rows, setRows] = useState<number>(3);
  const MAX_ROWS = 8;
  const INITIAL_ROWS = 3;
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const { handleScrollBottom } = useScroll();

  const handleSubmit = async () => {
    const user_query = query.trim();
    setQuery('');
    if (user_query) {
      handleScrollBottom();
      const msg_id = uuidv4();
      const temporaryResponse: IResponse = {
        id: msg_id,
        query: user_query,
        answer: '',
      };
      dispatch(addQuery(temporaryResponse));
      router.push("/assistant");
      await dispatch(fetchResponse({ query: user_query, msg_id })).unwrap();
      handleScrollBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        setTimeout(() => {
          handleSubmit();
        }, 0);
      } else if (rows < MAX_ROWS) {
        setRows(rows + 1);
      }
    }
  };

  return (
    <div className="relative w-full max-w-[720px] flex flex-col justify-center mb-4">
      <Textarea
        placeholder="Ask follow-up"
        className="resize-none rounded-t-3xl rounded-b-none bg-neutral-100 border-none p-4 pb-0 text-[16px] placeholder:text-[16px] placeholder:text-neutral-400"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value === '') {
            setRows(INITIAL_ROWS);
          }
        }}
        onKeyDown={handleKeyPress}
        rows={rows}
      />
      <div className="flex items-center justify-between bg-neutral-100 px-2 pb-2 max-sm:flex-col rounded-b-3xl">
        <div className="flex space-x-0 md:space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-neutral-200 hover:bg-neutral-300 w-7 h-7">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSubmit}
            className="rounded-full bg-neutral-200 hover:bg-neutral-300 w-7 h-7"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-neutral-200 hover:bg-neutral-300 w-7 h-7"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
