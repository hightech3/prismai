import { BASE_URL } from "@/conf";
import { IResponse } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ResponseState {
  responses: IResponse[];
  loading: boolean;
  error: string | null
}

const initialState: ResponseState = {
  responses: [],
  loading: false,
  error: null
};

export const fetchResponse = createAsyncThunk(
  "responses/fetchResponse",
  async ({ query, msg_id }: { query: string; msg_id: string }, { rejectWithValue, dispatch }) => {
    try {

      const gptStream = await fetch(`${BASE_URL}/api/chat/financial-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!gptStream.body) return;

      const decoder = new TextDecoderStream('utf-8');
      const reader = gptStream.body.pipeThrough(decoder).getReader();
      let answer = "";
      let done = false;
      let graph_data: JSON[] = [];
      let frontier_data: JSON | null = null;
      while (!done) {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        if (done) {
          dispatch(updateAnswer({ msg_id, answer, graph_data, frontier_data }));
          break;
        };

        if (value?.startsWith('w: ')) {
          const weight = JSON.parse(value.replace('w: ', ''));
          graph_data.push(weight);
        } else if (value?.includes('f: ')) {
          const frontierString = value.split('f: ')[1];
          try {
            const colonIndex = frontierString.indexOf(':');
            if (colonIndex !== -1) {
              const key = frontierString.substring(0, colonIndex);
              const valueArray = JSON.parse(frontierString.substring(colonIndex + 1));
              if (frontier_data === null) {
                frontier_data = {} as JSON;
              }
              frontier_data = {
                ...frontier_data,
                [key]: valueArray
              } as JSON;
            }
          } catch (e) {
            console.error("Error parsing frontier data:", e);
          }
        }
        else {
          answer += value;
        }
        dispatch(updateAnswer({ msg_id, answer, graph_data: null, frontier_data: null }));
      }
      return {
        query,
        answer,
      };

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching response:', error.message);
        return rejectWithValue(error.message || "Failed to fetch response");
      } else {
        console.error('An unknown error occurred');
      }
    }
  }
);

const responseSlice = createSlice({
  name: "responses",
  initialState,
  reducers: {
    addQuery: (state, action: PayloadAction<IResponse>) => {
      state.responses.push(action.payload);
    },
    reset: (state) => {
      state.responses = [];
      state.loading = false;
      state.error = null;
    },
    updateAnswer(state, action: PayloadAction<{ msg_id: string; answer: string, graph_data: JSON[] | null, frontier_data: JSON | null }>) {
      const { msg_id, answer, graph_data, frontier_data } = action.payload;
      const existingResponse = state.responses.find(
        (response) => response.id === msg_id
      );

      if (existingResponse) {
        existingResponse.answer = answer;
        existingResponse.graph_data = graph_data;
        existingResponse.frontier_data = frontier_data;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponse.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResponse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addQuery, updateAnswer, reset } = responseSlice.actions;
export default responseSlice.reducer;