"use client";

import * as React from "react";
import { useState } from "react";

import { Textarea } from "./ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, PaperclipIcon, StopCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { IResponse } from "@/types";
import { addQuery, fetchResponse } from "@/redux/store/slices/responseSlice";
import { useRouter } from "next/navigation";

export function AppPrompt() {

  const { loading } = useSelector((state: RootState) => state.responses);
  const [query, setQuery] = useState<string>("");
  const [rows, setRows] = useState<number>(3);
  const MAX_ROWS = 8;
  const INITIAL_ROWS = 3;

  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();

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
    }
  };

  const handleScrollBottom = () => {
    const lastMessage = document.getElementById("last-message");
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
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
        disabled={loading}
      />
      <div className="flex items-center justify-between bg-neutral-100 px-2 pb-2 max-sm:flex-col rounded-b-3xl">
        <div className="flex space-x-0 md:space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-neutral-200 hover:bg-neutral-300 w-7 h-7"
            disabled
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-neutral-950 hover:bg-neutral-800 w-7 h-7"
            disabled
          >
            <Mic className="h-4 w-4" color="white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSubmit}
            className="rounded-full bg-neutral-950 hover:bg-neutral-800 w-7 h-7"
            disabled={loading || query.trim() === ''}
          >
            {loading ? <StopCircle className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" color="white" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
