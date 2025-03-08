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
      let graph_data: JSON[] | null = null;
      let frontier_data: JSON | null = null;
      while (!done) {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        if (!done) {
          if (value?.includes('{"weights":')) {
            let first_num = value.indexOf('{"weights":');
            let second_num = value.indexOf('}]') + 2;
            graph_data = JSON.parse(value.substring(first_num, second_num) + '}').weights;

            answer += value.substring(0, first_num);
          }
          if (value?.includes('"frontier":')) {
            let first_num = value.indexOf('"frontier":') + 12;
            let second_num = value.indexOf('}}}') + 2;
            frontier_data = JSON.parse(value.substring(first_num, second_num));
            answer += value.substring(second_num);
          }
          else {
            answer += value;
          }
        }
        dispatch(updateAnswer({ msg_id, answer, graph_data, frontier_data }));
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

export const { addQuery, updateAnswer } = responseSlice.actions;
export default responseSlice.reducer;