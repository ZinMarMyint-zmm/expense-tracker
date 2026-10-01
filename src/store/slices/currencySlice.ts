import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Currency } from "@/lib/currency";



type CurrencyState = {
    currency : Currency
}

const initialState: CurrencyState = {
    currency : 'THB'
}

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action:PayloadAction<Currency>) => {
            state.currency = action.payload
        }
    }
})
export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;