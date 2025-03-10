'use client'

import { BrainIcon, RefreshCwIcon, ThumbsUpIcon, ThumbsDownIcon, CopyIcon, MoreHorizontalIcon, Share2Icon, CheckIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";

import { CodeBlock, codepen } from 'react-code-blocks';
import { Label } from "@/components/ui/label";
import PieChartComponent from "@/components/ui/pie-chart";
import StackedAreaChart from "@/components/ui/area-chart";
import { useScroll } from "@/providers/scroll-provider";
type Block = TextBlock | CodeBlock;
type TextBlock = { type: 'text'; content: string; };
type CodeBlock = { type: 'code'; content: string; language: string; complete: boolean; code: string; };

const parseBlocks = (text: string): Block[] => {

    const codeBlockRegex = /`{3,}([\w\\.+]+)?\n([\s\S]*?)(`{3,}|$)/g;
    const result: Block[] = [];

    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        const markdownLanguage = (match[1] || '').trim();
        const code = match[2].trim();
        const blockEnd: string = match[3];
        const codeLanguage = markdownLanguage || 'javascript';

        result.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        result.push({ type: 'code', content: code, language: codeLanguage, complete: blockEnd.startsWith('```'), code });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        result.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return result;
};

const ChatGPTResponseRenderer = ({ response }: { response: any }) => {
    return (
        <div className="p-2">
            {
                parseBlocks(response.answer).map((block, index) => (
                    block.type === 'code' ? (
                        <CodeBlock
                            key={index}
                            text={block.code}
                            language={block.language}
                            theme={codepen}
                            showLineNumbers
                        />
                    ) : (
                        <ReactMarkdown key={index} className="answer-markdown text-[16px] font-normal" remarkPlugins={[remarkGfm]}>
                            {block.content}
                        </ReactMarkdown>
                    )
                ))
            }
            {response.graph_data && response.graph_data.length > 0 && <div className="flex flex-col items-center"> <Label className={`text-lg`}>Allocation Weights</Label> <PieChartComponent data={response.graph_data} /></div>}

            {response.frontier_data && <div className="flex flex-col items-center"> <Label className={`text-lg`}>Frontier Chart</Label> <StackedAreaChart data={Object.values(response.frontier_data)} /> </div>}
        </div>
    );
};

export default function AssistantPage() {

    const { responses } = useSelector((state: RootState) => state.responses);

    const lastMessageRef = useRef<HTMLDivElement>(null);
    // const exampleResponses = [
    //     {
    //         query: "What is the capital of France?",
    //         answer: "The capital of France is Paris."
    //     },

    // ];

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [responses]);

    return (
        <div className="flex-1 h-full w-full max-w-[720px] mx-auto pb-56 text-neutral-900">
            {
                responses.map((response, index) => (
                    <div key={index}>
                        {
                            response.query && (
                                <div className="flex flex-row justify-end">
                                    <div className="self-end bg-neutral-100 rounded-3xl py-2 px-4 max-w-[600px]">
                                        <p className="text-[16px]">
                                            {response.query}
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                        <div>
                            <div className="flex flex-row p-2 gap-2 items-center">
                                <BrainIcon className="w-4 h-4" />
                                <span className="scroll-m-20 text-xl font-medium tracking-tight transition-colors first:mt-0">
                                    Answer
                                </span>
                            </div>
                            {
                                response.answer ? (<ChatGPTResponseRenderer response={response} />
                                ) : (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[100%] rounded-xl" />
                                        <Skeleton className="h-4 w-[80%] rounded-xl" />
                                        <Skeleton className="h-4 w-[60%] rounded-xl" />
                                        <Skeleton className="h-4 w-[40%] rounded-xl" />
                                    </div>
                                )
                            }

                        </div>
                    </div>
                ))
            }
            <div ref={lastMessageRef} id="last-message" />
        </div >
    )
}
