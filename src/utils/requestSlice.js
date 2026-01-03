import { createSlice } from "@reduxjs/toolkit";

export const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequests:(state,action)=>{
        let requests = state.filter((req)=>req._id!=action.payload)
        return requests
    }
  },
});

export const { addRequests,removeRequests } = requestSlice.actions;

export default requestSlice.reducer;
