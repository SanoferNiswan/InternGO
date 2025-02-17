import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  mentors: [],
  filters: {
    years: [],
    statuses: [],
    designations: [],
    batches: [],
  }, 
  loading: false,
  error: null,
};

export const fetchMentors = createAsyncThunk(
  "data/fetchMentors",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; 
      const response = await axios.get("/api/users/role/fetch", {
        headers: { Authorization: `Bearer ${token}` },
        params: { roleName: ["Mentors"] },
      });
      return response.data.data.map((mentor) => mentor.name);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching mentors");
    }
  }
);

export const fetchFilters = createAsyncThunk("data/fetchFilters", async (_, { getState,rejectWithValue }) => {
  console.log("inside redux thunk filters");
  
  try {
    const token = getState().auth.token; 
    const response = await axios.get("/api/users/distinct/filters",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    console.log("response : ",response);
    return response.data.data;
  } catch (error) {
    // return rejectWithValue(error.response?.data?.message || "Error fetching filters");
    return rejectWithValue(JSON.stringify(error));
  }
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.loading = false;
        state.mentors = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.filters = action.payload;
      })
      .addCase(fetchFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
